<?php

namespace App\Services\Auth;

use App\Helpers\DB\Models;
use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\UserProvider;
use App\Helpers\Token\JWToken;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Auth\AuthenticationException;
use App\Helpers\Request\Reply;

class JwtGuard implements Guard
{
    use \Illuminate\Auth\GuardHelpers;

    /**
     * The request instance.
     *
     * @var \Illuminate\Http\Request
     */
    protected $request;

    /**
     * The name of the query string item from the request containing the API token.
     *
     * @var string
     */
    protected $inputKey;

   
    protected $log;

    /**
     * Create a new authentication guard.
     *
     * @param  \Illuminate\Contracts\Auth\UserProvider  $provider
     * @param  \Illuminate\Http\Request  $request
     * @return void
     */
    public function __construct(UserProvider $provider, Request $request)
    {
        $this->request = $request;
        $this->provider = $provider;
        $this->inputKey = 'token';
        
    }

    /**
     * Get the currently authenticated user.
     *
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function user()
    {
        // If we've already retrieved the user for the current request we can just
        // return it back immediately. We do not want to fetch the user data on
        // every call to this method because that would be tremendously slow.
        if (! is_null($this->user)) {
            return $this->user;
        }

        return null;
    }

    /**
     * Get the token for the current request.
     *
     * @return string
     */
    public function getTokenForRequest()
    {
        $token = $this->request->cookie($this->inputKey);
        
        if (empty($token)) {
            $token = $this->request->query($this->inputKey);
        }
        
        if (empty($token)) {
            $token = $this->request->input($this->inputKey);
        }

        if (empty($token)) {
            $token = $this->request->bearerToken();
        }

        if (empty($token)) {
            $token = $this->request->getPassword();
        }

        return $token;
    }

    /**
     * Validate a user's credentials.
     *
     * @param  array  $credentials
     * @return bool
     */
    public function validate(array $credentials = [])
    {
        if (empty($credentials[$this->inputKey])) {
            return false;
        }

        $credentials = [$this->storageKey => $credentials[$this->inputKey]];

        if ($this->provider->retrieveByCredentials($credentials)) {
            return true;
        }

        return false;
    }

    /**
     * Set the current request instance.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return $this
     */
    public function setRequest(Request $request)
    {
        $this->request = $request;

        return $this;
    }
    
    public function attempt(array $credentials = [])
    {
        $this->lastAttempted = $user = $this->provider->retrieveByCredentials($credentials);
    
        if($user == null){
            Reply::finish(false, 'Error','Username or Email is not exited');
        }
    
        if ($this->hasValidCredentials($user, $credentials)) {
            $this->setUser($user);
            return true;
        }else{
            Reply::finish(false, 'Error','Password is Wrong');
        }
        return false;
    }
    
    
    public function getTokenFromUser(){
        
        if(!isset($this->user)) return null;
        
        $token = JWToken::make([
            AUTHEN_ID => $this->user->{AUTHEN_ID},
            AUTHEN_EMAIL => $this->user->{AUTHEN_EMAIL},
            AUTHEN_USERNAME => $this->user->{AUTHEN_USERNAME},
            AUTHEN_GROUP => $this->user->{AUTHEN_GROUP},
            AUTHEN_PHONE => $this->user->{AUTHEN_PHONE},
        ]);
        
        if(!$token) $this->log = JWToken::getMessage();
        return $token;
    }
    
    public function getUserFromToken(){
    
            $payload = JWToken::payload($this->getTokenForRequest());
            if(!$payload){
                $this->log = JWToken::getMessage();
                return false;
            }
            
            resolve('Models')->getModel('Auth/Authentication')->edit([
                DATA_KEY => [[[AUTHEN_ID, '=', $payload[AUTHEN_ID]]]],
                DATA_EDITOR => [AUTHEN_ONLINE => time()]
            ]);
    
            if(($payload['exp'] - time()) < config('jwt.ttl')*60/2){
                $this->refreshToken();
            }
    
            return new JwtGenericUser([
                AUTHEN_ID => $payload[AUTHEN_ID],
                AUTHEN_EMAIL => $payload[AUTHEN_EMAIL],
                AUTHEN_USERNAME => $payload[AUTHEN_USERNAME],
                AUTHEN_GROUP => $payload[AUTHEN_GROUP],
                AUTHEN_PHONE => $payload[AUTHEN_PHONE],
            ]);
    
    }
    
    public function getLog(){
        return $this->log;
    }
    
    private function refreshToken(){
        $newToken = JWToken::refresh($this->getTokenForRequest());
        Cookie::queue(Cookie::make('token', $newToken, config('jwt.ttl')*60, '/', APP_DOMAIN));
        return;
    }
    
    public function check()
    {
        $session = Cookie::get('token', '');
        $user = Models::get('Admin/Users')->read([[[USER_COOKIE, '=', $session]]]);
        if(!$user['result'] || !isset($user['data'][0])) return false;
        $user = new JwtGenericUser((array)$user['data'][0]);

        if($user->{USER_ROLE} != 0){
            if(!isset($user->{USER_STATUS}) || $user->{USER_STATUS} != USER_STATUS_ACTIVE) throw new AuthenticationException('You do not have access');

            $currentTime = time();
            if(isset($user->{USER_ACTIVE_TIME}) && $user->{USER_ACTIVE_TIME} > 0){
                if($user->{USER_ACTIVE_TIME} > $currentTime) throw new AuthenticationException('You cannot login yet, your Account will take effect from: '. date("Y-m-d H:i", $user->{USER_ACTIVE_TIME}));
            }
            
            if(isset($user->{USER_EXPIRED_TIME}) && $user->{USER_EXPIRED_TIME} > 0){
                if($user->{USER_EXPIRED_TIME} < $currentTime) throw new AuthenticationException('You can not login, your account has been out of date from: '. date("Y-m-d H:i", $user->{USER_EXPIRED_TIME}));
            }
        }
        
        $this->setUser($user);
        return true;
    }
    
    public function logout()
    {
        $this->user = null;
        Cookie::queue(Cookie::make('token', null, 0, '/', APP_DOMAIN));
    }
    
    public function login($token)
    {
        Cookie::queue(Cookie::make('token', $token, config('jwt.ttl')*60, '/', APP_DOMAIN));
    }
    
    protected function hasValidCredentials($user, $credentials)
    {
        return !is_null($user) && $this->provider->validateCredentials($user, $credentials);
    }
    
    public function authenticate(){
        if($this->check()){
            return true;
        }else{
            throw new AuthenticationException($this->log);
        }
    }
}
