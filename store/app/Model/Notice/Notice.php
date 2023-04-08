<?php

namespace App\Model\Notice;

use Illuminate\Support\Facades\DB;

use App\Model\Model_basic;
use App\Helpers\Request\Reply;


class Notice extends Model_basic
{
    function __construct(){
        
        parent::__construct();
        
         $this->struct_table = array(
            NOTICE_TABLE => array(
                
                NOTICE_ID => [
                    PROP_TABLE => NOTICE_TABLE,
                    PROP_NAME => NOTICE_ID,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            NOTICE_TIME => [
                    PROP_TABLE => NOTICE_TABLE,
                    PROP_NAME => NOTICE_TIME,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            NOTICE_UID => [
                    PROP_TABLE => NOTICE_TABLE,
                    PROP_NAME => NOTICE_UID,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            NOTICE_UNAME => [
                    PROP_TABLE => NOTICE_TABLE,
                    PROP_NAME => NOTICE_UNAME,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            NOTICE_FIRE_UID => [
                    PROP_TABLE => NOTICE_TABLE,
                    PROP_NAME => NOTICE_FIRE_UID,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            NOTICE_FIRE_UNAME => [
                    PROP_TABLE => NOTICE_TABLE,
                    PROP_NAME => NOTICE_FIRE_UNAME,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            NOTICE_CONTENT => [
                    PROP_TABLE => NOTICE_TABLE,
                    PROP_NAME => NOTICE_CONTENT,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            NOTICE_VARIABLE => [
                    PROP_TABLE => NOTICE_TABLE,
                    PROP_NAME => NOTICE_VARIABLE,
                    PROP_NULL => true,
                    PROP_REGEX => "Json",
                ], 
            NOTICE_SEEN => [
                    PROP_TABLE => NOTICE_TABLE,
                    PROP_NAME => NOTICE_SEEN,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            NOTICE_LEVEL => [
                    PROP_TABLE => NOTICE_TABLE,
                    PROP_NAME => NOTICE_LEVEL,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            NOTICE_ACTION => [
                    PROP_TABLE => NOTICE_TABLE,
                    PROP_NAME => NOTICE_ACTION,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            
                
            ),
        );
        
        $this->query_builder = DB::table(NOTICE_TABLE);
        $this->idCol = NOTICE_ID;
        $this->struct_model = array_merge(
            $this->struct_table[NOTICE_TABLE]
        );
        
        $this->registerSql = [
            //['Auth/MapUG', AUTHEN_ID, MAP_UG_PEOPLEID, null, null, 'cascade', null],
        ];
        
        $this->registerDepend = [
            ['Auth/User', NOTICE_UNAME, AUTHEN_USERNAME, NOTICE_UID, AUTHEN_ID],
            ['Auth/User', NOTICE_FIRE_UNAME, AUTHEN_USERNAME, NOTICE_FIRE_UID, AUTHEN_ID],
        
        ];
        
       
    }
    
   
    
}