<?php 
if (! function_exists('get')) {
    function get(&$var, $default=null) {
        return isset($var) ? $var : $default;
    }
}

if (! function_exists('makeId')) {
    function makeId() {
        return time().rand(1000,9999);
    }
}

