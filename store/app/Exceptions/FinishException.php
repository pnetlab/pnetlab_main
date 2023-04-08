<?php

namespace App\Exceptions;

use Exception;

class FinishException extends Exception
{


    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $exception
     * @return void
     */
    
    public function __construct($reponse){
        $this->response = $reponse;
    }
    
    public function report()
    {
        
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return \Illuminate\Http\Response
     */
    public function render($response)
    {
        return $this->response;
    }
}
