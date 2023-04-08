<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
    
    function __construct(){
        $this->models = resolve('Models');
    }
    
    public function getMapData($data, $model, $localID, $remoteID, $remoteCol, $default=null, $special=null){
        
        if(is_null($data)){
            $condition = [];
        }else{
            
            if(is_array($data)){
                $column = array_unique(array_column($data, $localID));
            }else{
                $column = array_unique($data->map(function ($item) {
                    return $item[$localID];
                })->toArray());
            }
            
            $condition = array_map(function($e) use ($remoteID) {return [[$remoteID, '=', $e]];}, $column);
        }
        
        $mapData = $model->read($condition, $special, true);
        if($mapData['result']) {
            $mapData = $mapData['data']->mapWithKeys(function ($item) use($remoteID, $remoteCol, $default){
                
                if(isset($item->{$remoteCol})){
                    $value = $item->{$remoteCol};
                }elseif(!is_callable($default)){
                    $value = $default;
                }else{
                    $value = null;
                }
                
                if(is_callable($default)){
                    $value = $default($value);
                }
                
                return [$item->{$remoteID}=>$value];
                
            });
        }else{
            $mapData = [];
        }
        
        return $mapData;
    }
}
