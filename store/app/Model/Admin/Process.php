<?php

namespace App\Model\Admin;

use Illuminate\Support\Facades\DB;

use App\Model\Model_basic;
use App\Helpers\Request\Reply;


class Process extends Model_basic
{
    function __construct(){
        
        parent::__construct();
        
         $this->struct = array(
                PROCESS_ID => [
                    PROP_NAME => PROCESS_ID,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            PROCESS_DTOTAL => [
                    PROP_NAME => PROCESS_DTOTAL,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            PROCESS_DNOW => [
                    PROP_NAME => PROCESS_DNOW,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            PROCESS_UTOTAL => [
                    PROP_NAME => PROCESS_UTOTAL,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            PROCESS_UNOW => [
                    PROP_NAME => PROCESS_UNOW,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            PROCESS_FINISH => [
                    PROP_NAME => PROCESS_FINISH,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            
        );
        
        $this->query_builder = DB::table(PROCESS_TABLE);
        $this->id = PROCESS_ID;
        $this->name = PROCESS_TABLE;
        $this->uploader = APP_UPLOAD;
        
        $this->registerSql = [
            //['Auth/MapUG', AUTHEN_ID, MAP_UG_PEOPLEID, null, null, 'cascade', null],
        ];
        
        $this->registerDepend = [
            //['Auth/MapUG', AUTHEN_NAME, MAP_UG_PEOPLENAME, AUTHEN_ID, MAP_UG_PEOPLEID],
        
        ];
        
       
    }
    
   
    
}