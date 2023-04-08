<?php

namespace App\Model\Admin;

use Illuminate\Support\Facades\DB;

use App\Model\Model_basic;
use App\Helpers\Request\Reply;


class Html5 extends Model_basic
{
    function __construct(){
        
        parent::__construct();
        
         $this->struct = array(
                HTML5_USERNAME => [
                    PROP_NAME => HTML5_USERNAME,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            HTML5_POD => [
                    PROP_NAME => HTML5_POD,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            HTML5_TOKEN => [
                    PROP_NAME => HTML5_TOKEN,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            
        );
        
        $this->query_builder = DB::table(HTML5_TABLE);
        $this->id = HTML5_POD;
        $this->name = HTML5_TABLE;
        $this->uploader = APP_UPLOAD;
        
        $this->registerSql = [
            //['Auth/MapUG', AUTHEN_ID, MAP_UG_PEOPLEID, null, null, 'cascade', null],
        ];
        
        $this->registerDepend = [
            //['Auth/MapUG', AUTHEN_NAME, MAP_UG_PEOPLENAME, AUTHEN_ID, MAP_UG_PEOPLEID],
        
        ];
        
       
    }
    
   
    
}