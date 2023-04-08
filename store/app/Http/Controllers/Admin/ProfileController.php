<?php
namespace App\Http\Controllers\Admin;

use App\Helpers\DB\Models;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Request\Checker;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Helpers\Request\Reply;
use App\Helpers\Uploader\FileFunc;


class ProfileController extends Controller  
{
    var $permission;

    function __construct()
    {
        parent::__construct();
        $this->userModel = Models::get('Admin/Users');
    }
    
    public function view()
    {
        return view('reactjs.reactjs');
    }
   
    /**
     *
     * function for user change name
     */
    
    public function update(Request $request){
        Checker::method('post');

        $data = $request->input('data', null);
        if(is_null($data)) Reply::finish(false, ERROR_UNDEFINE, ['data'=>'Data']);

        $userName = get($data[USER_USERNAME], '');
        if($userName == '') Reply::finish(false, ERROR_UNDEFINE, ['data'=> USER_USERNAME]);
        if($this->userModel->is_exist([[ [USER_USERNAME, '=', $userName] ]])) Reply::finish(false, ERROR_DUPLICATE, ['data' => USER_USERNAME]);
       
        $query = $this->userModel->edit( [
            DATA_KEY => [[ [USER_POD, '=', Auth::user()->{USER_POD}] ]],
            DATA_EDITOR => [
                USER_USERNAME => $userName
            ]
        ]);

        return $query;
    }

    public function read(Request $request)
    {
        Checker::method('post');
        Reply::finish(true, 'Success', [USER_USERNAME => Auth::user()->{USER_USERNAME}, USER_EXPIRED_TIME => Auth::user()->{USER_EXPIRED_TIME}]);
    }
    
    public function update_pass(Request $request){

        Checker::method('post');

        $userPass = $request->input('new_pass', null);
        $oldPass = $request->input('old_pass', null);
        if(is_null($userPass) || is_null($oldPass)) Reply::finish(false, ERROR_UNDEFINE, ['data'=>'Password']);

        if($userPass == '') Reply::finish(false, 'New password can not be empty');
        
        if(hash('sha256', $oldPass) != Auth::user()->{USER_PASSWORD}) Reply::finish(false, 'Password is wrong');
    
        return $this->userModel->edit( [
            DATA_KEY => [[[USER_POD, '=', Auth::user()->{USER_POD}]]],
            DATA_EDITOR => [USER_PASSWORD => hash('sha256', $userPass)]
        ]);
    }
    
}
