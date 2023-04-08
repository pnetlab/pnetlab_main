<?php

namespace App\Model\Auth;

use Illuminate\Support\Facades\DB;

use App\Model\Model_basic;
use App\Helpers\Request\Reply;


class Authentication extends Model_basic
{
    function __construct(){
        
        parent::__construct();
        
         $this->struct = array(
           AUTHEN_ID => [
                    PROP_NAME => AUTHEN_ID,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            AUTHEN_USERNAME => [
                    PROP_NAME => AUTHEN_USERNAME,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            AUTHEN_EMAIL => [
                    PROP_NAME => AUTHEN_EMAIL,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            AUTHEN_PHONE => [
                    PROP_NAME => AUTHEN_PHONE,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            AUTHEN_IMG => [
                    PROP_NAME => AUTHEN_IMG,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            AUTHEN_PASS => [
                    PROP_NAME => AUTHEN_PASS,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            AUTHEN_TOKEN => [
                    PROP_NAME => AUTHEN_TOKEN,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            AUTHEN_GROUP => [
                    PROP_NAME => AUTHEN_GROUP,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            AUTHEN_NOTE => [
                    PROP_NAME => AUTHEN_NOTE,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            AUTHEN_PARENT => [
                    PROP_NAME => AUTHEN_PARENT,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            AUTHEN_TIME => [
                    PROP_NAME => AUTHEN_TIME,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            AUTHEN_ONLINE => [
                    PROP_NAME => AUTHEN_ONLINE,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            AUTHEN_ACTIVE => [
                PROP_NAME => AUTHEN_ACTIVE,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ], 
            AUTHEN_IMG => [
                    PROP_NAME => AUTHEN_IMG,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
        );
         
        $this->name = AUTHENTICATION_TABLE;
        $this->query_builder = DB::table($this->name);
        $this->id = AUTHEN_ID;
        $this->uploader = APP_UPLOAD;
        
        $this->registerSql = [
            // ['Admin/Campaigns', AUTHEN_ID, CAMPAIGN_UID, null, null, 'cascade', null],
        ];
        
        $this->registerDepend = [
            //['Auth/MapUG', AUTHEN_NAME, MAP_UG_PEOPLENAME, AUTHEN_ID, MAP_UG_PEOPLEID],
        
        ];
        
       
    }
    
   
    
}