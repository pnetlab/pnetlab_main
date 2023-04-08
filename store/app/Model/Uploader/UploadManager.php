<?php

namespace App\Model\Uploader;

use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Config;
class UploadManager
{
    
    function __construct(){
        
    }
    
    private $disks = [];  
    
      
    public function resolve($diskName){
        
        if(!isset($this->disks[$diskName])){
            
            $diskConfig = $this->loadConfig($diskName);
           
            $uploader = null;
            switch ($diskConfig['driver']) {
                case 'google':{
                    $uploader = resolve('Models')->getModel('Uploader/GoogleUpload', [$diskName]);
                }
                break;
                
                case 'local':{
                    $uploader = resolve('Models')->getModel('Uploader/LocalUpload', [$diskName]);
                }
                break;
                
                default:{
                    $uploader = null;
                }
            }
            
            $this->disks[$diskName] = $uploader;
        
        }
        
        
        
        return $this->disks[$diskName];
        
    }
    
    private function loadConfig($diskName){
        $config = config("filesystems.disks.{$diskName}", null);
        if($config != null) return $config;
        $diskModel = resolve('Models')->getModel('Uploader/Uploader_disks');
        $disk = $diskModel->read([[ [DISK_NAME, '=', $diskName], [DISK_UPLOADER, '=', APP_UPLOAD], [DISK_ACTIVE, '=', 1] ]]);
        if(!$disk['result']) return false;
        if(!isset($disk['data'][0])) return false;
        $config = json_decode($disk['data'][0]->{DISK_CONFIG}, true);
        if(json_last_error() != JSON_ERROR_NONE) return false;
        Config::set("filesystems.disks.{$diskName}", $config);
        return $config;
    }
    
    public function getMime($path){
        $mimes = [
            'svg' => 'image/svg+xml',
            'png' => 'image/png',
            
        ];
        
        $mime = last(explode('.', $path));
        if(isset($mimes[$mime])){
            return $mimes[$mime];
        }
        return null;
    }
    
    
}