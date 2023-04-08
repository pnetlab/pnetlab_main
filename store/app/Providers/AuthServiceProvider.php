<?php
namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Services\Auth\JwtUserProvider;
use App\Services\Auth\JwtGuard;
use Illuminate\Support\Facades\Auth;

class AuthServiceProvider extends ServiceProvider
{

    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy'
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
        
        // add custom guard provider
        Auth::provider('jwt', function ($app, array $config)
        {
            return new JwtUserProvider(resolve('Models')->getModel('Auth/Authentication'));
        });
        
        // add custom guard
        Auth::extend('jwt', function ($app, $name, array $config)
        {
            return new JwtGuard(Auth::createUserProvider($config['provider']), $app->make('request'));
        });
    }
}
