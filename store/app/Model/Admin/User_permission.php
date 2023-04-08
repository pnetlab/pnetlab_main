<?php

namespace App\Model\Admin;

use Illuminate\Support\Facades\DB;

use App\Model\Model_basic;
use App\Helpers\Request\Reply;


class User_permission extends Model_basic
{
    function __construct(){
        
        parent::__construct();
        
         $this->struct = array(
                USER_PER_ID => [
                    PROP_NAME => USER_PER_ID,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            USER_PER_ROLE => [
                    PROP_NAME => USER_PER_ROLE,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            USER_PER_NAME => [
                    PROP_NAME => USER_PER_NAME,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            
        );
        
        $this->query_builder = DB::table(USER_PERMISSION_TABLE);
        $this->id = USER_PER_ID;
        $this->name = USER_PERMISSION_TABLE;
        $this->uploader = APP_UPLOAD;
        
        $this->registerSql = [
            //['Auth/MapUG', AUTHEN_ID, MAP_UG_PEOPLEID, null, null, 'cascade', null],
        ];
        
        $this->registerDepend = [
            //['Auth/MapUG', AUTHEN_NAME, MAP_UG_PEOPLENAME, AUTHEN_ID, MAP_UG_PEOPLEID],
        
        ];
        
       
    }
    
   
    
}