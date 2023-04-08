<?php

namespace App\Model\Control;

use Illuminate\Support\Facades\DB;

use App\Model\Model_basic;
use App\Helpers\Request\Reply;


class Control extends Model_basic
{
    function __construct(){
        
        parent::__construct();
        
         $this->struct = array(
                CONTROL_NAME => [
                    PROP_NAME => CONTROL_NAME,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            CONTROL_VALUE => [
                    PROP_NAME => CONTROL_VALUE,
                    PROP_NULL => true,
                    PROP_REGEX => "Pass",
                ], 
            
        );
        
        $this->query_builder = DB::table(CONTROL_TABLE);
        $this->id = CONTROL_NAME;
        $this->name = CONTROL_TABLE;
        $this->uploader = APP_UPLOAD;
        
        $this->registerSql = [
            //['Auth/MapUG', AUTHEN_ID, MAP_UG_PEOPLEID, null, null, 'cascade', null],
        ];
        
        $this->registerDepend = [
            //['Auth/MapUG', AUTHEN_NAME, MAP_UG_PEOPLENAME, AUTHEN_ID, MAP_UG_PEOPLEID],
        
        ];
        
       
    }
    
   
    
}