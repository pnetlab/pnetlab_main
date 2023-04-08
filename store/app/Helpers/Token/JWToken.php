<?php 
namespace App\Helpers\Token;
use Exception;
use Firebase\JWT\JWT;

class JWToken {
    
    private static $log = '';

    public static function make($payload, $option=null){
        $payload = (array)$payload;
        $option = get($option, []);
        $key = get($option['key'], config('jwt.secret'));
        $algo =  get($option['algo'], config('jwt.algo', 'HS256'));
        $payload["iss"] = get($option['iss'], APP_DOMAIN);
        $payload["aud"] = get($option['aud'], APP_DOMAIN);
        $payload["iat"] = get($option['iat'], time()-120); 
        $payload["nbf"] = get($option['nbf'], time()-120);
        $payload["exp"] = get($option['exp'], time() + config('jwt.ttl')*60);
        $payload["jti"] = time().rand();
        
        $jwt = JWT::encode($payload, $key, $algo);
        return $jwt;
    }
    
    public static function payload($jwt, $option=null){
        try {
            $option = get($option, []);
            $key = get($option['key'], config('jwt.secret'));
            $algos = get($option['algo'], [config('jwt.algo', 'HS256')]);
            $payload = JWT::decode($jwt, $key, $algos);
            return $payload;
        } catch (\Exception $e) {
            self::$log = $e->getMessage();
            return false;
        }
    }
    
    public static function refresh($jwt, $option=null, $newPayload=null){
        
        $option = get($option, []);
        $newPayload = get($newPayload, []);
        
        $payload = self::payload($jwt, $option);
        if(!$payload) return false;

        foreach($newPayload as $key=>$value){
            try {$payload->{$key} = $value;} catch (\Exception $e) {}
        }
        
        $option['iat'] = $payload->{'iat'};
        $option['nbf'] = $payload->{'nbf'};

        return self::make($payload, $option);
    }
    
    public static function getMessage(){
        return self::$log;
    }
    

}

?>