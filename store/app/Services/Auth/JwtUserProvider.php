<?php

namespace App\Services\Auth;

use Illuminate\Support\Str;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Auth\Authenticatable as Authenticatable;
use Illuminate\Support\Facades\Hash;
use App\Helpers\Request\Checker;

class JwtUserProvider implements UserProvider
{
/**
   * The Mongo User Model
   */
  private $model;
 
  /**
   * Create a new mongo user provider.
   *
   * @return \Illuminate\Contracts\Auth\Authenticatable|null
   * @return void
   */
  public function __construct($userModel)
  {
     $this->model = $userModel;
  }
 
  
  /* (non-PHPdoc)
     * @see \Illuminate\Contracts\Auth\UserProvider::retrieveById()
     */
    public function retrieveById($identifier)
    {
        // TODO Auto-generated method stub
        
    }

/* (non-PHPdoc)
     * @see \Illuminate\Contracts\Auth\UserProvider::retrieveByToken()
     */
    public function retrieveByToken($identifier, $token)
    {
        // TODO Auto-generated method stub
        
    }

/* (non-PHPdoc)
     * @see \Illuminate\Contracts\Auth\UserProvider::updateRememberToken()
     */
    public function updateRememberToken(\Illuminate\Contracts\Auth\Authenticatable $user, $token)
    {
        // TODO Auto-generated method stub
        
    }

/* (non-PHPdoc)
     * @see \Illuminate\Contracts\Auth\UserProvider::validateCredentials()
     */
    public function validateCredentials(\Illuminate\Contracts\Auth\Authenticatable $user, array $credentials)
    {
        if(!isset($credentials['password']) || $credentials['password'] == ''){
            return false;
        }
        
        return Hash::check($credentials['password'], $user->{AUTHEN_PASS});
        
    }

/**
   * Retrieve a user by the given credentials.
   *
   * @param  array  $credentials
   * @return \Illuminate\Contracts\Auth\Authenticatable|null
   */
  public function retrieveByCredentials(array $credentials)
  {
    if (empty($credentials)) {
        return null;
    }
    
    if(isset($credentials['username']) && $credentials['username']!=''){
        $userName = $credentials['username'];
    
        $key = [
            [[AUTHEN_EMAIL, '=', $userName]],
            [[AUTHEN_USERNAME, '=', $userName]],
            [[AUTHEN_PHONE, '=', $userName]],
        ];
    }
    
    $user = $this->model->read($key);
    
    if($user['result'] && isset($user['data'][0])){
        $user = (array)$user['data'][0];
        return new JwtGenericUser($user);
    }else{
        return null;
    }
    
  }
 
  
  
}
