<?php 
namespace App\Helpers\Auth;

use App\Helpers\DB\Models;
use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Auth;

class Role {

    function __construct(){
    }
    public static function checkRoot(){
        return Auth::user()->{USER_ROLE} == 0;
    }

    public static function isOffline(){
        return Auth::user()->{USER_OFFLINE} == 1;
    }

    public static function getWorkspace(){
        if(self::checkRoot()){
            $workspace = '/';
        }else{
            $role = Models::get('Admin/User_roles')->read([[[USER_ROLE_ID, '=', Auth::user()->{USER_ROLE}]]]);
            if(!$role['result'] || !isset($role['data'][0])) Reply::finish(false, 'ERROR', ['data'=>'You don have Permission']);
            $workspace = $role['data'][0]->{USER_ROLE_WORKSPACE};
            if(Auth::user()->{USER_WORKSPACE} != null && Auth::user()->{USER_WORKSPACE} != ''){
                $workspace .= Auth::user()->{USER_WORKSPACE};
                $workspace = str_replace('//', '/', $workspace);
            }
        }
        return $workspace;
    }
}

?>