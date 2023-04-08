<?php 

namespace App\Helpers\Admin;

use Illuminate\Support\Facades\Auth;

class LabHelper {
    
    public static function resetId($path){
        $lab = new \Lab($path, Auth::user()->{USER_POD});
        $lab->setId();

    }
}