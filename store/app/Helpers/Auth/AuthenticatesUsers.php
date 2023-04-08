<?php

namespace App\Helpers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Foundation\Auth\RedirectsUsers;
use Illuminate\Foundation\Auth\ThrottlesLogins  ;
use App\Helpers\Request\Reply;
use Illuminate\Http\Response;
use \Exception;
use Illuminate\Support\Facades\Cookie;
use JWTAuth;
use App\Helpers\Captcha\Captcha;
use App\Helpers\Token\JWToken;

trait AuthenticatesUsers
{
    use RedirectsUsers, ThrottlesLogins;

    /**
     * Show the application's login form.
     *
     * @return \Illuminate\Http\Response
     */
    public function showLoginForm()
    {
        return view('auth.login');
    }

    /**
     * Handle a login request to the application. 
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        // If the class is using the ThrottlesLogins trait, we can automatically throttle
        // the login attempts for this application. We'll key this by the username and
        // the IP address of the client making these requests into this application.
        
        $captcha = $request->input('captcha', false);
            if(!Captcha::verifyCaptcha($captcha)){
                Reply::finish(false, 'Error', 'Captcha is wrong');
        }
            
        if ($this->hasTooManyLoginAttempts($request)) {
            $this->fireLockoutEvent($request);
            return $this->sendLockoutResponse($request);
        }
        $credentials = $request->only('username', 'password');
        
        // attempt to verify the credentials and create a token for the user
        if (!Auth::attempt($credentials)) {
            Reply::finish(false, 'Error', 'Login fail');
        }
        
       $token = Auth::getTokenFromUser();
       $this->clearLoginAttempts($request);
       Auth::login($token);
       
       $response = new Response(Reply::make(true, 'Authen successfull', ['token' => $token]));
       
       return $response; 
            

        
    }
    
    protected function username(){
        return 'username';
    }


    /**
     * Send the response after the user was authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    protected function sendLoginResponse(Request $request)
    {
        $request->session()->regenerate();

        $this->clearLoginAttempts($request);

        return $this->authenticated($request, $this->guard()->user())
                ?: redirect()->intended($this->redirectPath());
    }

    /**
     * The user has been authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  mixed  $user
     * @return mixed
     */
    
    public function logout(Request $request)
    {
        
        $this->guard()->logout();
        
        $request->session()->invalidate();
        
        Cookie::queue(Cookie::make('token', null, -3600, '/', APP_DOMAIN));

        Reply::finish(true,'Success', '');
    }

    /**
     * Get the guard to be used during authentication.
     *
     * @return \Illuminate\Contracts\Auth\StatefulGuard
     */
    protected function guard()
    {
        return Auth::guard();
    }
}
