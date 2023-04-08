<?php

namespace App\Console\Commands;

use App\Helpers\DB\Models;
use App\Helpers\Request\Query;
use App\Helpers\Request\Reply;
use Illuminate\Console\Command;

class DeviceFactory extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'device_factory {device_id} {action} {--message=} {--link=} {--save=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */

    public function handle()
    {
        set_time_limit(0);

        $device_id = $this->argument('device_id');
        $action = $this->argument('action');
    
        if($action == 'log'){
            $message = $this->option('message');
            $processModel = Models::get('Admin/Process_device');
            if(!$processModel->is_exist([[[PROCESS_DEVICE_ID, '=', $device_id]]])){
                $result = $processModel->add([[
                    PROCESS_DEVICE_ID => $device_id,
                    PROCESS_DEVICE_LOG => $message,
                ]]);
               
            }else{
                $result = $processModel->edit([
                    DATA_KEY => [[[PROCESS_DEVICE_ID, '=', $device_id]]],
                    DATA_EDITOR => [PROCESS_DEVICE_LOG => $message],
                ]);
            }
            
            return $result;
        }

        if($action == 'finish'){
            $processModel = Models::get('Admin/Process_device');
            return $processModel->drop([[[PROCESS_DEVICE_ID, '=', $device_id]]]);
        }

        if($action == 'download'){
            $link = $this->option('link');
            $save = $this->option('save');
            if(is_file($save)) unlink($save);

            $processModel = Models::get('Admin/Process_device');
            if(!$processModel->is_exist([[[PROCESS_DEVICE_ID, '=', $device_id]]])){
                $processResult = $processModel->add([[PROCESS_DEVICE_ID => $device_id]]);
                if(!$processResult['result']) return $processResult;
            }

            $fp = fopen ($save, 'w+');
    
            $processTime = 0;
            
            $result = Query::make($link, 'get', null, [
                'file' => $fp,
                'process'=>function($resource, $download_size = 0, $downloaded = 0, $upload_size = 0, $uploaded = 0) use($processModel, $device_id, $save, &$processTime){
                    $currentTime = time();
                    if( (($currentTime - $processTime) > 1) 
                        || ($downloaded != 0 && $download_size == $downloaded)
                        || ($uploaded != 0 && $upload_size == $uploaded) ){
                        
                        $processTime = $currentTime;
                        $processResult = $processModel->edit([
                            DATA_KEY => [[[PROCESS_DEVICE_ID, '=', $device_id]]],
                            DATA_EDITOR => [
                                PROCESS_DEVICE_DTOTAL => $download_size,
                                PROCESS_DEVICE_DNOW => $downloaded,
                                PROCESS_DEVICE_UTOTAL => $upload_size,
                                PROCESS_DEVICE_UNOW => $uploaded,
                            ]
                        ]);
                        
                    }
                }
    
            ]);

            $processModel->edit([
                DATA_KEY => [[[PROCESS_DEVICE_ID, '=', $device_id]]],
                DATA_EDITOR => [
                    PROCESS_DEVICE_DTOTAL => 0,
                    PROCESS_DEVICE_DNOW => 0,
                ]
            ]);

            
            if (!$result){
               return Reply::make(false, 'ERROR', ['data' => 'Cannot download package']);
            }

            chmod($save, 0755);
        }
    }
}
