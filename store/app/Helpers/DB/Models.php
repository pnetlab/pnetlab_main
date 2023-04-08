<?php 
namespace App\Helpers\DB;
class Models {

    function __construct(){
    }
    private static $models = [];
   
    public function getModel($modelName, $parameter=[]){
        
        if(isset(self::$models[$modelName])){
            return self::$models[$modelName];
        }
        
        $modelResolv = "App\\Model\\".str_replace('/', '\\', $modelName);
        self::$models[$modelName] = new $modelResolv(...$parameter);
        return self::$models[$modelName];
    }
    
    public function set($modelName, $model){
        self::$models[$modelName] = $model;
    }

    public static function get($modelName, $parameter=[]){
        if(isset(self::$models[$modelName])){
            return self::$models[$modelName];
        }
        
        $modelResolv = "App\\Model\\".str_replace('/', '\\', $modelName);
        self::$models[$modelName] = new $modelResolv(...$parameter);
        return self::$models[$modelName];
    }
   
}

?>