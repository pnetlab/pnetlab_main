<?php

namespace App\Helpers\Request;
use App\Helpers\Control\Ctrl;
use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Auth;


class Query {
    
    public static $ch = null;
    
    public static function make($url, $method = 'get', $post=array(), $options=[]){

        $url = preg_replace('/^https/', 'http', trim($url));
       
        self::$ch = curl_init();
        
        curl_setopt(self::$ch, CURLOPT_URL, $url);
        curl_setopt(self::$ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(self::$ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt(self::$ch, CURLOPT_POST, false);
        
        if(isset($options['header'])){
            curl_setopt(self::$ch, CURLOPT_HTTPHEADER, $options['header']);
        }
        
        if(isset($options['process'])){
            curl_setopt(self::$ch, CURLOPT_PROGRESSFUNCTION, $options['process']);
            curl_setopt(self::$ch, CURLOPT_NOPROGRESS, false);
        }

        if(isset($options['file'])){
            curl_setopt(self::$ch, CURLOPT_FILE, $options['file']); 
        }

        if($method == 'post'){
            curl_setopt(self::$ch, CURLOPT_POST, count($post));
            curl_setopt(self::$ch, CURLOPT_POSTFIELDS, $post);
        }


        $proxy = self::getProxy();
        if($proxy != null){
            if(isset($proxy['proxy_ip']) && isset($proxy['proxy_port'])){
                $proxyaddress = $proxy['proxy_ip'].':'.$proxy['proxy_port'];
                curl_setopt(self::$ch, CURLOPT_PROXY, $proxyaddress);
                if(isset($proxy['proxy_username']) && isset($proxy['proxy_password'])){
                    $proxyauth = $proxy['proxy_username']. ':' . $proxy['proxy_password'];
                    curl_setopt(self::$ch, CURLOPT_PROXYUSERPWD, $proxyauth); 
                }
            }
        }
        
        $responseString = curl_exec(self::$ch); 
        
        if(!isset($options['continue']) || !$options['continue']){
            curl_close(self::$ch);
        }
        
        if(!$responseString){
            return Reply::make(false, 'ERROR', ['data'=>'Can not connect to server']);
        }
       
        if(isset($options['dataType']) && $options['dataType'] == 'json'){
            $responseString = json_decode($responseString, true);
            if(json_last_error() != JSON_ERROR_NONE) return Reply::make(false, 'ERROR', ['data'=>'Data is wrong format']);;
        }
        
        return $responseString;
    
    }

    public static function center($url, $method = 'post', $data=[], $options=[]){
        
        if($method == 'get'){
            $data = self::getDataFromUrl($url);
        }
        if(isset($options['user'])){
            $user = $options['user'];
        }else{
            $user = Auth::user();
        };
        if(!isset($user->{USER_LICENSE})){
            return Reply::make(false, 'ERROR', ['data'=>'Can not get license']);
        }
        $data['time'] = time();
        $data['license'] = $user->{USER_LICENSE};
        $data = json_encode($data);
        
        if($method == 'get'){
            $urlPath = explode('?', $url);
            if(isset($urlPath[1])){
                $url = $urlPath[0].'?'.$urlPath[1].'&'.'data='.$data;
            }else{
                $url = $urlPath[0].'?data='.$data;
            }
            
        }
        
        return self::make($url, $method, ['data'=>$data], $options);
    }


    public static function boxCenter($url, $data=[], $options=[]){
        
        
        $indenfify = new \indentify();
        $data['license'] = Ctrl::get(CTRL_ALIVE_KEY, '');
        $data['key'] = $indenfify->getKey();
        $data = json_encode($data);
        
        return self::make($url, 'post', ['data'=>$data], $options);
    }
    
    private static function getDataFromUrl($url){
        $dataString = explode('?', $url);
        if(!isset($dataString[1])) return [];
        $dataString = $dataString[1];
        $dataString = explode('&', $dataString);
        $data = [];
        foreach ($dataString as $value){
            $valueArray = explode('=', $value);
            if(!isset($valueArray[1]) || $valueArray[1]=='') continue;
            $data[trim($valueArray[0])] = trim($valueArray[1]);
        }
        return $data;
    }

    public static function getProxy()
    {
        try {
            $file = '/etc/apt/apt.conf.d/00proxy';
            if (!is_file($file)) return null;
            $data = file_get_contents($file);
            $re = '/^Acquire::https::Proxy\s*\"https?:\/\/(?:(\w+):([^@]+)@)?([\d\w\.]+):(\d+).*$/im';
            if (preg_match($re, $data, $matches)) {
                $proxyData = [];
                if (isset($matches[1])) $proxyData['proxy_username'] = $matches[1];
                if (isset($matches[2])) $proxyData['proxy_password'] = $matches[2];
                if (isset($matches[3])) $proxyData['proxy_ip'] = $matches[3];
                if (isset($matches[4])) $proxyData['proxy_port'] = $matches[4];
                return $proxyData;
            }
            return null;
        } catch (\Exception $th) {
            return null;
        }
    }

    public static function setProxy($p){
        $file = '/etc/apt/apt.conf.d/00proxy';
        if(!is_file($file)) exec('sudo touch '.$file);

        $proxyAddr = '';
        if(isset($p['proxy_ip']) && isset($p['proxy_port']) && $p['proxy_ip'] != '' && $p['proxy_port'] != ''){
            $proxyAddr = $p['proxy_ip'].':'.$p['proxy_port'];
            if(isset($p['proxy_username']) && isset($p['proxy_password']) && $p['proxy_username'] != '' && $p['proxy_password']!=''){
                $proxyAddr = $p['proxy_username'].':'.$p['proxy_password'].'@'.$proxyAddr;
            }
        }

        if($proxyAddr != ''){
            $proxyAddr = 'Acquire::http::Proxy "http://'.$proxyAddr.'/";\nAcquire::https::Proxy "http://'.$proxyAddr.'/";\nAcquire::ftp::Proxy "http://'.$proxyAddr.'/";';
        }
       
        $result = exec("echo '".$proxyAddr."' | sudo tee ".$file);
       
    }
    
}

