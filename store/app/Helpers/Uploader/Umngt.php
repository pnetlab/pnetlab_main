<?php 
namespace App\Helpers\Uploader;


class Umngt {
    public static function add($file){
        $info = explode('/', $file);
        $fileName = array_pop($info);
        $disk = get($info[0], '');
        $table = get($info[1], '');
        $column = get($info[2], '');
        $uid = get($info[3], '');
        
        resolve('Models')->getModel('Uploader/Uploader_mngt')->add([[
            UP_MNGT_DISK => $disk,
            UP_MNGT_TABLE => $table,
            UP_MNGT_COL => $column,
            UP_MNGT_UID => $uid,
            UP_MNGT_PATH => $file,
        ]]);
    }
    
    public static function del($file){
        resolve('Models')->getModel('Uploader/Uploader_mngt')->drop([[[UP_MNGT_PATH, '=', $file]]]);
    }

}

?>