<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Helpers\DB\Group;
use App\Helpers\DB\Permission;
use App\Helpers\DB\Models;
use App\Helpers\DB\Logging;

class DataServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
       $this->app->singleton('Group', Group::class);
       $this->app->singleton('Permission', Permission::class);
       $this->app->singleton('Logging', Logging::class);
       $this->app->singleton('Models', Models::class);
       
    }
}
