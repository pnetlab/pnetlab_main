<?php 
namespace App\Helpers\View;
 
class Loader {
    var $loaded = [];
    public function asset($link, $type = null){
       if(isset($loaded[$link])){
           return '';
       }else{
           $this->loaded[$link] = true;
           switch ($type){
               case null:{
                   break;
               }
               case 'script':{
                   return '<script src="'.$link.'"></script>';
                   break;
               }
               case 'css':{
                   return '<link rel="stylesheet" href="'.$link.'" media="all" type="text/css">';
                   break;
               }
           }
       }
        
    }
    
    public function check($asset){
        return isset($this->loaded[$asset]);
    }
    
}


?>