<?php

namespace App\Http\Middleware;
use Closure;
use Illuminate\Support\Facades\App;

class CorsMidware
{
    public function handle($request, Closure $next)
    {
        return $next($request)
        ->header('Access-Control-Allow-Origin', 'http://collector.khachgoi.ngsi.vn') 
//         ->header('Access-Control-Allow-Origin', 'http://collectors.kcs.com') 
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'X-CSRF-TOKEN, X-Requested-With, X-XSRF-TOKEN, Content-Type')
        ->header('Access-Control-Allow-Credentials', 'true');
    }
}