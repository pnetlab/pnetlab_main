<?php

namespace App\Http\Middleware;
use Closure;
use Illuminate\Support\Facades\App;

class multilang
{
    public function handle($request, Closure $next)
    {
        if(session('lang') == null || session('lang') == ''){
            session(['lang' => config('app.locale')]);
        }
        
        App::setLocale(session('lang'));

        return $next($request);
    }
}