<?php 
namespace App\Helpers\Box;

use App\Helpers\Control\Ctrl;
use App\Helpers\DB\Models;
use App\Helpers\Request\Query;
use App\Helpers\Request\Reply;

class License {
    
    public static function relicense($login = false, $userData){
        
        $license = isset($userData->{USER_LICENSE})? $userData->{USER_LICENSE}: '';
       
        if($license == ''){
            return Reply::make(false, ERROR_UNDEFINE, ['data'=>'license']);
        }

        $postData = [];
        if($login){
            $postData['uuid'] = self::get_uuid();
            $postData['version'] = Ctrl::get(CTRL_VERSION, '1.0.0');
        }
        
        $result = Query::center(APP_CENTER.'/api/boxs/box/relicense', 'post', $postData, ['dataType'=>'json', 'user'=>$userData]);
        
        if(!$result){
            return Reply::make(false, 'ERROR', ['data'=>'Can not refresh license']);
        }

        if(!$result['result']){ 
            return $result;
        }
       
        $userModel = Models::get('Admin/Users');

        $license = get($result['data'], '');
        
        if($login){
            $message = get($result['message'], []);
            $role = get($message['role'], null);
            $email = get($message['email'], null);
            $username = get($message['username'], '');
            $username = preg_replace('/[^\x00-\x7F]/', "_", $username);

            $userData->{USER_ROLE} = $role;
            $userData->{USER_EMAIL} = $email;
            $userData->{USER_USERNAME} = $username.'_online_account';
            $userData->{USER_LICENSE} = $license;
            $userData->{USER_OFFLINE} = '0';
            if($userData->{USER_ROLE} == 'admin'){
                $userData->{USER_ROLE} = 0;
            }else{
                unset($userData->{USER_ROLE});
            }
            
            if ($userModel->is_exist([[[USER_EMAIL, '=', $userData->{USER_EMAIL}]]])) {
                
                $result = $userModel->edit([
                    DATA_KEY => [[ [USER_EMAIL, '=', $userData->{USER_EMAIL}] ]],
                    DATA_EDITOR => (array)$userData,
                ]);
                
                if(!$result['result']) return $result;
                
            } else {
                $userData->{USER_STATUS} = USER_STATUS_ACTIVE;
                $result = $userModel->add([(array)$userData]);
                if(!$result['result']) return $result;
            }

            $userData = $userModel->read([[ [USER_EMAIL, '=', $userData->{USER_EMAIL}] ]]);
            if(!$userData['result'] || !isset($userData['data'][0])) return Reply::make(false, 'ERROR', ['data'=>'No User']);
            $userData = $userData['data'][0];
        
        }else{
            Models::get('Admin/Users')->edit([
                DATA_KEY => [[[USER_LICENSE, '=', $userData->{USER_LICENSE}]]],
                DATA_EDITOR => [USER_LICENSE=> $license],
            ]);
        }
        
        return Reply::make(true, 'success', $userData);
    }

    public static function get_uuid(){
        return exec("sudo dmidecode --string system-uuid");
    }

    public static function updateUserLicense($user){
        // update license to running enviroiment. fix bug when uploading the license change.
        $userData = Models::get('Admin/Users')->read([[[USER_EMAIL, '=', $user->{USER_EMAIL}]]]);
        if($userData['result'] && isset($userData['data'][0])){
            $user->{USER_LICENSE} = $userData['data'][0]->{USER_LICENSE};
        }
        return $user;
    }

    public static function keepalive(){

        try {
            $result = Query::boxCenter(APP_CENTER.'/api/offboxs/box/relicense', [], ['dataType'=>'json']);
            if(!$result){
                return Reply::make(false, 'ERROR', ['data'=>'Can not refresh offline license']);
            }
            if($result['result']){ 
                Ctrl::set(CTRL_ALIVE_KEY, $result['data']);
            }
            return $result;
        } catch (\Exception $th) {
            return Reply::make(false, 'ERROR', $th->getMessage());
        }
        
    }
    
}
    