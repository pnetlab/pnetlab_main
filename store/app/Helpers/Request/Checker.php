<?php 
namespace App\Helpers\Request;

use Exception;
use Illuminate\Support\Facades\Validator;

class Checker {
    
    public static $REGEX = array(
        'IPv4' => "/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-4])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-4])$/",
        'Netmask' => "/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/",
        'Email' => "/^[\w\d\.\-\+\_]+\@[\w\d\.\-\+\_]+$/",
        'Number' => "/^[\d\.\-]+$/",
        'Word' => "/^[\w\x{00C0}-\x{00FF}\x{1EA0}-\x{1EFF}]+$/u",
        'Name' => "/^[\w\s\.\_\-\x{00C0}-\x{00FF}\x{1EA0}-\x{1EFF}]+$/u",
        'Domain' => "/^[a-z\.A-Z\-0-9\_]+\.[a-zA-Z0-9\-]+$/",
        'Phone' => "/^[\d\+\-\s]+$/",
        'DateTime' => "/^[\d\-\s\:]+$/",
        'Varchar'=>"/^[\\\\\/\|\#\@\+\…\,\.\{\}\[\]\(\)\~\w\s\–\_\-\:\%\$\^\&\*\;\=\?\!\x{00C0}-\x{00FF}\x{1EA0}-\x{1EFF}]+$/u",
        'Path' => "/^[\w\s\_\-\:\/\.\x{00C0}-\x{00FF}\x{1EA0}-\x{1EFF}]+$/u",
        'Logic' => "/^[\<\>\=\w\!]+$/u",
        'SQL' => '/^[^\"\'\`]+$/u',
    );
    
    public static $log = '';

    public static function validate($data, $regexType = null){
//         try{
            
            if($regexType == 'Pass'){
                return true;
            }
            
            if (is_array($data)) {
                $checkResult = true;
                foreach ($data as $value) {
                    
                    if(!self::validate($value, $regexType)){
                        return false;
                    };
                    
                }
                return $checkResult;
            } else {
                self::$log = $regexType.': '.$data;
                
                if($regexType == 'Json'){
                    if ($data == "") return true;
                    json_decode($data);
                    return (json_last_error() == JSON_ERROR_NONE);
                }
                
                if(isset(self::$REGEX[$regexType])){
                    if (preg_match(self::$REGEX[$regexType], $data) || $data == "") {
                        return true;
                    } else {
                        return false;
                    }
                }
                
                $validator = Validator::make(['data'=>$data], ['data'=>$regexType]);
                if($validator->passes()){
                    return true;
                }else{
                    self::$log = $validator->errors()->all()[0];
                    return false;
                } 
                
                
            }
//         }catch (Exception $e){
//             return false;
//         }
    }

    public static function method($method){
        $request = request();
        if(!$request->isMethod($method)) Reply::finish(false, 'ERROR', ['data' => 'Not Support']);
        return true;
    }

}

?>