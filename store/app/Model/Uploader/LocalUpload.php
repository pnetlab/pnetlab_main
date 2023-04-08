<?php

namespace App\Model\Uploader;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

use App\Helpers\Request\Checker;
use App\Helpers\Request\Reply;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Model\Model_basic;




class LocalUpload
{
    private $disk = 'local';
    private $listContents = [];
    private $diskCfg = [];
    
    function __construct($diskName){
        $this->setDisk($diskName);
    }
    
    /**
     * @return the $disk
     */
    public function getDisk()
    {
        return $this->disk;
    }

	/**
     * @param string $disk
     */
    public function setDisk($disk)
    {
        $this->disk = $disk;
        $diskConfig = config("filesystems.disks.{$this->disk}", null);
        
        if(!isset($diskConfig)) Reply::finish(false, 'Error', 'Disk not found');
        if(!isset($diskConfig['driver'])) Reply::finish(false, 'Error', 'Please define driver field');
        if(!isset($diskConfig['root'])) Reply::finish(false, 'Error', 'Please define root field');
        
        $this->diskCfg = $diskConfig;
    }
    
    public function info(){
        
        $free = disk_free_space($this->diskCfg['root']);
        $total = disk_total_space($this->diskCfg['root']);
        $use = $total - $free;
        
        return [
          DISK_TOTAL => $total,
          DISK_USED => $use,
          DISK_FREE => $free,
        ];
        
    }
    
    
	public function upload($file, $dir, $condition = null, $flag=null){
    
	 try{
           
            
           $fileName = $file->getClientOriginalName();
            
	       if($condition != null){
                if(isset($condition->{'validation'})){
                    $validator = Validator::make(['file'=>$file], ['file'=>$condition->{'validation'}]);
                    if ($validator->fails()) {
                        return Reply::make(false, 'Error', $validator->errors()->first());
                    }
                }
                
                if(isset($condition->{'regex'})){
                    if(!preg_match($condition->{'regex'}, $fileName)){
                        return Reply::make(false, 'Error', 'File format is wrong');
                    }
                }
                
            }
            
            $path_parts = pathinfo($fileName);
            $isValidName = false;
            $rand = 1;
            
            while (!$isValidName){
                if(!Storage::disk($this->disk)->exists($dir.'/'.$fileName)){
                    $isValidName = true;
                }else{
                    $fileName = $path_parts['filename'].'_'.$rand.'.'.$path_parts['extension'];
                    $rand ++;
                }
            }
            
            $path = Storage::disk($this->disk)->putFileAs( $dir, $file, $fileName);
            
            return Reply::make(true, 'Success', $path);
    
        }catch(Illuminate\Http\Exceptions $e){
    
            return Reply::make(false, 'Error', $e);
        }
    }
    
    public function uploads($datas, $dir , $condition = null){
    
        try{
    
            $fileName = [];
    
            foreach ($datas as $key=>$data){
                $uploadResult = $this.upload($data, $dir, $condition);
                if($uploadResult['result']){
                    $fileName[] = $uploadResult['data'];
                }
            }
    
            return Reply::make(true, 'Success', $fileName);
    
        }catch(Illuminate\Http\Exceptions $e){
    
            return Reply::make(false, 'Error', $e);
        }
    }
    
    
    public function read($filepath){
        try {
            return Storage::disk($this->disk)->get($filepath);
        } catch (\Exception $e) {
            return Reply::make(false, 'Error', $e->getMessage());
        }
        
    }
    
    public function delete($filepath){
        try {
            Storage::disk($this->disk)->delete($filepath);
            return Reply::make(true,'Success',$filepath);
        } catch (\Exception $e) {
            return Reply::make(false, 'Error', $e->getMessage());
        }
    
    }
    
    public function is_exist($filepath){
        return Storage::disk($this->disk)->exists($filepath);
    }
    
    public function scand($directory){
        try {
            
            $files = Storage::disk($this->disk)->files($directory);
            $directories = Storage::disk($this->disk)->directories($directory);
            
            $results = [];
            
            foreach ($files as $file){
                $results[] = [
                    'path' => $this->disk.'/'.$file,
                    'type' => 'file',
                ];
            }
            
            foreach ($directories as $directory){
                $results[] = [
                    'path' => $this->disk.'/'.$directory,
                    'type' => 'directory',
                ];
            }
            
            return Reply::make(true, 'Success', $results);
        } catch (\Exception $e) {
            return Reply::make(false, 'Error', $e->getMessage());
        }
    
    }
    
    public function scandFiles($directory=''){
        try {
    
            $files = Storage::disk($this->disk)->allFiles($directory);
            
            $results = [];
            foreach ($files as $file){
                $results[] = [
                    'path' => $file,
                    'size' => Storage::disk($this->disk)->size($file),
                ];
            }
    
            return Reply::make(true, 'Success', $results);
        } catch (\Exception $e) {
            return Reply::make(false, 'Error', $e->getMessage());
        }
    
    }
    
    
    

}
