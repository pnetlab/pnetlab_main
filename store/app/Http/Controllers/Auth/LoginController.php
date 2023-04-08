<?php

namespace App\Http\Controllers\Auth;



use App\Http\Controllers\Controller;
use App\Helpers\Auth\AuthenticatesUsers;
use App\Helpers\Box\License;
use App\Helpers\Captcha\Captcha;
use App\Helpers\Request\Reply;
use Illuminate\Http\Request;
use App\Helpers\Control\Ctrl;
use App\Helpers\DB\Models;
use Exception;
use Illuminate\Queue\RedisQueue;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->middleware('guest')->except('logout');
        $this->authenModel = resolve('Models')->getModel('Auth/Authentication');
        $this->viewblade = 'reactjs.reactjs';
    }

    public function captcha(Request $request)
    {
        $id = $request->input('id', 'global');
        $captcha = Captcha::createCaptcha($id);
        Reply::finish(true, 'Success', $captcha);
    }

    public function license(Request $request)
    {

        // Is called affter login success from evestore.
        //update user and license to database
        try {

            exec('sudo ntpdate -u 1.pool.ntp.org > /dev/null 2>&1 &');

            $license = $request->input('license', false);
            if (!$license) throw new \Exception('No license. Login again');
            $html = $request->input('html', 1);
            /**
             *In case success create an account in local db then run origin login proccess of evelabbox
             */

            $localPass = uniqid("pnetlab");

            $userData = [
                USER_PASSWORD => hash('sha256', $localPass),
                USER_ROLE => null,
                USER_HTML5 => $html,
                USER_LICENSE => $license,
                USER_ONLINE_TIME => time(),
            ];

            $result = License::relicense(true, (object) $userData);

            if (!$result['result'])  throw new \Exception(get($result['data']['data'], ''));

            $userData = $result['data'];

            $this->apiLogin($userData->{USER_USERNAME}, $localPass, $html, 0);

            return redirect($request->input('link', '/'));
        } catch (\Exception $e) {
            return redirect('/auth/login/manager?error=' . str_limit($e->getMessage(), 500));
        }

    }


    /**
     * 
     * Login for offline account
     */
    public function login(Request $request)
    {
        try {
            $username = $request->input('username', '');
            $password = $request->input('password', '');
            $html = $request->input('html', '0');
            $captcha = $request->input('captcha', null);

            if(Ctrl::get(CTRL_CAPTCHA, true)){
                if($captcha == null || !Captcha::verifyCaptcha($captcha)){
                    throw new Exception('Captcha is Wrong');
                }
            }

            $this->apiLogin($username, $password, $html, 1); 
        } catch (\Exception $e) {
            Reply::finish(false, 'ERROR', ['data' => $e->getMessage()]);
        }
        Reply::finish(true, 'success');
        
    }

    private function apiLogin($username, $password, $html, $offline=0)
    {

        $html5_db = \html5_checkDatabase();
        $cookie = \genUuid();

        $ip = $_SERVER['REMOTE_ADDR'];
        $session = time() + SESSION;
        $userModel = Models::get('Admin/Users');
        if ($username == '' || $password == '') throw new Exception('Username or Password empty');
        $user = Models::get('Admin/Users')->read([[[USER_USERNAME, '=', $username], [USER_OFFLINE, '=', $offline] ]]);
        if (!$user['result'] || !isset($user['data'][0])) throw new Exception('Username is not existed');
        $user = $user['data'][0];

        $hashPass = hash('sha256', $password);

        if ($user->{USER_PASSWORD} != $hashPass) throw new Exception('Password is Wrong');

        $userModel->edit([
            DATA_KEY => [[[USER_POD, '=', $user->{USER_POD}]]],
            DATA_EDITOR => [
                USER_IP => $ip,
                USER_COOKIE => $cookie,
                USER_SESSION => $session,
                USER_HTML5 => $html,
            ]
        ]);

        $pod = $user->{USER_POD};
		$html5Pod = $pod + 1000;
		
		$query = "REPLACE INTO guacamole_entity (entity_id, name, type) VALUES (:entity_id, :name, 'USER')";
		$statement = $html5_db->prepare($query);
        $statement->execute(['entity_id'=> $html5Pod, 'name'=>$username]);
		
        $query = "REPLACE INTO guacamole_user (user_id, entity_id, password_hash, password_date) VALUES (:user_id, :entity_id, UNHEX(SHA2('".$hashPass."',256) ), NOW())";
        //echo $query; die;
		$statement = $html5_db->prepare($query);
        $statement->execute(['user_id'=> $html5Pod, 'entity_id'=> $html5Pod]);
		
        $role = 'READ';
        if ($user->{USER_ROLE} == 0) $role = 'UPDATE';
        $query = "REPLACE INTO guacamole_user_permission (entity_id, affected_user_id, permission) VALUES ( :entity_id , :affected_user_id , :permission ) ;";
        $statement = $html5_db->prepare($query);
        $statement->execute([
			'entity_id' => $html5Pod,
			'affected_user_id' => $html5Pod,
			'permission' => $role
		]);

        updateUserToken($username, $hashPass, $pod);
        
        Cookie::queue(Cookie::make('token', $cookie, 60, '/', $_SERVER['SERVER_NAME']));

        return true;
    }

    public function manager(Request $request)
    {
        // forward to coresponse login page
        $default = Ctrl::get(CTRL_DEFAULT_MODE, '');
        $isOffine = Ctrl::get(CTRL_OFFLINE_MODE, 0);
        $isOnline = Ctrl::get(CTRL_ONLINE_MODE, 0);

        $link = urlencode($request->input('link', '/'));
        $error = $request->input('error', '');
        $success = $request->input('success', '');

        if ($default == '' || ($isOffine == 0 && $isOnline == 0)) return redirect('/auth/login/initial');
        if ($default == 'online') return redirect('/auth/login/online?link=' . $link . '&error=' . $error . '&success=' . $success);
        if ($default == 'offline') return redirect('/auth/login/offline?link=' . $link . '&error=' . $error . '&success=' . $success);
    }

    public function initialOnline()
    {
        $isOffine = Ctrl::get(CTRL_OFFLINE_MODE, 0);
        $isOnline = Ctrl::get(CTRL_ONLINE_MODE, 0);
        if ($isOffine == 1 && $isOnline == 0) return redirect('/auth/login/initial?error=ONLINE Mode is disabled. If you want to using ONLINE mode, login by OFFLINE account then active ONLINE mode first.');
        if ($isOnline == 1) return redirect('/auth/login/online');
        Ctrl::set(CTRL_ONLINE_MODE, 1);
        Ctrl::set(CTRL_DEFAULT_MODE, 'online');
        return redirect('/auth/login/online?success=ONLINE mode is turned on. You need to register and login to PNETLab right now. The first ONLINE account logged into PNETLab will becomes the owner.');
    }

    public function initialOffline()
    {
        $isOnline = Ctrl::get(CTRL_ONLINE_MODE, 0);
        $isOffine = Ctrl::get(CTRL_OFFLINE_MODE, 0);
        if ($isOnline == 1 && $isOffine == 0) return redirect('/auth/login/initial?error=OFFLINE Mode is disabled. If you want to using OFFLINE mode, login by ONLINE account then active OFFLINE mode.');
        if ($isOffine == 1) return redirect('/auth/login/offline');

        $userModel = Models::get('Admin/Users');
        Ctrl::set(CTRL_OFFLINE_MODE, 1);
        Ctrl::set(CTRL_DEFAULT_MODE, 'offline');
        if ($userModel->is_exist([[ [USER_OFFLINE, '=', 1], [USER_ROLE, '=', 0] ]])) {
            License::keepalive();
            return redirect('/auth/login/offline?success=OFFLINE mode is turned on. Using OFFLINE Accounts to login');
        } else if($userModel->is_exist([[[USER_USERNAME, '=', 'admin']]])) {

            $result = $userModel->edit([
            DATA_KEY => [[[USER_USERNAME, '=', 'admin']]],
            DATA_EDITOR => [
                USER_ROLE => '0',
                USER_OFFLINE => '1',
                USER_STATUS => USER_STATUS_ACTIVE,
                USER_ONLINE_TIME => time(),
                USER_ACTIVE_TIME => null,
                USER_EXPIRED_TIME => null,
            ]]);

            if (!$result['result']) return $result;
            License::keepalive();
            Reply::finish(true, 'success', 'OFFLINE mode is turned on successfully. The Account with name "admin" has been set as Admin');

        }else{

            $result = $userModel->add([[
                USER_USERNAME => 'admin',
                USER_PASSWORD => hash('sha256', LOCAL_PASS),
                USER_ROLE => '0',
                USER_OFFLINE => '1',
                USER_ONLINE_TIME => time(),
                USER_STATUS => USER_STATUS_ACTIVE
            ]]);

            if (!$result['result']) return $result;
            License::keepalive();
            return redirect('/auth/login/offline?success=OFFLINE mode is turned on successfully. Default account to login is admin/'.LOCAL_PASS.'. For security reasons you should change it');
        }
    }

    public function initial()
    {
        $version = Ctrl::get(CTRL_VERSION, '4.0.0');
        return view($this->viewblade,  ['server'=>['version' => $version]]);
    }

    public function offline()
    {
        // offline login page
        $offline = Ctrl::get(CTRL_OFFLINE_MODE, 0);
        $online = Ctrl::get(CTRL_ONLINE_MODE, 1);
        if ($offline != 1) return redirect('/auth/login/initial?error=OFFLINE Mode is disabled. Login by ONLINE account and enable OFFLINE Mode first');
        $isCaptcha = Ctrl::get(CTRL_CAPTCHA, '1');
        $version = Ctrl::get(CTRL_VERSION, '4.0.0');
        $console = Ctrl::get(CTRL_DEFAULT_CONSOLE, '');
        
        return view($this->viewblade, ['server'=>['captcha' => $isCaptcha, 'version' => $version, 'console' => $console, 'online' => $online]]);
    }


    public function online(Request $request)
    {
        // offline login page

        $link = urlencode($request->input('link', '/'));
        $error = $request->input('error', '');
        $success = $request->input('success', '');

        $box_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://{$_SERVER['HTTP_HOST']}/store/public/auth/login/license";

        $online = Ctrl::get(CTRL_ONLINE_MODE, 0);
        $defaultConsole = Ctrl::get(CTRL_DEFAULT_CONSOLE, '');
        if ($online != 1) return redirect('/auth/login/initial?error=ONLINE Mode is disabled. Login by OFFLINE account and enable ONLINE Mode first');
        return redirect(APP_AUTHEN . '/login?console='.$defaultConsole.'&box=' . $box_link . '&link=' . $link . '&error=' . $error . '&success=' . $success);
    }
}
