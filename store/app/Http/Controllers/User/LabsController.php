<?php
namespace App\Http\Controllers\User;

use App\Helpers\DB\Models;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Request\Checker;
use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Helpers\Request\Query;
use Illuminate\Queue\RedisQueue;

class LabsController extends Controller  
{
    

    function __construct()
    {
        parent::__construct();
        $this->viewblade = 'reactjs.reactjs';
        
        
    }

    public function getOwnLabs(){
        $result = Query::center(APP_CENTER.'/api/user/labs/getOwnLabs', 'post', [], ['dataType'=>'']);
        return $result;
    }

    public function getFreeLabs(){
        $result = Query::center(APP_CENTER.'/api/user/labs/getFreeLabs', 'post', [], ['dataType'=>'']);
        return $result;
    }

    public function removeLabLicense(Request $request){
        $data = $request->all();
        $result = Query::center(APP_CENTER.'/api/user/labs/removeLabLicense', 'post', $data, ['dataType'=>'']);
        return $result;
    }

    public function getReadyLabs(){
        // return all lab in your lab from eve-store folder
        $folder = '/opt/unetlab/labs/Your labs from '.APP_NAME.' Store';
        if(!is_dir($folder)) Reply::finish(true, 'success', []);
        $scanded = scandir('/opt/unetlab/labs/Your labs from '.APP_NAME.' Store');
        $files = [];
        foreach($scanded as $file){
            if(preg_match('/(.*)\.unl$/', $file, $matched)){
                $files[] = $matched[1];
            }
        }
        Reply::finish(true, 'success', $files);
        
    }

    
    
    
}
