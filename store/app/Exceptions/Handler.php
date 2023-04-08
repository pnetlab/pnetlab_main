<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Cookie;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /* (non-PHPdoc)
     * @see \Illuminate\Foundation\Exceptions\Handler::unauthenticated()
     */
    protected function unauthenticated($request, \Illuminate\Auth\AuthenticationException $exception)
    {
       $actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";
       Cookie::queue(Cookie::make('token', null, -3600, '/', APP_DOMAIN));
       return $request->expectsJson()
                    ? Reply::finish(false, ERROR_AUTHEN, 'Please login again') 
                    : redirect()->guest('/auth/login/manager?error='.$exception->getMessage().'&link='.urlencode(get($actual_link, '/')));
        
    }

	/**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function report(Exception $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $exception)
    {
        return parent::render($request, $exception);
    }
}
