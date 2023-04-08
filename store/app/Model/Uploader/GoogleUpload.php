<?php

namespace App\Model\Uploader;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

use App\Helpers\Request\Checker;
use App\Helpers\Request\Reply;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Model\Model_basic;



class GoogleUpload
{
    private $disk = 'google';
    private $listContents = [];
    private $diskCfg = [];
    private $path2Name = [];
    
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
        if(!isset($diskConfig['clientId'])) Reply::finish(false, 'Error', 'Please define clientId field');
        if(!isset($diskConfig['clientSecret'])) Reply::finish(false, 'Error', 'Please define clientSecret field');
        if(!isset($diskConfig['refreshToken'])) Reply::finish(false, 'Error', 'Please define refreshToken field');
        if(!isset($diskConfig['folderId'])) Reply::finish(false, 'Error', 'Please define folderId field');
       
        $this->diskCfg = $diskConfig;
        $this->getListContents();
        
    }
    
    public function info(){
        $storeQ = Storage::disk($this->disk)->getAdapter()->getService()->about->get(['fields'=>'storageQuota']);
        return [
          DISK_TOTAL => $storeQ->storageQuota->limit,
          DISK_USED =>   $storeQ->storageQuota->usage,
          DISK_FREE => $storeQ->storageQuota->limit - $storeQ->storageQuota->usage,
        ];
        
    }
    
    
    private function createDir($dir){
        $dirs = explode('/', $dir);
        $checkDir = '';
        foreach ($dirs as $childir){
            if($childir == '') continue;
            $checkDirParent = isset($this->listContents[$checkDir])? $this->listContents[$checkDir]['path'] : '';
            $checkDir = $checkDir == ''? $childir : $checkDir.'/'.$childir;
            if(!isset($this->listContents[$checkDir])){
                if(Storage::disk($this->disk)->makeDirectory($checkDirParent.'/'.$childir)){
                    $this->getListContents();
                }else{
                    Reply::finish(false, 'Error', 'Can not create folder:' . $checkDir);
                }
            }
        }
    }
    
    
    private function getListContents(){
        $lists = Storage::disk($this->disk)->listContents('/', true);
        $names = array_column($lists, 'name', 'basename');
        foreach ($lists as $content){
            $paths = explode('/', $content['path']);
            $namepaths = array_map(function ($item) use ($names){return $names[$item];}, $paths);
            $namePath = implode('/', $namepaths);
            $content['namePath'] = $namePath;
            $this->listContents[$namePath] = $content;
            $this->path2Name[$content['path']] = $content;
        }
        
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
           
            
            
            if(!isset($this->listContents[$dir])){
                $this->createDir($dir);
            }
            
            $dirPath = $this->listContents[$dir]['path'];
            
            $path_parts = pathinfo($fileName);
            $isValidName = false;
            $rand = 1;
            
            while (!$isValidName){
                if(!isset($this->listContents[$dir.'/'.$fileName])){
                    $isValidName = true;
                }else{
                    $fileName = $path_parts['filename'].'_'.$rand.'.'.$path_parts['extension'];
                    $rand ++;
                }
            }
            
            Storage::disk($this->disk)->putFileAs( $dirPath, $file, $fileName);
          
            return Reply::make(true, 'Success', $dir.'/'.$fileName);
    
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
            if(isset($this->listContents[$filepath])){
                return Storage::disk($this->disk)->get($this->listContents[$filepath]['path']);
            }else {
                return Reply::make(false, 'Error', 'File not found');
            }
        } catch (\Exception $e) {
            return Reply::make(false, 'Error', $e->getMessage());
        }
        
    }
    
    public function delete($file){
        try {
            if(isset($this->listContents[$file])){
                $filepath = $this->listContents[$file]['path'];
            }else {
                return Reply::make(true, 'Success', 'File not found');
            }
            
            if(Storage::disk($this->disk)->delete($filepath)){
                
                return Reply::make(true,'Success', $this->disk.'/'.$file);
            }else{
                return Reply::make(false, 'Error', ''); 
            }
        } catch (\Exception $e) {
            return Reply::make(false, 'Error', $e->getMessage());
        }
    }
    
    public function scand($directory){
        try {
            
            if($directory != ''){
                if(isset($this->listContents[$directory])){
                     $directory = $this->listContents[$directory]['path'];
                }else {
                    return Reply::make(false, 'Error', 'Folder not found');
                }
            }
            
            $files = Storage::disk($this->disk)->files($directory);
            $directories = Storage::disk($this->disk)->directories($directory);
            
            $results = [];
            
            foreach ($files as $file){
                $results[] = [
                    'path' => $this->disk.'/'.$this->path2Name[$file]['namePath'],
                    'type' => 'file',
                ];
            }
            
            foreach ($directories as $directory){
                $results[] = [
                    'path' => $this->disk.'/'.$this->path2Name[$directory]['namePath'],
                    'type' => 'directory',
                ];
            }
            
            return Reply::make(true, 'Success', $results);
        } catch (\Exception $e) {
            return Reply::make(false, 'Error', $e->getMessage());
        }
        
    }
    
    
    public function scandFiles($directory = ''){
        try {
            
            if($directory != ''){
                if(isset($this->listContents[$directory])){
                    $directory = $this->listContents[$directory]['path'];
                }else {
                    return Reply::make(false, 'Error', 'Folder not found');
                }
            }
    
            $files = Storage::disk($this->disk)->allFiles($directory);
    
            $results = [];
            
            foreach ($files as $file){
                $filePath = $this->path2Name[$file]['namePath'];
                $results[] = [
                    'path' => $filePath,
                    'size' => $this->listContents[$filePath]['size'],
                ];
            }
    
            return Reply::make(true, 'Success', $results);
        } catch (\Exception $e) {
            return Reply::make(false, 'Error', $e->getMessage());
        }
    
    }
    
    public function is_exist($filepath){
        return isset($this->listContents[$filepath]);
    }
    
    
}

