<?php
namespace App\Http\Controllers\Admin;

use App\Helpers\Auth\Role;
use App\Helpers\Control\Ctrl;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Request\Checker;
use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Auth;
use App\Helpers\Uploader\FileFunc;
use App\Helpers\DB\Models;


class Lab_sessionsController extends Controller  
{

    function __construct()
    {
        parent::__construct();
        $this->mainModel = Models::get('Admin/Lab_sessions');
        $this->viewblade = 'reactjs.reactjs';
        
        $this->dependCols = array_unique(array_column($this->mainModel->registerDepend, 1, 1));
        $this->dependCols[LAB_SESSION_ID] = true;
        
    }


    public function read(Request $request)
    {
        Checker::method('post');
        $lab_session = Auth::user()->{USER_LAB_SESSION};
        if($lab_session == '') Reply::finish(false, ERROR_UNDEFINE, ['data'=>'Lab Session']);
        $result = $this->mainModel->read([[[LAB_SESSION_ID, '=', $lab_session]]]);
        if(!$result['data'] || !isset($result['data'][0])) Reply::finish(false, ERROR_UNDEFINE, ['data'=>'Lab Session']);
        return Reply::finish(true, 'success', $result['data'][0]);
    }

    public function filter(Request $request)
    {
        Checker::method('post');
        $datas = $request->input('data', array());
        
        $datas[FLAG_FILTER_LOGIC] = 'and';

        if(Role::checkRoot()){
            $workspace = '/';
            $shareds = [];
        }else{
            $workspace = Role::getWorkspace();
            
            if($workspace[-1] != '/') $workspace .= '/';
            $shareds = Ctrl::get(CTRL_SHARED, [], true);
            
            $shareds = array_map(function($item){
                $item = preg_replace('/' . preg_quote(BASE_LAB, '/') . '/', '', $item, 1);
                if($item[-1] != '/') $item .= '/';
                return $item;
            }, $shareds);
            
        }
        
        $responseData = $this->mainModel->filter($datas, function($db) use($workspace, $shareds){
            if($workspace != '/'){
                $db->where(function($db) use($workspace, $shareds){
                    $db -> orWhere(LAB_SESSION_PATH, 'like', $workspace.'%');
                    foreach($shareds as $shared){
                        if($shared != '' && $shared != null) $db -> orWhere(LAB_SESSION_PATH, 'like', $shared.'%');
                    }
                });
            }
        });
        
        if(!$responseData['result']) Reply::finish($responseData);
        
        return $responseData;
    }

    public function mapUser(){
        $users = Models::get('Admin/Users')->read([], null, false, [USER_POD, USER_USERNAME, USER_EMAIL, USER_ONLINE_TIME, USER_OFFLINE]);
        if(!$users['result']) return $users;
        $users['data'] = $users['data']->mapWithKeys(function ($item){
            return [$item->{USER_POD} => $item];
        });
        return $users;
    }

    public function count(){
        if(Role::checkRoot()){
            $workspace = '/';
            $shareds = [];
        }else{
            $workspace = Role::getWorkspace();
            if($workspace[-1] != '/') $workspace .= '/';

            $shareds = Ctrl::get(CTRL_SHARED, [], true);
            $shareds = array_map(function($item){
                $item = preg_replace('/' . preg_quote(BASE_LAB, '/') . '/', '', $item, 1);
                if($item[-1] != '/') $item .= '/';
                return $item;
            }, $shareds);
        }
        return $this->mainModel->count(null, function($db) use($workspace, $shareds){
            if($workspace != '/'){
                $db->where(function($db) use($workspace, $shareds){
                    $db -> orWhere(LAB_SESSION_PATH, 'like', $workspace.'%');
                    foreach($shareds as $shared){
                        if($shared != '' && $shared != null) $db -> orWhere(LAB_SESSION_PATH, 'like', $shared.'%');
                    }
                });
            }
        });
    }

    public function getSession(){
        return Reply::finish(true, 'success', Auth::user()->{USER_LAB_SESSION});
    }
    

    public function view() 
    {
        return view($this->viewblade);
    }
    
}