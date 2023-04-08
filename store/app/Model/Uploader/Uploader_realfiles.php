<?php

namespace App\Model\Uploader; 

use Illuminate\Support\Facades\DB;

use App\Model\Model_basic;
use App\Helpers\Request\Reply;
use App\Helpers\Uploader\FileFunc;
use App\Helpers\Request\Query;
use App\Helpers\DB\Transactions;


class Uploader_realfiles extends Model_basic
{
    function __construct(){
        
        parent::__construct();
        
         $this->struct = array(
            FILE_ID => [
                    PROP_NAME => FILE_ID,
                    PROP_NULL => true,
                    PROP_REGEX => "Number",
                ], 
            FILE_UPLOADER => [
                    PROP_NAME => FILE_UPLOADER,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            FILE_DISK => [
                    PROP_NAME => FILE_DISK,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            FILE_TABLE => [
                    PROP_NAME => FILE_TABLE,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            FILE_COLUMN => [
                    PROP_NAME => FILE_COLUMN,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            FILE_UID => [
                    PROP_NAME => FILE_UID,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            FILE_PATH => [
                    PROP_NAME => FILE_PATH,
                    PROP_NULL => true,
                    PROP_REGEX => "Varchar",
                ], 
            FILE_NAME => [
                 PROP_NAME => FILE_NAME,
                 PROP_NULL => true,
                 PROP_REGEX => "Varchar",
                 ],
           FILE_SIZE => [
                 PROP_NAME => FILE_SIZE,
                 PROP_NULL => true,
                 PROP_REGEX => "Number",
                 ],
                
        );
        
        $this->query_builder = DB::table(UPLOADER_FILES_TABLE);
        $this->id = FILE_ID;
        $this->name = UPLOADER_FILES_TABLE;
        $this->uploader = APP_UPLOAD;
        
        $this->registerSql = [
            //['Auth/MapUG', AUTHEN_ID, MAP_UG_PEOPLEID, null, null, 'cascade', null],
        ];
        
        $this->registerDepend = [
            //['Auth/MapUG', AUTHEN_NAME, MAP_UG_PEOPLENAME, AUTHEN_ID, MAP_UG_PEOPLEID],
        
        ];
        
       
    }
    
    
    public function drop($keys,  $special = null, $trust = false){
    
        $dataBuilderRoot = $this->query_builder;
        $dataBuilder = clone $dataBuilderRoot;
         
        try {
    
            if($keys != 'All' && count($keys) == 0)
                return Reply::make(false, 'Error', 'No Key defined');
            if($keys == 'All') $keys = [];
    
            $this->buildCondition($dataBuilder, $keys, $trust);
    
            if(is_callable($special)){
                $special($dataBuilder);
            }
           
            $delDatas = $this->read($keys);
            if(!$delDatas['result']) return $delDatas;
            $delDatas = $delDatas['data'];
            
            foreach ($delDatas as $delData){
            
                $result = FileFunc::delete(
                    $delData->{FILE_UPLOADER},
                    $delData->{FILE_DISK},
                    $delData->{FILE_TABLE},
                    $delData->{FILE_COLUMN},
                    $delData->{FILE_UID},
                    $delData->{FILE_NAME}
                );
            
                if(!$result['result']) return $result;
                $updateResult = Query::make($result['data']['ulink'], 'post', ['utoken'=>$result['data']['utoken']], ['dataType'=>'json']);
                if(!$updateResult['result']) return $updateResult;
            }
            
            return Reply::make(true, 'Success');
    
        } catch (\Exception $e) {
            return Reply::finish(false, 'Error', $e->getMessage());
        }
    }
   
    
}