<?php

namespace App\Http\Controllers\User;

use App\Helpers\Admin\LabHelper;
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
        $this->labFolder = '/opt/unetlab/labs/Your labs from '.APP_NAME.' Store';
    }


    public function getInfo(Request $request)
    {
        $data = $request->all();
        if(Role::isOffline()){
            $result = Query::boxCenter(APP_CENTER . '/api/offboxs/versions/getInfo', $data, ['dataType' => '']);
        }else{
            $result = Query::center(APP_CENTER . '/api/user/versions/getInfo', 'post', $data, ['dataType' => '']);
        }
       
        return $result;
    }

    public function readGetDepend(Request $request)
    {
        $data = $request->all();
        if(Role::isOffline()){
            $result = Query::boxCenter(APP_CENTER . '/api/offboxs/versions/readGetDepend', $data, ['dataType' => '']);
        }else{
            $result = Query::center(APP_CENTER . '/api/user/versions/readGetDepend', 'post', $data, ['dataType' => '']);
        }
        
        return $result;
    }

    public function checkExist(Request $request)
    {
        $labName = $request->input(LAB_NAME, '');
        $versionName = $request->input(VERSION_NAME, '');
        if ($labName == '') Reply::finish(false, ERROR_UNDEFINE, ['data' => VERSION_PATH]);
        if ($versionName == '') Reply::finish(false, ERROR_UNDEFINE, ['data' => VERSION_NAME]);
        $result = file_exists($this->labFolder . '/' . $labName . ' Ver_' . $versionName . '.unl');
        Reply::finish(true, 'Success', $result);
    }

    public function download(Request $request)
    {
        set_time_limit(0);
        $versionId = $request->input(VERSION_ID, '');
        $labName = $request->input(LAB_NAME, '');
        if ($versionId == '') Reply::finish(false, ERROR_UNDEFINE, ['data' => VERSION_ID]);
        if(Role::isOffline()){
            $result = Query::boxCenter(APP_CENTER . '/api/offboxs/versions/download', [VERSION_ID => $versionId], ['dataType' => 'json']);
        }else{
            $result = Query::center(APP_CENTER . '/api/user/versions/download', 'post', [VERSION_ID => $versionId], ['dataType' => 'json']);
        }
       
        // echo $result; die;
        if (!$result['result']) return $result;

        exec('sudo chown www-data:www-data -R /opt/unetlab/labs');
        //$file = $result['data'][VERSION_PATH];

        $versionName = get($result['data'][VERSION_NAME], '');
        $versionMd5 = get($result['data']['md5'], '');

        $file = $this->labFolder . '/' . $labName . ' Ver_' . $versionName . '.unl';

        $downloadSuccess = false;
        $downloadFail = 0;

        while (!$downloadSuccess && $downloadFail < 3) {

            $dir = dirname($file);
            if (!is_dir($dir)) mkdir($dir, 0755, true);

            if (is_file($file)) {
                unlink($file);
            }
            $fp = fopen($file, 'w+');

            $processTime = 0;
            $processModel = Models::get('Admin/Process');

            if (!$processModel->is_exist([[[PROCESS_ID, '=', $versionId]]])) {
                $processResult = $processModel->add([[PROCESS_ID => $versionId]]);
                if (!$processResult['result']) return $processResult;
            }

            $labcontent = Query::make($result['data']['link'], 'get', null, [
                'file' => $fp,
                'process' => function ($resource, $download_size = 0, $downloaded = 0, $upload_size = 0, $uploaded = 0) use ($processModel, $versionId, &$processTime) {
                    $currentTime = time();
                    if ((($currentTime - $processTime) > 1)
                        || ($downloaded != 0 && $download_size == $downloaded)
                        || ($uploaded != 0 && $upload_size == $uploaded)
                    ) {

                        $processTime = $currentTime;
                        $processResult = $processModel->edit([
                            DATA_KEY => [[[PROCESS_ID, '=', $versionId]]],
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

            fclose($fp);

            if (!$labcontent) {
                $processModel->drop([[[PROCESS_ID, '=', $versionId]]]);
                Reply::finish(false, 'Cannot download Lab');
            }
            // try {
            //     if(is_file($file)){unlink($file);}
            //     $folder = dirname($file);
            //     if(is_dir(!$folder)) mkdir($folder, 777, true);
            //     file_put_contents($file, $labcontent);
            // } catch (\Exception $e) {
            //     Reply::finish(false, 'ERROR', $e);
            // }
            chmod($file, 0755);
            if (md5_file($file) == $versionMd5) {
                $downloadSuccess = true;
            } else {
                $downloadSuccess = false;
                $downloadFail++;
            }
        }

        $processModel->drop([[[PROCESS_ID, '=', $versionId]]]);

        if ($downloadSuccess) {
            // License::relicense(false, Auth::user());
            LabHelper::resetId($file);
            Reply::finish(true, 'Success');
        } else {
            Reply::finish(false, 'error_md5_fail', ['data'=>$file]);
        }
    }
}
