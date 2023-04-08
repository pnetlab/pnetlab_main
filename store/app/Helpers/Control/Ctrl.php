<?php

namespace App\Helpers\Control;

use App\Helpers\DB\Models;

class Ctrl
{

    private static $getResult = [];
    public static function get($name, $default = null, $array = false)
    {
        if(isset(self::$getResult[$name])) return self::$getResult[$name];
        $result = Models::get('Control/Control')->read([[[CONTROL_NAME, '=', $name]]]);
        if (!$result['result']) return $default;
        if (!isset($result['data'][0])) return $default;
        if ($array) {
            self::$getResult[$name] = json_decode($result['data'][0]->{CONTROL_VALUE}, true);
        } else {
            self::$getResult[$name] = $result['data'][0]->{CONTROL_VALUE};
        }
        return self::$getResult[$name];
    }
    public static function set($name, $value, $array = false)
    {
        $ctlModel = Models::get('Control/Control');
        if ($array) $value = json_encode($value);
        if ($ctlModel->is_exist([[[CONTROL_NAME, '=', $name]]])) {
            return $ctlModel->edit([
                DATA_KEY => [[[CONTROL_NAME, '=', $name]]],
                DATA_EDITOR => [CONTROL_VALUE => $value]
            ]);
        } else {
            return $ctlModel->add([[CONTROL_NAME => $name, CONTROL_VALUE => $value]]);
        }
    }
    public static function gets($data)
    {
        $result = Models::get('Control/Control')->read(null, function($db)use($data){
            $db->whereIn(CONTROL_NAME, $data);
        });
        if (!$result['result']) return [];
        
        $data = $result['data']->mapWithKeys(function($item){
            return [$item->{CONTROL_NAME} => $item->{CONTROL_VALUE}];
        });

        return $data->toArray();
    }
    
}
