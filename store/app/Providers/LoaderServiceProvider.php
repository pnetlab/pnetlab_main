<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Helpers\View\Loader;

class LoaderServiceProvider extends ServiceProvider
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
        $this->app->singleton('Loader', Loader::class);
    }
}
