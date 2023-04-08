<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Admin\Upgrade;
use App\Helpers\Auth\Role;
use App\Helpers\Box\License;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Auth;
use App\Helpers\View\JS;
use Illuminate\Support\Facades\Cookie;
use App\Helpers\Control\Ctrl;
use App\Helpers\DB\Models;
use Illuminate\Support\Facades\Response;

class DefaultController extends Controller
{

    function __construct()
    {
        //Load intital variable to page that is not React
        parent::__construct();
    }

    function initial()
    {

        Auth::check();
        $server = [];
        $user = Auth::user();
        if (!$user) $user = (object) [];

        $common = [
            'APP_SLOGAN' => APP_SLOGAN,
            'APP_TITLE' => APP_TITLE,
            'APP_DOMAIN' => APP_DOMAIN,
            'APP_AUTHEN' => APP_AUTHEN,
            'APP_UPLOAD' => APP_UPLOAD,
            'APP_ADMIN' => APP_ADMIN,
            'APP_CENTER' => APP_CENTER,
            CTRL_DOCKER_WIRESHARK => Ctrl::get(CTRL_DOCKER_WIRESHARK, '0'),
        ];


        JS::make_var($server + [
            'user' => [
                USER_USERNAME => isset($user->{USER_USERNAME}) ? $user->{USER_USERNAME} : '',
                USER_EMAIL => isset($user->{USER_EMAIL}) ? $user->{USER_EMAIL} : '',
                USER_ROLE => isset($user->{USER_ROLE}) ? $user->{USER_ROLE} : '',
                USER_HTML5 => isset($user->{USER_HTML5}) ? $user->{USER_HTML5} : '',
                USER_OFFLINE => isset($user->{USER_OFFLINE}) ? $user->{USER_OFFLINE} : '',
                USER_POD => isset($user->{USER_POD}) ? $user->{USER_POD} : '',
            ],

            'common' => $common,

        ], 'server', $result);



        $response = Response::make($result, 200);
        $response->header('Content-Type', 'application/javascript');
        return $response;
    }

    function language(Request $req)
    {
        $lang = str_replace('.', '', $req->input('lang', ''));
        $langRes = loadLanguage($lang);
        Reply::finish(true, 'success', $langRes);
    }

    function refreshToken()
    {
        $cookie = Cookie::get('token', '');
        Cookie::queue(Cookie::make('token', $cookie, 60, '/', $_SERVER['SERVER_NAME']));
        Models::get('Admin/Users')->edit([
            DATA_KEY => [[[USER_USERNAME, '=', Auth::user()->{USER_USERNAME}]]],
            DATA_EDITOR => [USER_ONLINE_TIME => time(), USER_SESSION => time() + SESSION],
        ]);
        Reply::finish(true, 'success', '');
    }

    function relicense()
    {
        License::relicense(false, Auth::user());
        Reply::finish(true, 'success', '');
    }

    public function folder(Request $req)
    {
        try {
            $folder = $req->input('folder', '');
            if ($folder == '') Reply::finish(false, 'Folder is not found');
            $files = array_filter(glob($folder . '/*'), 'is_file');
            $folders = glob($folder . '/*', GLOB_ONLYDIR);

            Reply::finish(true, 'Success', [
                'files' => array_values($files),
                'folders' => array_values($folders),
            ]);
        } catch (\ErrorException $e) {
            Reply::finish(false, $e->getMessage());
        }
    }

    public function getVersion()
    {
        $version = Ctrl::get(CTRL_VERSION, '1.0.0');
        $latest = Upgrade::checkUpgrade();
        if (!$latest['result'] || !isset($latest['data'])) {
            Reply::finish(false, 'Can not check for updates');
        }
        $latest = $latest['data'];
        Reply::finish(true, 'success', ['version' => $version, 'latest' => $latest]);
    }

    public function upgrade()
    {
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        exec('sudo ps -aux | grep "artisan upgrade" | grep -v grep', $output);
        if(count($output) > 0) Reply::finish(true, 'success');
        exec('sudo php /opt/unetlab/html/store/artisan upgrade now > /dev/null 2>&1 &');
        $processModel = Models::get('Admin/Process');
        $proccessId = 'upgrade';
        if (!$processModel->is_exist([[[PROCESS_ID, '=', $proccessId]]])) {
            $processResult = $processModel->add([[PROCESS_ID => $proccessId, PROCESS_DTOTAL => 0, PROCESS_DNOW => 0]]);
            if (!$processResult['result']) return $processResult;
        }
        Reply::finish(true, 'success');
    }

    public function upgrading()
    {
        //Check upgrade proccess
        $processModel = Models::get('Admin/Process');
        $result = $processModel->read([[[PROCESS_ID, '=', 'upgrade']]]);
        if (!$result['result']) return;
        if (!isset($result['data'][0])) {
            Reply::finish(true, 'Success', [true, Ctrl::get(CTRL_VERSION, '1.0.0')]);
        } else {
            $percent = 0;
            $proccess = $result['data'][0];
            if ($proccess->{PROCESS_DTOTAL} > 0) {
                $percent = floor($proccess->{PROCESS_DNOW} * 100 / $proccess->{PROCESS_DTOTAL});
            }

            Reply::finish(true, 'Success', [false, $percent]);
        }
    }

    public function changeConsole(Request $request)
    {
        

        $html = $request->input('html', 1);
        /**
         *In case success create an account in local db then run origin login proccess of evelabbox
         */
        $userModel = Models::get('Admin/Users');
        $result = $userModel->edit([
            DATA_KEY => [[[USER_USERNAME, '=', Auth::user()->{USER_USERNAME}]]],
            DATA_EDITOR => [USER_HTML5 => $html],
        ]);

        return $result;


        // require_once(BASE_DIR . '/html/includes/api_authentication.php');

        // $db = \checkDatabase();
        // $html5_db = \html5_checkDatabase();
        // $cookie = \genUuid();

        // $p = [
        //     'username' => Auth::user()->{USER_USERNAME},
        //     'password' => LOCAL_PASS,
        //     'html5' => $html,
        //     'pod' => Auth::user()->{USER_POD},
        //     'role' => Auth::user()->{USER_ROLE},
        // ];

        // $output = \apiLogin($db, $html5_db, $p, $cookie);
        // if ($output['code'] == 200) {

        //     Cookie::queue(Cookie::make('token', $cookie, 60, '/', $_SERVER['SERVER_NAME']));

        //     Reply::finish(true, 'success');
        // }
        // Reply::finish(false, 'ERROR', ['data'=>$output['message']]);

    }

    public function updateGuacToken()
    {
        \updateUserToken(Auth::user()->{USER_USERNAME}, Auth::user()->{USER_PASSWORD}, Auth::user()->{USER_POD});
        Reply::finish(true, 'success', '');
    }



    public function idlepc(Request $req){
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        set_time_limit(180);


        $ios = secureCmd($req->input('ios', ''));
        $template = secureCmd($req->input('template', ''));

        if($ios == '' || $template == ''){
            Reply::finish(false, 'Data is empty');
        }

        $dynamipFolder = '/opt/unetlab/addons/dynamips';
        $tempFolder = '/opt/unetlab/html/templates';

        $file = $tempFolder . '/'. $template.'.yml';
        if(!is_file($file)){
            Reply::finish(false, '{data} not found', ['data' => $file]);
        }
        $content = file_get_contents($file);
        $p = yaml_parse_file($file);

        $option = secureCmd(get($p['dynamips_options'], ''));

        $cmd = 'sudo /opt/unetlab/html/store/app/Console/Commands/idlepc --option="'.$option.'" -f ' . $dynamipFolder. '/'. $ios;
       
        exec($cmd, $o, $r);

        if($r != 0){
            Reply::finish(false, 'Can not get Idle-PC');
        }
        $idlepc = '';
        foreach($o as $output){
            if(preg_match('/idle-pc=(\w+)/', $output, $matches)){
                $idlepc = $matches[1];
            }
        }
        if($idlepc == ''){
            Reply::finish(false, 'Can not get Idle-PC');
        }

        
        if(!isset($p['idlepc'])){
            $content = preg_replace('/^name\s?:\s?(.+)$/m', 'name: $1\nidlepc: "'.$idlepc.'"', $content);
        }else{
            $content = preg_replace('/^idlepc\s?:\s?(.+)$/m', 'idlepc: "'.$idlepc.'"', $content);
        }

        exec('sudo chown www-data:www-data '. $file);
    
        file_put_contents($file, $content);

        Reply::finish(true, 'idlepc_success_alert', ['idlepc'=>$idlepc, 'file' => basename($file)]);

    }
}
