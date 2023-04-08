<?php 
namespace App\Helpers\Uploader;

use App\Helpers\Request\Checker;
use App\Helpers\Request\Reply;
class FileFunc {
    
    public static function upload($uploader, $disk, $table, $column, $uid, $condition){
        $action = 'Upload';
        $path = $table.'/'.$column.'/'.$uid;
        $utoken = FileToken::token($disk, $path, 'All', [$action], $condition);
        $ulink = $uploader.'/api/uploader/uploader/'.strtolower($action);
        return Reply::make(true, 'Success', ['utoken'=>$utoken, 'ulink'=>$ulink]);
    }
    
    public static function read($uploader, $disk, $table, $column, $uid, $file){
        $action = 'Read';
        if(!Checker::validate([$disk, $column, $uid], 'Word')) Reply::finish(false, 'Error', 'Wrong format file name');
        $path = $table.'/'.$column.'/'.$uid;
        $utoken = FileToken::token($disk, $path, [$file], [$action]);
        $ulink = $uploader.'/api/uploader/uploader/'.strtolower($action);
        return Reply::make(true, 'Success', ['utoken'=>$utoken, 'ulink'=>$ulink]);
    
    }
    
    public static function scand($uploader, $disk, $table, $column, $uid, $options){
        $action = 'Scand';
        if(!Checker::validate([$disk, $column, $uid], 'Word')) Reply::finish(false, 'Error', 'Wrong format file name');
        $path = $table;
        if($column != '') $path .= '/'.$column;
        if($uid != '') $path .= '/'.$uid;
        $utoken = FileToken::token($disk, $path, 'All', [$action], $options);
        $ulink = $uploader.'/api/uploader/uploader/'.strtolower($action);
        return Reply::make(true, 'Success', ['utoken'=>$utoken, 'ulink'=>$ulink]);
    }
    
    public static function delete($uploader, $disk, $table, $column, $uid, $file){
        $action = 'Delete';
    
        if(!Checker::validate([$disk, $column, $uid], 'Word')) Reply::finish(false, 'Error', 'Wrong format file name');
        $path = $table.'/'.$column.'/'.$uid;
        $utoken = FileToken::token($disk, $path, [$file], [$action]);
        $ulink = $uploader.'/api/uploader/uploader/'.strtolower($action);
        return Reply::make(true, 'Success', ['utoken'=>$utoken, 'ulink'=>$ulink]);
    
    }
    
    public static function history($table, $column = null, $uid = null, $special = null){
    
        $condition = [[FILE_TABLE, '=', $table]];
        if($column != null) $condition[] = [FILE_COLUMN,'=', $column];
        if($uid != null) $condition[] = [FILE_UID,'=', $uid];
    
        $files = resolve('Models')->getModel('Uploader/Uploader_files')->read([$condition], $special);
        return $files;
    }
    
    public static function parse($file){
    
        $re = '/^(https?:\/\/[^\/]+)\/([^\/]+)\/([^\/]+)\/([^\/]+)\/([^\/]+)\/([^\/]+)$/';
        if(preg_match($re, $file, $matches)){
        
            $uploader = $matches[1];
            $disk = $matches[2];
            $table = $matches[3];
            $column = $matches[4];
            $uid = $matches[5];
            $fileName = $matches[6];
           
            return [
                FILE_UPLOADER => $uploader,
                FILE_DISK => $disk,
                FILE_TABLE => $table,
                FILE_COLUMN => $column,
                FILE_UID => $uid,
                FILE_NAME => $fileName,
                FILE_PATH => $file,
                
            ];
        
        }
        return false;
    }
    

}

?>