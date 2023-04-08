<?php
namespace App\Http\Controllers\Admin;

use App\Helpers\Auth\Role;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Request\Checker;
use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Auth;
use App\Helpers\Uploader\FileFunc;
use App\Helpers\DB\Models;


class User_rolesController extends Controller  
{

    function __construct()
    {
        parent::__construct();
        $this->mainModel = Models::get('Admin/User_roles');
        $this->viewblade = 'reactjs.reactjs';
        
        $this->dependCols = array_unique(array_column($this->mainModel->registerDepend, 1, 1));
        $this->dependCols[USER_ROLE_ID] = true;

        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        
    }

    public function add(Request $request)
    {
        Checker::method('post');
        $datas = $request->input('data', array());
        if(!isset($datas[0])) Reply::finish(false, 'ERROR', ['data'=>'No data']);
        $data = $datas[0];
        if( strtolower($data[USER_ROLE_NAME]) == 'admin') Reply::finish(false, 'ERROR', ['data'=>'Admin is the default role with full permission. You can not add this role']);
        if($this->mainModel->is_exist([[ [USER_ROLE_NAME, '=', $data[USER_ROLE_NAME]] ]])) Reply::finish(false, ERROR_DUPLICATE, ['data'=>USER_ROLE_NAME]);
        $data = array_diff_key($data, $this->dependCols);

        if(isset($data[USER_ROLE_WORKSPACE])){
            $wspace = str_replace('//', '/', $data[USER_ROLE_WORKSPACE]);
            if($wspace == '') $wspace = '/';
            if($wspace[0] != '/') $wspace = '/'. $wspace;
            $data[USER_ROLE_WORKSPACE] = $wspace;
        }
        
        $addResult = $this->mainModel->add([$data]); 
        if(!$addResult['result']) return $addResult;

        $roleData = $this->mainModel->read([[[ USER_ROLE_NAME, '=', $data[USER_ROLE_NAME] ]]]);
        if(!$roleData['result'] || !isset($roleData['data'][0])) return Reply::finish(false, 'ERROR', 'Add Role Failed');

        Reply::finish(true, 'success', $roleData['data'][0]);
    }

    public function addPermissions(Request $request)
    {
        $model = Models::get('Admin/User_permission');
        Checker::method('post');
        $roleId = $request->input(USER_ROLE_ID, null);
        if($roleId == null) Reply::finish(false, ERROR_UNDEFINE, ['data'=>USER_ROLE_ID]);

        $datas = $request->input('data', array());
        foreach ($datas as $key=>$data){
            $data[USER_PER_ROLE] = $roleId;
            $datas[$key] = array_diff_key($data, [USER_PER_ID=>true]);
        }
        $result = $model->drop([[[ USER_PER_ROLE, '=', $roleId ]]]);
        if(!$result['result']) return $result;

        $addResult = $model->add($datas); 
        return $addResult;
    }

    public function getRoleWithPermission(Request $request){
        $id = $request->input(USER_ROLE_ID, null);
        if($id == null) Reply::finish(false, ERROR_UNDEFINE, ['data'=>USER_ROLE_ID]);

        $role = $this->mainModel->read([[[ USER_ROLE_ID, '=', $id ]]]);
        if(!$role['result'] || !isset($role['data'][0])) Reply::finish(false, ERROR_UNDEFINE, ['data'=>USER_ROLE_ID]);
        $role = $role['data'][0];

        $model = Models::get('Admin/User_permission');
        $permissions = $model->read([[[ USER_PER_ROLE, '=', $role->{USER_ROLE_ID} ]]]);
        if(!$permissions['result']) return $permissions;

        $role->{USER_PERMISSION_TABLE} = $permissions['data'];

        Reply::finish(true, 'success', $role);

    }

    public function drop(Request $request)
    {
        Checker::method('post');
        $datas = $request->input('data', array()); 
        foreach ($datas as $key=>$data){
            $datas[$key] =  $this->mainModel->keyToCondition($data);
        }
        
        $dropResult = $this->mainModel->drop($datas);
        return $dropResult;
    }

    public function edit(Request $request)
    {
        Checker::method('post');
        $datas = $request->input('data', array());
        foreach ($datas[DATA_KEY] as $key=>$data){
            $datas[DATA_KEY][$key] =  $this->mainModel->keyToCondition($data);
        }
        $datas[DATA_EDITOR] = array_diff_key($datas[DATA_EDITOR], $this->dependCols);

        if(isset($datas[DATA_EDITOR][USER_ROLE_WORKSPACE])){
            $wspace = str_replace('//', '/', $datas[DATA_EDITOR][USER_ROLE_WORKSPACE]);
            if($wspace == '') $wspace = '/';
            if($wspace[0] != '/') $wspace = '/'. $wspace;
            $datas[DATA_EDITOR][USER_ROLE_WORKSPACE] = $wspace;
        }

        $editResult = $this->mainModel->edit($datas);
        return $editResult;
    }

    public function read(Request $request)
    {
        Checker::method('post');
        $datas = $request->input('data', array());
        foreach ($datas as $key=>$data){
            $datas[$key] =  $this->mainModel->keyToCondition($data);
        }
        $readResult = $this->mainModel->read($datas);
        return $readResult;
    }

    public function suggest(Request $request)
    {
        Checker::method('post');
        $datas = $request->input('search', '');
        $suggestData = $this->mainModel->read([[[USER_ROLE_NAME, 'contain', $datas]]], function($builder){$builder->limit(20);});
        $suggest = [];
        if($suggestData['result']){
             
            $suggest = $suggestData['data']->mapWithKeys(function ($item){
                return [$item->{USER_ROLE_ID} => $item->{USER_ROLE_NAME}];
            });
        }
        Reply::finish(true, '', $suggest);
    }
    
    public function mapping(Request $request){
        Checker::method('post');
        $mapData = [];
        //$mapData[CUS_PRO] = $this->getMapData(null, $this->models->getModel('Admin/Projects'), null, PRO_NAME, PRO_NAME);
        Reply::finish(true, 'Success', $mapData);
    }

    public function filter(Request $request)
    {
        Checker::method('post');
        $datas = $request->input('data', array());
        
        $datas[FLAG_FILTER_LOGIC] = 'and';
        
        $responseData = $this->mainModel->filter($datas);
        
        if(!$responseData['result']) Reply::finish($responseData);
        
        return $responseData;
    }
    
    //
    
    //

    public function view() 
    {
        return view($this->viewblade);
    }
    
}