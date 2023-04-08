<?php
namespace App\Helpers\View;

class JS {
    
 public static function make_var($var, $name, &$result, $isString = true)
    {
          
            if (is_array($var) || is_object($var)) {
                $result .= ' if (typeof ' . $name .' === "undefined"){'.$name .' = {}; }' . "\n";
                foreach ($var as $key => $val) {

                    JS::make_var($val, $name . "[\"" . $key . "\"]", $result, $isString);
            

                    // $result .= ' if (typeof ' . $name .'["' . $key . '"] === "undefined"){'.$name .'["' . $key . '"] = {}; }';
                    // JS::make_var($val, $name . "[\"" . $key . "\"]", $result, $isString);
                }
            } else {
                if($isString){
                    $result .= $name . " = `" . $var . "`; \n";
                }else{
                    $result .= $name . " = " . $var . "; \n";
                }
            }
        
        return $name;
    }

    public static function load($data, $name, $isString = true)
    {
        $result = "\n <script>";
        JS::make_var($data, $name, $result, $isString);
        $result .= "</script> \n";
        return $result;
    }
    
}