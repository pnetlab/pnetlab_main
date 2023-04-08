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
use App\Helpers\Request\Checker;
use App\Helpers\Request\Query;
use Illuminate\Support\Facades\Response;

class ModeController extends Controller  
{

    function __construct()
    {
        //Load intital variable to page that is not React
        parent::__construct();
        $this->viewblade = 'reactjs.reactjs';
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        
    }

    public function getModeData(){
        Checker::method('post');
        $inden = new \indentify();
        $defaultMode = Ctrl::get(CTRL_DEFAULT_MODE, '');
        $onlineMode = Ctrl::get(CTRL_ONLINE_MODE, '0');
        $offlineMode = Ctrl::get(CTRL_OFFLINE_MODE, '0');
        $captcha = Ctrl::get(CTRL_CAPTCHA, '1');
        
        $isAlive = true;
        Reply::finish(true, 'success', [
            'default' => $defaultMode,
            'online' => $onlineMode,
            'offline' => $offlineMode,
            'alive' => $isAlive,
            'captcha' => $captcha,
        ]);
    }

    public function getOwner(){
        $result = Query::boxCenter(APP_CENTER.'/api/offboxs/box/getOwner', [], ['dataType'=>'']);
        return $result;
    }

    public function setDefault(Request $request){
        $default = $request->input('default', '');
        Ctrl::set(CTRL_DEFAULT_MODE, $default);
        Reply::finish(true, 'success');
    }


    public function setOnline(Request $request){
        $online = $request->input('online', '0');
        Ctrl::set(CTRL_ONLINE_MODE, $online);
        Reply::finish(true, 'success');
    }

    public function setOffline(Request $request){
        $offline = $request->input('offline', '0');
        Ctrl::set(CTRL_OFFLINE_MODE, $offline);
        if($offline == 1){
            $userModel = Models::get('Admin/Users');
            if ($userModel->is_exist([[ [USER_OFFLINE, '=', 1], [USER_ROLE, '=', 0] ]])) {
                License::keepalive();
                Reply::finish(true, 'success', 'OFFLINE mode is turned on successfully. Using OFFLINE Accounts to login');
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
                    USER_STATUS => USER_STATUS_ACTIVE,
                    USER_ONLINE_TIME => time(),
                ]]);

                if (!$result['result']) return $result;
                License::keepalive();
                Reply::finish(true, 'success', 'OFFLINE mode is turned on successfully. Default account to login is admin/'.LOCAL_PASS.'. For security reasons you should change it');

            }
        }else{
            Reply::finish(true, 'success', 'OFFLINE Mode is disabled');
        }
        
    }

    public function setOfflineCaptcha(Request $request){
        $captcha = $request->input('captcha', '1');
        Ctrl::set(CTRL_CAPTCHA, $captcha);
        if($captcha == 1){
            $log = 'Captcha for Offline Login is enabled';
        }else{
            $log = 'Captcha for Offline Login is disabled';
        }
        Reply::finish(true, 'success', $log);
    }

    public function keepAlive(Request $request){
        $data = $request->all();
        $result = Query::boxCenter(APP_CENTER.'/api/offboxs/box/keepAlive', $data, ['dataType'=>'json']);
        if(!$result) Reply::finish(false, 'Can not connect to Server. Checking your internet');
        if(!$result['result']) return $result;
        Ctrl::set(CTRL_ALIVE_KEY, $result['data']);
        return Reply::finish(true, 'success', 'Your '.APP_NAME.' has been verified. You can receive notifications from the system.');
    }

    public function keepAliveCaptcha(Request $request){
        $data = $request->all();
        $result = Query::boxCenter(APP_CENTER.'/api/offboxs/box/keepAliveCaptcha', $data, ['dataType'=>'']);
        return $result;
    }

    public function view() 
    {
        return view($this->viewblade);
    }
    
    

}