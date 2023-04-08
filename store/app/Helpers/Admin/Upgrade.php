<?php 
namespace App\Helpers\Admin;


use App\Helpers\Box\License;
use App\Helpers\Control\Ctrl;
use App\Helpers\DB\Models;
use App\Helpers\Request\Query;
use App\Helpers\Request\Reply;


class Upgrade { 

    public static function run(){
        $processModel = Models::get('Admin/Process');
        try {
            set_time_limit(0);
            $packageFolder = "upgrade_package";
            $upgradePackage = "upgrade_package.zip";
            $proccessId = 'upgrade';
            
            $oldVersion = Ctrl::get(CTRL_VERSION, '');

            $newVersion = self::checkUpgrade();
            
            if(!$newVersion['result'] || !isset($newVersion['data'])){
                $processModel->drop([[[PROCESS_ID, '=', $proccessId]]]);
                return $newVersion;
            }

            $newVersion = $newVersion['data'][UPGRADE_VERSION];

            if($newVersion == $oldVersion){
                $processModel->drop([[[PROCESS_ID, '=', $proccessId]]]);
                return Reply::make(true, 'success');
            }

            $upgradeResult = Query::boxCenter(APP_CENTER.'/api/offboxs/upgrade/upgrade', [
                UPGRADE_VERSION=>$oldVersion,
            ], ['dataType'=>'json']);
            
            if(!$upgradeResult['result']){
                $processModel->drop([[[PROCESS_ID, '=', $proccessId]]]);
                return $upgradeResult;
            }
            $upgradeResult = $upgradeResult['data'];
            $packLink = $upgradeResult['ulink'].'?utoken='.$upgradeResult['utoken'];

            $upgradeFolder = '/tmp/upgrade';

            exec("sudo rm -rf $upgradeFolder");
            mkdir($upgradeFolder, 0777, true);

            $file = $upgradeFolder.'/'.$upgradePackage;
            $folder = $upgradeFolder.'/'.$packageFolder;

            $fp = fopen ($file, 'w+');
    
            $processTime = 0;
            
    
            if(!$processModel->is_exist([[[PROCESS_ID, '=', $proccessId]]])){
                $processResult = $processModel->add([[PROCESS_ID => $proccessId]]);
                if(!$processResult['result']) return $processResult;
            }
            
            $labcontent = Query::make($packLink, 'get', null , [
                'file' => $fp,
                'process'=>function($resource, $download_size = 0, $downloaded = 0, $upload_size = 0, $uploaded = 0) use($processModel, $proccessId, &$processTime){
                    $currentTime = time();
                    if( (($currentTime - $processTime) > 1) 
                        || ($downloaded != 0 && $download_size == $downloaded)
                        || ($uploaded != 0 && $upload_size == $uploaded) ){
                        
                        $processTime = $currentTime;
                        $processResult = $processModel->edit([
                            DATA_KEY => [[[PROCESS_ID, '=', $proccessId]]],
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
            
            
    
            if(!$labcontent) throw new \ErrorException('Cannot download upgrade package');

            
            $zip = new \ZipArchive();
            $res = $zip->open($file);
            if(!is_dir($folder)){
                mkdir($folder, 0777, true);
            }
            if ($res === TRUE) {
                $zip->extractTo($folder);
                $zip->close();
            }
            unlink($file);
            
            $log = exec("sudo chmod 755 -R $folder");
            print_r($log);
            $log = exec("find $folder -type f -print0 | xargs -0 dos2unix 2>&1");
            print_r($log);
            $log = exec("sudo $folder/upgrade 2>&1");
            print_r($log);

            $processModel->drop([[[PROCESS_ID, '=', $proccessId]]]);
            if(is_dir($upgradeFolder)) exec("sudo rm -rf $upgradeFolder");

            $versionAffterUpgrade = Ctrl::get(CTRL_VERSION, '');
            if($versionAffterUpgrade == $oldVersion || $versionAffterUpgrade == ''){
                throw new \ErrorException($log);
            }
            return Reply::make(true, 'success', $versionAffterUpgrade);

        }
        catch (\ErrorException $e){
            $processModel->drop([[[PROCESS_ID, '=', $proccessId]]]);
            return Reply::make(false, 'Error', $e->getMessage());
        }
    }

    private static $checkUpgradeResult=null;
    public static function checkUpgrade(){
        if(isset(self::$checkUpgradeResult)) return self::$checkUpgradeResult;
        $currentVersion = Ctrl::get(CTRL_VERSION, '4.0.0');
        $upgradeResult = Query::boxCenter(APP_CENTER.'/api/offboxs/upgrade/check', ['version' => $currentVersion], ['dataType'=>'json']);
        if(!$upgradeResult){
            self::$checkUpgradeResult = Reply::make(false, 'ERROR', ['data'=>'Check new version faild']);
        }else {
            self::$checkUpgradeResult = $upgradeResult;
        }
        return self::$checkUpgradeResult;
    }
}
    