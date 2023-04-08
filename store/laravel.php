<?php

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader
| for our application. We just need to utilize it! We'll require it
| into the script here so that we do not have to worry about the
| loading of any our classes "manually". Feels great to relax.
|
*/

require __DIR__.'/vendor/autoload.php';

class laravel {
    public function __construct(){
        $this->laravel = require_once __DIR__.'/bootstrap/app.php';
        $kernel = $this->laravel->make(Illuminate\Contracts\Console\Kernel::class);
        $kernel->bootstrap();
    }
    
    public function __call($method, $parameters){
       
       return $this->laravel->{$method}(...$parameters);
    }
    
}







