<?php
namespace App\Helpers\Request;

use App\Exceptions\FinishException;

class Reply
{
    
    private static $response = null;

    public static function make($result = false, $message = "", $data = "", $status = '202')
    {
        return array(
            'result' => $result,
            'message' => $message,
            'data' => $data,
            'status' => $status
        );
    }

//     public static function finish($result = false, $message = "", $data = "", $status = '202')
//     {
//         self::reply(self::make($result, $message, $data, $status));
//     }

    public static function prepare($callBack){
        if(is_null(self::$response)){
            self::$response = response();
        }
        $callBack(self::$response);
    }

    public static function finish()
    {
        $parameters = func_get_args();
        if (isset($parameters[0]) && is_array($parameters[0])) {
            $reply = $parameters[0];
            if(is_null(self::$response)){
                self::$response = response();
            }
            $res = self::$response->json(
                array(
                    'result' => get($reply['result']),
                    'message' => get($reply['message']),
                    'data' => get($reply['data'])
                ),
                get($reply['status'], '202')
            );
            
            throw new FinishException($res);
        }else{
            self::finish(self::make(...$parameters));
        }
    }
}

?>