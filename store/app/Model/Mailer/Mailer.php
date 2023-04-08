<?php

namespace App\Model\Mailer;

use Illuminate\Support\Facades\DB;

use App\Model\Model_basic;
use App\Helpers\Request\Reply;


class Mailer extends Model_basic
{
    function __construct(){
        
        parent::__construct();
        
         $this->struct = array(
            MAIL_ID => [
                PROP_TABLE => MAILER_TABLE,
                PROP_NAME => MAIL_ID,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ], 
             
             MAIL_MAILER => [
                 PROP_NAME => MAIL_MAILER,
                 PROP_NULL => true,
                 PROP_REGEX => "Varchar",
             ],
             
            MAIL_NAME => [
                    PROP_TABLE => MAILER_TABLE,
                    PROP_NAME => MAIL_NAME,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            MAIL_CONFIG => [
                    PROP_TABLE => MAILER_TABLE,
                    PROP_NAME => MAIL_CONFIG,
                    PROP_NULL => true,
                    PROP_REGEX => "Json",
                ], 
            MAIL_WEIGHT => [
                    PROP_TABLE => MAILER_TABLE,
                    PROP_NAME => MAIL_WEIGHT,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            MAIL_USED => [
                    PROP_TABLE => MAILER_TABLE,
                    PROP_NAME => MAIL_USED,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            MAIL_FREE => [
                    PROP_TABLE => MAILER_TABLE,
                    PROP_NAME => MAIL_FREE,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            MAIL_LIMIT => [
                    PROP_TABLE => MAILER_TABLE,
                    PROP_NAME => MAIL_LIMIT,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            MAIL_TARGET => [
                    PROP_TABLE => MAILER_TABLE,
                    PROP_NAME => MAIL_TARGET,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            MAIL_ACTIVE => [
                    PROP_TABLE => MAILER_TABLE,
                    PROP_NAME => MAIL_ACTIVE,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            
        );
        
        $this->query_builder = DB::table(MAILER_TABLE);
        $this->id = MAIL_ID;
        $this->name = MAILER_TABLE;
        
        $this->registerSql = [
            //['Auth/MapUG', AUTHEN_ID, MAP_UG_PEOPLEID, null, null, 'cascade', null],
        ];
        
        $this->registerDepend = [
            //['Auth/MapUG', AUTHEN_NAME, MAP_UG_PEOPLENAME, AUTHEN_ID, MAP_UG_PEOPLEID],
        
        ];
        
       
    }
    
   
    
}