<?php

namespace App\Model\Admin;

use Illuminate\Support\Facades\DB;

use App\Model\Model_basic;
use App\Helpers\Request\Reply;


class Process_device extends Model_basic
{
    function __construct(){
        
        parent::__construct();
        
         $this->struct = array(
                PROCESS_DEVICE_ID => [
                    PROP_NAME => PROCESS_DEVICE_ID,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            PROCESS_DEVICE_DTOTAL => [
                    PROP_NAME => PROCESS_DEVICE_DTOTAL,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            PROCESS_DEVICE_DNOW => [
                    PROP_NAME => PROCESS_DEVICE_DNOW,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            PROCESS_DEVICE_UTOTAL => [
                    PROP_NAME => PROCESS_DEVICE_UTOTAL,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            PROCESS_DEVICE_UNOW => [
                    PROP_NAME => PROCESS_DEVICE_UNOW,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            PROCESS_DEVICE_LOG => [
                    PROP_NAME => PROCESS_DEVICE_LOG,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            
        );
        
        $this->query_builder = DB::table(PROCESS_DEVICE_TABLE);
        $this->id = PROCESS_DEVICE_ID;
        $this->name = PROCESS_DEVICE_TABLE;
        $this->uploader = APP_UPLOAD;
        
        $this->registerSql = [
            //['Auth/MapUG', AUTHEN_ID, MAP_UG_PEOPLEID, null, null, 'cascade', null],
        ];
        
        $this->registerDepend = [
            //['Auth/MapUG', AUTHEN_NAME, MAP_UG_PEOPLENAME, AUTHEN_ID, MAP_UG_PEOPLEID],
        
        ];
        
       
    }
    
   
    
}