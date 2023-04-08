<?php

namespace App\Model\Notice;

use Illuminate\Support\Facades\DB;

use App\Model\Model_basic;
use App\Helpers\Request\Reply;


class Notice_web extends Model_basic
{
    function __construct(){
        
        parent::__construct();
        
         $this->struct_table = array(
            NOTICE_WEB_TABLE => array(
                
                WEB_NOTICE_ID => [
                    PROP_TABLE => NOTICE_WEB_TABLE,
                    PROP_NAME => WEB_NOTICE_ID,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            WEB_NOTICE_SUBSCRIPTION => [
                    PROP_TABLE => NOTICE_WEB_TABLE,
                    PROP_NAME => WEB_NOTICE_SUBSCRIPTION,
                    PROP_NULL => true,
                    PROP_REGEX => "Json",
                ], 
            WEB_NOTICE_SUBMD5 => [
                    PROP_TABLE => NOTICE_WEB_TABLE,
                    PROP_NAME => WEB_NOTICE_SUBMD5,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            WEB_NOTICE_UID => [
                    PROP_TABLE => NOTICE_WEB_TABLE,
                    PROP_NAME => WEB_NOTICE_UID,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            WEB_NOTICE_UNAME => [
                    PROP_TABLE => NOTICE_WEB_TABLE,
                    PROP_NAME => WEB_NOTICE_UNAME,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            WEB_NOTICE_RESULT => [
                    PROP_TABLE => NOTICE_WEB_TABLE,
                    PROP_NAME => WEB_NOTICE_RESULT,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            WEB_NOTICE_TIME => [
                    PROP_TABLE => NOTICE_WEB_TABLE,
                    PROP_NAME => WEB_NOTICE_TIME,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            
                
            ),
        );
        
        $this->query_builder = DB::table(NOTICE_WEB_TABLE);
        $this->idCol = WEB_NOTICE_ID;
        $this->struct_model = array_merge(
            $this->struct_table[NOTICE_WEB_TABLE]
        );
        
        $this->registerSql = [
            //['Auth/MapUG', AUTHEN_ID, MAP_UG_PEOPLEID, null, null, 'cascade', null],
        ];
        
        $this->registerDepend = [
            ['Auth/User', WEB_NOTICE_UNAME, AUTHEN_USERNAME, WEB_NOTICE_UID, AUTHEN_ID],
        
        ];
        
       
    }
    
   
    
}