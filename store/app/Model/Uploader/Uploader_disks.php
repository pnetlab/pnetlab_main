<?php

namespace App\Model\Uploader;

use Illuminate\Support\Facades\DB;

use App\Model\Model_basic;
use App\Helpers\Request\Reply;


class Uploader_disks extends Model_basic
{
    function __construct(){
        
        parent::__construct();
        
         $this->struct = array(
            
                
           DISK_ID => [
                    PROP_TABLE => UPLOADER_DISKS_TABLE,
                    PROP_NAME => DISK_ID,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            DISK_NAME => [
                    PROP_TABLE => UPLOADER_DISKS_TABLE,
                    PROP_NAME => DISK_NAME,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            DISK_UPLOADER => [
                    PROP_NAME => DISK_UPLOADER,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ],
            DISK_TYPE => [
                    PROP_TABLE => UPLOADER_DISKS_TABLE,
                    PROP_NAME => DISK_TYPE,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            DISK_CONFIG => [
                    PROP_TABLE => UPLOADER_DISKS_TABLE,
                    PROP_NAME => DISK_CONFIG,
                    PROP_NULL => true,
                    PROP_REGEX => "Json",
                ], 
            DISK_WEIGHT => [
                    PROP_TABLE => UPLOADER_DISKS_TABLE,
                    PROP_NAME => DISK_WEIGHT,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            DISK_TOTAL => [
                    PROP_TABLE => UPLOADER_DISKS_TABLE,
                    PROP_NAME => DISK_TOTAL,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            DISK_USED => [
                    PROP_TABLE => UPLOADER_DISKS_TABLE,
                    PROP_NAME => DISK_USED,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            DISK_FREE => [
                    PROP_TABLE => UPLOADER_DISKS_TABLE,
                    PROP_NAME => DISK_FREE,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            DISK_ACTIVE => [
                    PROP_TABLE => UPLOADER_DISKS_TABLE,
                    PROP_NAME => DISK_ACTIVE,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            DISK_TARGET => [
                PROP_TABLE => UPLOADER_DISKS_TABLE,
                PROP_NAME => DISK_TARGET,
                PROP_NULL => true,
                PROP_REGEX => "Number",
                ],
        );
        
        $this->query_builder = DB::table(UPLOADER_DISKS_TABLE);
        $this->id = DISK_ID;
        $this->name = UPLOADER_DISKS_TABLE;
        
        $this->registerSql = [
            ['Uploader/Uploader_files', DISK_NAME, FILE_DISK, null, null, 'cascade', 'cascade'],
        ];
        
        $this->registerDepend = [
            //['Auth/MapUG', AUTHEN_NAME, MAP_UG_PEOPLENAME, AUTHEN_ID, MAP_UG_PEOPLEID],
        
        ];
        
       
    }
    
   
    
}