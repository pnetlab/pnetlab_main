<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/*Admin*/

use App\Helpers\Encrypt\Encrypt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

// Auth::routes();

Route::match(['post'], '/captcha', function() {
    return App::call('\App\Http\Controllers\Auth\LoginController@captcha');
});

Route::redirect('/', '/store/public/admin/main/view', 301);

/*route for admin*/

// Route::match(['post', 'get'], '/test', function () {
//     die;
//     print_r($_SERVER);
// });

Route::match(['post', 'get'], '/admin/default/initial', function () {
    return App::call('\App\Http\Controllers\Admin\DefaultController@initial');
});

Route::match(['post', 'get'], '/admin/default/language', function () {
    return App::call('\App\Http\Controllers\Admin\DefaultController@language');
});

Route::match(['post', 'get'], '/auth/{controller}/{method}', function ($controller, $method) {
    return App::call('\App\Http\Controllers\Auth\\'.ucfirst($controller).'Controller@' . $method);
});

Route::match(['post', 'get'], '/admin/{controller}/{method}', function ($controller, $method) {
    return App::call('\App\Http\Controllers\Admin\\'.ucfirst($controller).'Controller@' . $method);
})->middleware('auth');

Route::match(['post', 'get'], '/user/{controller}/{method}', function ($controller, $method) {
    return App::call('\App\Http\Controllers\User\\'.ucfirst($controller).'Controller@' . $method);
})->middleware('auth');

Route::match(['post', 'get'], '/notice/{controller}/{method}', function ($controller, $method) {
    return App::call('\App\Http\Controllers\Notice\\'.ucfirst($controller).'Controller@' . $method);
})->middleware('auth');

// Route::match(['get'], '/redirect', function (Request $request) {
    
//     return Redirect::away($request->input('blod'));
// });







