<?php 

namespace App\Helpers\Admin;

use App\Helpers\Request\Query;
use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Auth;

class SystemHelper {
    
    public static function FolderSize($path){
        exec('/usr/bin/du -sb ' . $path, $o, $r);
        if($r != 0) return null;
        return preg_split("/[\s]+/", $o[0])[0];
    }

    public static function getTotalDisk(){
        $cmd = 'df -k /';
        exec($cmd, $o, $rc);
        $data = [];
        foreach ($o as $output) {
            if (preg_match('/^.*\s([\d\.]+)\s+([\d\.]+)\s+([\d\.]+)\s+([\d]+)%.*$/mi', $output, $match)) {
                $data['free'] = (int)$match[3];
                $data['used'] = (int)$match[2];
                $data['total'] = (int)$match[1];
                $data['percent'] = (float)$match[4];
            }
        }
        return $data;
    }

    public static function getNodeDisk($nodeSession){
        if($nodeSession->{NODE_SESSION_TYPE} == 'docker'){
            exec("docker -H=tcp://127.0.0.1:4243 inspect --size docker".$nodeSession->{NODE_SESSION_ID}." --format='{{.SizeRw}}'", $o, $r);
            if($r != 0) return null;
            $addSize = (int)$o[0];
            return $addSize;

        }else {
            $addSize = (int)self::FolderSize($nodeSession->{NODE_SESSION_WORKSPACE});
            return $addSize;
        }
    }

    public static function updateDomain(){
    }
}