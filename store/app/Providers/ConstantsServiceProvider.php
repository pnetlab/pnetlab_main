<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class ConstantsServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
       
        foreach ($this->glob_recursive(app_path('Constants').'/*.php') as $filename) {
            require_once($filename);
        }
        
    }
    private function glob_recursive($pattern, $flags = 0)
    {
        $files = glob($pattern, $flags);
       
        foreach (glob(dirname($pattern).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir)
        {
            $files = array_merge($files, $this->glob_recursive($dir.'/'.basename($pattern), $flags));
        }
       
        return $files;
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
      
       
    }
}
