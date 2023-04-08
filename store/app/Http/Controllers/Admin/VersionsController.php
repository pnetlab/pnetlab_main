<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Auth\Role;
use App\Helpers\Box\License;
use App\Helpers\DB\Models;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Request\Checker;
use App\Helpers\Request\Query;
use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Auth;
use App\Helpers\Uploader\FileFunc;


class VersionsController extends Controller
{


    function __construct()
    {
        parent::__construct();
        $this->viewblade = 'reactjs.reactjs';
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
    }

    public function check_exist(Request $request)
    {

        $unl = $request->input(VERSION_UNL, '');
        if ($unl == '') Reply::finish(false, ERROR_UNDEFINE, ['data' => VERSION_UNL]);

        if(file_get_contents($unl, false, null, 0, 5) != '<?xml'){
            Reply::finish(false, 'You cannot reupload Lab');
        }

        $md5 = md5_file($unl);
        //Check md5 of file
        $result = Query::center(APP_CENTER . '/api/boxs/versions/check_exist', 'post', [
            VERSION_MD5 => $md5,
        ], ['dataType' => '']);

        if (!$result) Reply::finish(false, 'Can not check MD5');
        return $result;
    }

    public function uploader(Request $request)
    {
        set_time_limit (0);
        $file = $request->input(VERSION_UNL, '');
        if (!$file) Reply::finish(false, ERROR_UNDEFINE, ['data' => VERSION_UNL]);
        $md5 = md5_file($file);
        $fileSize = filesize($file);
        $metadata = ['size' => $fileSize, 'md5' => $md5];

        if(file_get_contents($file, false, null, 0, 5) != '<?xml'){
            Reply::finish(false, 'You cannot reupload Lab');
        }

        $result = Query::center(APP_CENTER . '/api/boxs/versions/uploader', 'post', [
            'action' => 'Upload',
            'column' => VERSION_UNL,
            'file' => $metadata,
        ], ['dataType' => 'json']);
        
        if (!$result['result']) Reply::finish($result);

        $processTime = 0;
        $processModel = Models::get('Admin/Process');

        if(!$processModel->is_exist([[[PROCESS_ID, '=', $file]]])){
            $processResult = $processModel->add([[PROCESS_ID => $file]]);
            if(!$processResult['result']) return $processResult;
        }

        $result = Query::make($result['data']['ulink'], 'post', [
            'file' => new \CURLFile($file, null, basename($file)),
            'utoken' => $result['data']['utoken'],
        ], [
            'header' => ["Content-Type:multipart/form-data"],
            'dataType' => 'json',
            'process'=>function($resource, $download_size = 0, $downloaded = 0, $upload_size = 0, $uploaded = 0) use($processModel, $file, &$processTime){
                $currentTime = time();
                if( (($currentTime - $processTime) > 1) 
                    || ($downloaded != 0 && $download_size == $downloaded)
                    || ($uploaded != 0 && $upload_size == $uploaded) ){
                    
                    $processTime = $currentTime;
                    $processResult = $processModel->edit([
                        DATA_KEY => [[[PROCESS_ID, '=', $file]]],
                        DATA_EDITOR => [
                            PROCESS_DTOTAL => $download_size,
                            PROCESS_DNOW => $downloaded,
                            PROCESS_UTOTAL => $upload_size,
                            PROCESS_UNOW => $uploaded,
                            PROCESS_FINISH => '0',
                        ]
                    ]);
                    
                }
            }

        ]);

        $processModel->drop([[[PROCESS_ID, '=', $file]]]);

        if (!$result['result']) Reply::finish($result);

        return Reply::finish(true, 'Success', [
            VERSION_UNL => $result['data'],
            VERSION_MD5 => $md5,
        ]);

    }

    public function addGetId(Request $request){
        $data = $request->all();
        $result = Query::center(APP_CENTER.'/api/boxs/versions/addGetId', 'post', $data, ['dataType'=>'']);
        return $result;
    }

    public function drop(Request $request){
        $data = $request->all();
        $result = Query::center(APP_CENTER.'/api/boxs/versions/drop', 'post',  $data, ['dataType'=>'']);
        return $result;
    }

    public function editNote(Request $request){
        $data = $request->all();
        $result = Query::center(APP_CENTER.'/api/boxs/versions/editNote', 'post',  $data, ['dataType'=>'']);
        return $result;
    }

    

    //================================================================

    
    public function view(Request $request)
    {
        $relicense = $request->input('relicense', false);
        if($relicense) License::relicense(false, Auth::user());
        return view($this->viewblade);
    }

    public function addview()
    {
        return view($this->viewblade);
    }
}
