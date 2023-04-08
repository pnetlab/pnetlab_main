<?php

namespace App\Http\Controllers\User;

use App\Helpers\Auth\Role;
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
    }

    public function checkExist(Request $request)
    {
        set_time_limit (0);
        $depen = $request->input(DEPEND_PATH, '');
        $md5 = $request->input(DEPEND_MD5, '');
        if ($depen == '') Reply::finish(false, ERROR_UNDEFINE, ['data' => DEPEND_PATH]);
        if ($md5 == '') Reply::finish(false, ERROR_UNDEFINE, ['data' => DEPEND_MD5]);
        if (!file_exists($depen)) {
            $result = 0;
        } else {
            $realmd5 = md5_file($depen);
            if ($md5 == $realmd5) {
                $result = 1;
            } else {
                $result = 2;
            }
        }
        Reply::finish(true, 'Success', $result);
    }

    public function download(Request $request)
    {
        set_time_limit (0);
        $depenId = $request->input(DEPEND_ID, '');
        
        if ($depenId == '') Reply::finish(false, ERROR_UNDEFINE, ['data' => DEPEND_ID]);

        if(Role::isOffline()){
            $result = Query::boxCenter(APP_CENTER . '/api/offboxs/dependence/download', [DEPEND_ID=>$depenId], ['dataType' => 'json']);
        }else{
            $result = Query::center(APP_CENTER . '/api/user/dependence/download', 'post', [DEPEND_ID=>$depenId], ['dataType' => 'json']);
        }
        
        
        if (!$result['result']) return $result;

        exec('sudo chown www-data:www-data -R /opt/unetlab/addons');
        exec('sudo chown www-data:www-data -R /opt/unetlab/html/templates');
        exec('sudo chown www-data:www-data -R /opt/unetlab/html/images/icons');
        exec('sudo chown www-data:www-data -R /opt/unetlab/scripts');

        $file = $result['data'][DEPEND_PATH];
        $fileMd5 = get($result['data'][DEPEND_MD5], '');

        $dir = dirname($file);
        if (!is_dir($dir)) mkdir($dir, 0755, true);


        $downloadSuccess = false;
        $downloadFail = 0;

        while (!$downloadSuccess && $downloadFail < 3) {

            if (is_file($file)) {
                unlink($file);
            }
            $fp = fopen($file, 'w+');

            $processTime = 0;
            $processModel = Models::get('Admin/Process');

            if (!$processModel->is_exist([[[PROCESS_ID, '=', $depenId]]])) {
                $processResult = $processModel->add([[PROCESS_ID => $depenId]]);
                if (!$processResult['result']) return $processResult;
            }

            $depenContent = Query::make($result['data']['link'], 'get', null, [
                'file' => $fp,
                'process' => function ($resource, $download_size = 0, $downloaded = 0, $upload_size = 0, $uploaded = 0) use ($processModel, $depenId, &$processTime) {
                    $currentTime = time();
                    if ((($currentTime - $processTime) > 1)
                        || ($downloaded != 0 && $download_size == $downloaded)
                        || ($uploaded != 0 && $upload_size == $uploaded)
                    ) {

                        $processTime = $currentTime;
                        $processResult = $processModel->edit([
                            DATA_KEY => [[[PROCESS_ID, '=', $depenId]]],
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

            if (!$depenContent){
                $processModel->drop([[[PROCESS_ID, '=', $depenId]]]);
                Reply::finish(false, 'Cannot download dependence');
            }

            chmod($file, 0755);

            if (md5_file($file) == $fileMd5) {
                $downloadSuccess = true;
            } else {
                $downloadSuccess = false;
                $downloadFail++;
            }
        }

        $processModel->drop([[[PROCESS_ID, '=', $depenId]]]);

        if($downloadSuccess){
            Reply::finish(true, 'Success');
        }else{
            Reply::finish(false, 'error_md5_fail', ['data'=> $file]);
        }

        
    }
}
