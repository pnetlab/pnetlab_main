<?php 
namespace App\Helpers\DB;

class Transactions {
    
    private static $nest = [];

    public static function begin($db){
        $name = $db->getConnection()->getName();
        if(!isset(self::$nest[$name]) || self::$nest[$name] == 0){
            $db->getConnection()->beginTransaction();
            self::$nest[$name] = 1;
        }else{
            self::$nest[$name] ++;
        }
    }
    
    public static function rollback($db){
        $name = $db->getConnection()->getName();
        if(isset(self::$nest[$name]) && self::$nest[$name] == 1){
            $db->getConnection()->rollBack();
            self::$nest[$name] = 0;
        }elseif(isset(self::$nest[$name]) && self::$nest[$name] > 1){
            self::$nest[$name] --;
        }
        
    }
    
    public static function commit($db){
        $name = $db->getConnection()->getName();
        if(isset(self::$nest[$name]) && self::$nest[$name] == 1){
            $db->getConnection()->commit();
            self::$nest[$name] = 0;
        }elseif(isset(self::$nest[$name]) && self::$nest[$name] > 1){
            self::$nest[$name] --;
        }
    }
    
    
    

}

?>