<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Request\Checker;
use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Auth;
use App\Helpers\Uploader\FileFunc;
use App\Helpers\DB\Models;
use App\Helpers\Request\Query;

class DevicesController extends Controller  
{

    function __construct()
    {
        parent::__construct();
        $this->viewblade = 'reactjs.reactjs';
    }

    public function filter(Request $request)
    {
        $data = $request->all();
        $result = Query::boxCenter(APP_CENTER . '/api/offboxs/devices/filter', $data, ['dataType' => 'json']);
        if(!$result) Reply::finish(false, 'Can get data from server');
        if(!$result['result']) return $result;

        foreach($result['data'] as $key=>$device){
            $checkExist = htmlspecialchars_decode($device[DEVICE_CHECK], ENT_QUOTES);
            $checkExistLog = exec($checkExist);
           
            if($checkExistLog == ''){
                $result['data'][$key]['available'] = '0';
            }else{
                $result['data'][$key]['available'] = '1';
            }
        }

        return $result;
    }

    public function get(Request $request)
    {
        $deviceId = $request->input(DEVICE_ID, '');
        $overwritten = $request->input('overwritten', false);
        $result = Query::boxCenter(APP_CENTER . '/api/offboxs/devices/read', [DEVICE_ID => $deviceId], ['dataType' => 'json']);
        if(!$result) Reply::finish(false, 'Can not get data from server');
        if(!$result['result']) return $result;
        $device = $result['data'];

        if(!$overwritten){
            $checkExist = htmlspecialchars_decode($device[DEVICE_CHECK], ENT_QUOTES);
            $checkExistLog = exec($checkExist);
            if($checkExistLog != '') Reply::finish(false, 'device_existed_alert', ['confirm' => true]);
        }

        $script = htmlspecialchars_decode($device[DEVICE_SCRIPT], ENT_QUOTES);
        $script = str_replace('{device_id}', $deviceId, $script);
        $script = "#!/bin/bash\n".$script;

        $excutefile = '/tmp/pnet_device_factory_'.$deviceId;
        $logfile = $excutefile.'_log';

        $result = exec('sudo pkill -f pnet_device_factory_'.$deviceId);

        if(is_file($excutefile)) unlink($excutefile);
        if(is_file($logfile)) unlink($logfile);

        file_put_contents($excutefile, $script);
        chmod($excutefile, '0755');

        $processModel = Models::get('Admin/Process_device');
        $processModel->drop([[ [PROCESS_DEVICE_ID, '=', $device[DEVICE_ID]] ]]);
        $processModel->add([[
            PROCESS_DEVICE_ID => $device[DEVICE_ID],
            PROCESS_DEVICE_LOG => 'Start loading '. $device[DEVICE_NAME],
        ]]);
        $result = exec('sudo dos2unix '. $excutefile);
        $result = exec('sudo '. $excutefile. ' > '. $logfile.' 2>&1 &');
        Reply::finish(true, 'success');
    }

    public function delete(Request $request)
    {
        $deviceId = $request->input(DEVICE_ID, '');
       
        $result = Query::boxCenter(APP_CENTER . '/api/offboxs/devices/read', [DEVICE_ID => $deviceId], ['dataType' => 'json']);
        if(!$result) Reply::finish(false, 'Can not get data from server');
        if(!$result['result']) return $result;
        $device = $result['data'];

        $script = htmlspecialchars_decode($device[DEVICE_DELETE], ENT_QUOTES);
        $script = str_replace('{device_id}', $deviceId, $script);
        $script = "#!/bin/bash\n".$script;

        $excutefile = '/tmp/pnet_device_factory_'.$deviceId;
        $logfile = $excutefile.'_log';

        $result = exec('sudo pkill -f pnet_device_factory_'.$deviceId);

        if(is_file($excutefile)) unlink($excutefile);
        if(is_file($logfile)) unlink($logfile);

        file_put_contents($excutefile, $script);
        chmod($excutefile, '0755');

        $processModel = Models::get('Admin/Process_device');
        $processModel->drop([[ [PROCESS_DEVICE_ID, '=', $device[DEVICE_ID]] ]]);
        $processModel->add([[
            PROCESS_DEVICE_ID => $device[DEVICE_ID],
            PROCESS_DEVICE_LOG => 'Delete '. $device[DEVICE_NAME],
        ]]);
        $result = exec('sudo dos2unix '. $excutefile);
        $result = exec('sudo '. $excutefile. ' > '. $logfile.' 2>&1 &');
        Reply::finish(true, 'success');
    }

    public function process(Request $request){
        $deviceId = $request->input(DEVICE_ID, '');
        $processModel = Models::get('Admin/Process_device');
        $result = $processModel->read([[[PROCESS_DEVICE_ID, '=', $deviceId]]]);

        $excutefile = secureCmd('/tmp/pnet_device_factory_'.$deviceId);
        $logfile = $excutefile.'_log';

        if(!$result['result'] || !isset($result['data'][0])){
            $result = exec('sudo rm -f '. $excutefile);
            Reply::finish(true, 'success', ['finish'=>true, 'data'=>null]);
        }else{
            $data = $result['data'][0];
            if(is_file($logfile)){
                $log = file_get_contents($logfile);
                $data->log = $log;
            }
        }
        Reply::finish(true, 'success', ['finish'=>false, 'data'=>$data]);
    }

    public function store() 
    {
        return view($this->viewblade);
    }
    
}