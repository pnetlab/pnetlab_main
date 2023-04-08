<?php 
namespace App\Helpers\DB;
class Edge {

    function __construct(){
    }
    
    public static function load($remoteModel, $localID, $remoteID, &$data=null, $special=null){

        if(is_null($data)){
            $list = [];
        }else{
            $list = array_unique($data->map(function ($item)use($localID) {
                return $item->{$localID};
            })->toArray());
        }
        $edgeData = $remoteModel->read(null, function($db) use ($list, $remoteID, $special){
            if(count($list) > 0) {
                $db->whereIn($remoteID, $list);
            }
            if(is_callable($special)) $special($db);
            
        }, true);

        if($edgeData['result']){
            $edgeDataGroup = [];
            $edgeData['data']->map(function ($item) use ($remoteID, &$edgeDataGroup) {
                if(!isset($edgeDataGroup[$item->{$remoteID}])) $edgeDataGroup[$item->{$remoteID}] = [];
                $edgeDataGroup[$item->{$remoteID}][] = $item;
            });
            
            $data->map(function ($item,$key)use($localID, $edgeDataGroup, $remoteModel, $data) {
                $data[$key]->{$remoteModel->name} =  get($edgeDataGroup[$item->{$localID}], []);
            });

        }
    }

    public static function mapping($remoteModel, $localID, $remoteID, $remoteCol, $data=null, $special=null){
        
        if(is_null($data)){
            $list = [];
        }else{
            $list = array_unique($data->map(function ($item)use($localID) {
                return $item->{$localID};
            })->toArray());
        }

        $edgeData = $remoteModel->read(null, function($db) use ($list, $remoteID, $special){
            if(count($list) > 0) {
                $db->whereIn($remoteID, $list);
            }
            if(is_callable($special)) $special($db);
            
        }, true);
        
        $mapData = (object)[];
        if($edgeData['result']) {
            $edgeData['data']->map(function ($item) use($remoteID, $remoteCol, &$mapData){
                
                if(isset($item->{$remoteCol}) && isset($item->{$remoteID})){
                    $mapData->{$item->{$remoteID}} = $item->{$remoteCol};
                }
            });
        }
        
        return $mapData;
    }
}

?>