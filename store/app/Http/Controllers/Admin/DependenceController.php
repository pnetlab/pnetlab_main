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


class DependenceController extends Controller
{

    function __construct()
    {
        parent::__construct();
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
    }

    public function uploader(Request $request)
    {
        set_time_limit (0);
        $file = $request->input(DEPEND_PATH, '');
        if (!$file) Reply::finish(false, ERROR_UNDEFINE, ['data' => DEPEND_PATH]);
        $md5 = md5_file($file);
        $fileSize = filesize($file);
        $metadata = ['size' => $fileSize, 'md5' => $md5];

        License::updateUserLicense(Auth::user());
        $result = Query::center(APP_CENTER . '/api/boxs/dependence/uploader', 'post', [
            'file' => $metadata,
        ], ['dataType' => 'json']);

        if (!$result['result']) Reply::finish($result);

        if ($result['data']['exist']) {
            Reply::finish(true, 'Success', $result['data']['data']);
        }

        $processTime = 0;
        $processModel = Models::get('Admin/Process');

        if(!$processModel->is_exist([[[PROCESS_ID, '=', $file]]])){
            $processResult = $processModel->add([[PROCESS_ID => $file]]);
            if(!$processResult['result']) return $processResult;
        }

        $result = Query::make($result['data']['data']['ulink'], 'post', [
            'file' => new \CURLFile($file, null, basename($file)),
            'utoken' => $result['data']['data']['utoken'],
        ], [
            'header' => ["Content-Type:multipart/form-data"],
            'dataType' => 'json',
            'process'=> function($resource, $download_size = 0, $downloaded = 0, $upload_size = 0, $uploaded = 0) use($processModel, $file, &$processTime){
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

        $packageData = [
            PACK_MD5 => $md5,
            PACK_PATH => $result['data'],
            PACK_SIZE => $fileSize,
        ];

        License::updateUserLicense(Auth::user());
        $result = Query::center(APP_CENTER . '/api/boxs/packages/add', 'post', ['data'=>[$packageData]], ['dataType' => 'json']);
        
        if (!$result['result']) return $result;

        Reply::finish(true, 'Success', $packageData);
    }

    public function add(Request $request)
    {
        $data = $request->all();
        $result = Query::center(APP_CENTER . '/api/boxs/dependence/add', 'post', $data, ['dataType' => '']);
        return $result;
    }


    public function test(){
        License::updateUserLicense(Auth::user());
        print_r(Auth::user()->license);
    }
}
