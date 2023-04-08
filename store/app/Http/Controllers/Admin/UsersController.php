<?php
namespace App\Http\Controllers\Admin;

use App\Helpers\Admin\SystemHelper;
use App\Helpers\Auth\Role;
use App\Helpers\Box\License;
use App\Helpers\DB\Edge;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Request\Checker;
use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Auth;
use App\Helpers\Uploader\FileFunc;
use App\Helpers\DB\Models;
use App\Helpers\Request\Query;

class UsersController extends Controller  
{

    function __construct()
    {
        parent::__construct();
        $this->mainModel = Models::get('Admin/Users');
        $this->viewblade = 'reactjs.reactjs';
        
        $this->dependCols = array_unique(array_column($this->mainModel->registerDepend, 1, 1));
        $this->dependCols[USER_POD] = true;
       
        
    }

    public function filter(Request $request)
    {
        Checker::method('post');
        $datas = $request->input('data', array());
        
        $datas[FLAG_FILTER_LOGIC] = 'and';
        
        $responseData = $this->mainModel->filter($datas, null, false, [
            USER_USERNAME,
            USER_EMAIL,
            USER_SESSION,
            USER_IP,
            USER_ROLE,
            USER_FOLDER,
            USER_HTML5,
            USER_LICENSE,
            USER_ONLINE_TIME,
            USER_LAB_SESSION,
            USER_POD,
            USER_NOTE,
            USER_OFFLINE,
            USER_ACTIVE_TIME,
            USER_EXPIRED_TIME,
            USER_STATUS,
            USER_WORKSPACE,
            USER_MAX_NODE,
            USER_MAX_NODELAB,
        ]);
        
        if(!$responseData['result']) Reply::finish($responseData);
        
        return $responseData;
    }

    public function read(Request $request)
    {
        Checker::method('post');
        $datas = $request->input('data', array());
        foreach ($datas as $key=>$data){
            $datas[$key] =  $this->mainModel->keyToCondition($data);
        }

        $readResult = $this->mainModel->read($datas, function($db){
            $db->where(USER_OFFLINE, '=', 0);
        }, false, [
            USER_USERNAME,
            USER_EMAIL,
            USER_SESSION,
            USER_IP,
            USER_ROLE,
            USER_FOLDER,
            USER_HTML5,
            USER_LICENSE,
            USER_ONLINE_TIME,
            USER_LAB_SESSION,
            USER_POD,
            USER_NOTE,
            USER_OFFLINE,
            USER_ACTIVE_TIME,
            USER_EXPIRED_TIME,
            USER_STATUS,
            USER_WORKSPACE,
            USER_MAX_NODE,
            USER_MAX_NODELAB,
        ]);

        if(!$readResult['result']) return $readResult;
        $readResult = $readResult['data'];

        $rolesData = Models::get('Admin/User_roles')->read();
        if(!$rolesData['result']) return $rolesData;
        $rolesData = $rolesData['data'];
        $roles = [];
        foreach($rolesData as $role){
            $roles[$role->{USER_ROLE_ID}] = $role;
        };

        $totalDisk = SystemHelper::getTotalDisk();
        $totalDisk = round($totalDisk['total']/1024);

        foreach($readResult as $key => $data){
            if(!isset($roles[$data->{USER_ROLE}])) {
                $readResult[$key]->{'cpu_limit'} = 100 - 5;
                $readResult[$key]->{'ram_limit'} = 100 - 5;
                $readResult[$key]->{'hdd_limit'} = $totalDisk - 512;
            }else{
                $readResult[$key]->{'cpu_limit'} = get($roles[$data->{USER_ROLE}]->{USER_ROLE_CPU}, 100 - 5);
                if($readResult[$key]->{'cpu_limit'} > 95) $readResult[$key]->{'cpu_limit'} = 95;
                $readResult[$key]->{'ram_limit'} = get($roles[$data->{USER_ROLE}]->{USER_ROLE_RAM}, 100 - 5);
                if($readResult[$key]->{'ram_limit'} > 95) $readResult[$key]->{'ram_limit'} = 95;
                $readResult[$key]->{'hdd_limit'} = get($roles[$data->{USER_ROLE}]->{USER_ROLE_HDD}, $totalDisk - 512);
            }
        }
        return Reply::finish(true, 'success', $readResult);
    }

    public function suggest(Request $request)
    {
        Checker::method('post');
        $datas = $request->input('search', '');
        $suggestData = $this->mainModel->read([[[USER_EMAIL, 'contain', $datas]]], function($builder){$builder->limit(20);});
        $suggest = [];
        if($suggestData['result']){
             
            $suggest = $suggestData['data']->mapWithKeys(function ($item){
                return [$item->{USER_POD} => $item->{USER_EMAIL}];
            });
        }
        Reply::finish(true, '', $suggest);
    }
    
    public function mapping(Request $request){
        Checker::method('post');
        $mapData = [];
        $mapData[USER_ROLE] = Edge::mapping(Models::get('Admin/User_roles'), USER_ROLE, USER_ROLE_ID, USER_ROLE_NAME);
        $mapData[USER_ROLE]->{'0'} = 'Admin';
        $mapData[USER_STATUS] = ['0' => 'Block', '1' => 'Active'];
        $mapData[USER_OFFLINE] = ['0' => 'Online', '1' => 'Offline'];
        Reply::finish(true, 'Success', $mapData);
    }

   
    public function apply(Request $request){
        Checker::method('post');
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $data = $request->all();

        $data = get($data['data'], []);
        $addData = [];
        
        foreach($data as $account){
            if(isset($account[USER_OFFLINE]) && $account[USER_OFFLINE] == 1) continue;
            $addData[] = [
                MULTI_ACCESS_EMAIL => $account[USER_EMAIL],
                MULTI_ACCESS_NOTE => $account[USER_NOTE],
            ];
        } 

        $uuid = License::get_uuid();
        $ip = $_SERVER['SERVER_NAME'];

        $uploadData = [
            'uuid' => $uuid,
            'data' => $addData,
            'ip' => $ip,
        ];

        $result = Query::center(APP_CENTER.'/api/boxs/multi_access/apply', 'post',  $uploadData, ['dataType'=>'json']);
        
        if(!$result) Reply::finish(false, 'Apply multi access to server fail');
        if(!$result['result']) return $result;

        $returnData = $result['data'];

        $result = $this->mainModel->read([[[USER_OFFLINE, '=', '0']]]);
        if(!$result['result']) return $result;
        $result = $result['data'];
        $oldAccount = [];
       
        foreach($result as $account){
            $oldAccount[$account->{USER_EMAIL}] = $account;
        }

        $deleteAccount = $oldAccount;

        $addData = [];
        foreach($data as $account){

            if(isset($account[USER_WORKSPACE])){
                $wspace = str_replace('//', '/', $account[USER_WORKSPACE]);
                if($wspace == '/') $wspace = '';
                if($wspace[0] != '/') $wspace = '/'. $wspace;
                $account[USER_WORKSPACE] = $wspace;
            }

            if(isset($account[USER_ROLE]) && $account[USER_ROLE] == 0){
                $account[USER_STATUS] = USER_STATUS_ACTIVE;
                $account[USER_EXPIRED_TIME] = null;
                $account[USER_ACTIVE_TIME] = null;
                $account[USER_WORKSPACE] = null;
                $account[USER_MAX_NODE] = null;
                $account[USER_MAX_NODELAB] = null;
                
            }
            if(isset($oldAccount[$account[USER_EMAIL]])){
                unset($deleteAccount[$account[USER_EMAIL]]);
                $this->mainModel->edit([
                    DATA_KEY => [[ [USER_EMAIL, '=', $account[USER_EMAIL]] ]],
                    DATA_EDITOR => [
                        USER_ROLE => $account[USER_ROLE],
                        USER_NOTE => $account[USER_NOTE],
                        USER_ACTIVE_TIME => $account[USER_ACTIVE_TIME],
                        USER_EXPIRED_TIME => $account[USER_EXPIRED_TIME],
                        USER_STATUS => $account[USER_STATUS],
                        USER_WORKSPACE => $account[USER_WORKSPACE],
                    ],
                ]);
            }else{
                $addData[] = $account;
            }
        }
        if(count($deleteAccount) > 0){
           
            $result = $this->mainModel->drop('All', function($db)use($deleteAccount){
                $db->whereIn(USER_EMAIL, array_keys($deleteAccount));
            });

            if(!$result['result']) return $result;
        }
        if(count($addData) > 0){
            $result = $this->mainModel->add($addData);
            if(!$result['result']) return $result;
        }


        Reply::finish(true, 'success', $returnData);
    }

    public function getLimit(){
        $result = Query::center(APP_CENTER.'/api/boxs/multi_access/getLimit', 'post', null, ['dataType'=>'json']);
        if(!$result) Reply::finish(false, 'Can not get information, check your internet');
        if(!$result['result']) return $result;
        return Reply::finish(true, 'success', [
            'limit'=> $result['data'],
            'UUID' => License::get_uuid(),
        ]);
    }

    public function view() 
    {
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        return view($this->viewblade);
    }



    //===================OFFLINE API ========================================

    public function offAdd(Request $request)
    {
        Checker::method('post');
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $datas = $request->input('data', array());
        $datas = array_values($datas);
        if(!isset($datas[0])) Reply::finish(false, 'Data is empty');
        $data = $datas[0];
        $count = $this->mainModel->count();
        $count = $count['data'];

        if(isset($data[USER_ROLE]) && $data[USER_ROLE] == 0){
            $data[USER_STATUS] = USER_STATUS_ACTIVE;
            $data[USER_EXPIRED_TIME] = null;
            $data[USER_ACTIVE_TIME] = null;
            $data[USER_WORKSPACE] = null;
            $data[USER_MAX_NODE] = null;
            $data[USER_MAX_NODELAB] = null;
        }

        if(isset($data[USER_WORKSPACE])){
            $wspace = str_replace('//', '/', $data[USER_WORKSPACE]);
            if($wspace == '/') $wspace = '';
            if($wspace[0] != '/') $wspace = '/'. $wspace;
            $data[USER_WORKSPACE] = $wspace;
        }

        if(isset($data[USER_PASSWORD])){
            $data[USER_PASSWORD] = hash('sha256', $data[USER_PASSWORD]);
        }else{
            Reply::finish(false, 'Password can not be empty');
        }

        if(isset($data[USER_USERNAME]) && $data[USER_USERNAME] != ''){
            if($this->mainModel->is_exist([[[USER_USERNAME, '=', $data[USER_USERNAME] ]]])){
                Reply::finish(false, 'This Username is already exists');
            }
        }else{
            Reply::finish(false, 'Username can not be empty');
        }

        $data[USER_OFFLINE] = '1';

        $addResult = $this->mainModel->add([$data]); 
        return $addResult;
    }

    public function offDrop(Request $request)
    {
        Checker::method('post');
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $datas = $request->input('data', array()); 
        foreach ($datas as $key=>$data){
            $datas[$key] =  $this->mainModel->keyToCondition($data);
        }
        
        $dropResult = $this->mainModel->drop($datas);
        return $dropResult;
    }

    public function offEdit(Request $request)
    {
        Checker::method('post');
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $datas = $request->input('data', array());
        foreach ($datas[DATA_KEY] as $key=>$data){
            $datas[DATA_KEY][$key] =  $this->mainModel->keyToCondition($data);
        }

        $datas[DATA_EDITOR] = array_diff_key($datas[DATA_EDITOR], $this->dependCols);

        if(isset($datas[DATA_EDITOR][USER_WORKSPACE])){
            $wspace = str_replace('//', '/', $datas[DATA_EDITOR][USER_WORKSPACE]);
            if($wspace == '/') $wspace = '';
            if($wspace[0] != '/') $wspace = '/'. $wspace;
            $datas[DATA_EDITOR][USER_WORKSPACE] = $wspace;
        }

        if(isset($datas[DATA_EDITOR][USER_USERNAME])){
            $editData = $this->mainModel->read($datas[DATA_KEY]);
            if(!$editData['result']) return $editData;
            if(count($editData['data']) != 1) Reply::finish(false, 'Select only one user to edit');
            $editData = $editData['data'][0];
            if($editData->{USER_USERNAME} != $datas[DATA_EDITOR][USER_USERNAME]){
                if($this->mainModel->is_exist([[ [USER_USERNAME, '=', $datas[DATA_EDITOR][USER_USERNAME]] ]])) Reply::finish(false, ERROR_DUPLICATE, ['data' => USER_USERNAME]);
            }
        }

        if(isset($datas[DATA_EDITOR][USER_ROLE]) && $datas[DATA_EDITOR][USER_ROLE] == 0){
            $datas[DATA_EDITOR][USER_STATUS] = USER_STATUS_ACTIVE;
            $datas[DATA_EDITOR][USER_EXPIRED_TIME] = null;
            $datas[DATA_EDITOR][USER_ACTIVE_TIME] = null;
            $datas[DATA_EDITOR][USER_WORKSPACE] = null;
            $datas[DATA_EDITOR][USER_MAX_NODE] = null;
            $datas[DATA_EDITOR][USER_MAX_NODELAB] = null;
        }

        if(isset($datas[DATA_EDITOR][USER_PASSWORD]) && $datas[DATA_EDITOR][USER_PASSWORD] != ''){
            $datas[DATA_EDITOR][USER_PASSWORD] = hash('sha256', $datas[DATA_EDITOR][USER_PASSWORD]);
        }else{
            unset($datas[DATA_EDITOR][USER_PASSWORD]);
        }
        $editResult = $this->mainModel->edit($datas);
        return $editResult;
    }

    public function offFilter(Request $request)
    {
        Checker::method('post');
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $datas = $request->input('data', array());
        
        $datas[FLAG_FILTER_LOGIC] = 'and';
        
        $responseData = $this->mainModel->filter($datas, null, true, [
            USER_USERNAME,
            USER_EMAIL,
            USER_SESSION,
            USER_IP,
            USER_ROLE,
            USER_FOLDER,
            USER_HTML5,
            USER_LICENSE,
            USER_ONLINE_TIME,
            USER_LAB_SESSION,
            USER_POD,
            USER_NOTE,
            USER_OFFLINE,
            USER_ACTIVE_TIME,
            USER_EXPIRED_TIME,
            USER_STATUS,
            USER_WORKSPACE,
            USER_MAX_NODE,
            USER_MAX_NODELAB,
        ]);
        
        if(!$responseData['result']) Reply::finish($responseData);

        $readResult = $responseData['data'][DATA_TABLE];
    
        $rolesData = Models::get('Admin/User_roles')->read();
        if(!$rolesData['result']) return $rolesData;
        $rolesData = $rolesData['data'];
        $roles = [];
        foreach($rolesData as $role){
            $roles[$role->{USER_ROLE_ID}] = $role;
        };

        $totalDisk = SystemHelper::getTotalDisk();
        $totalDisk = round($totalDisk['total']/1024);

        foreach($readResult as $key => $data){
            if(!isset($roles[$data->{USER_ROLE}])) {
                $readResult[$key]->{'cpu_limit'} = 100 - 5;
                $readResult[$key]->{'ram_limit'} = 100 - 5;
                $readResult[$key]->{'hdd_limit'} = $totalDisk - 512;
            }else{
                $readResult[$key]->{'cpu_limit'} = get($roles[$data->{USER_ROLE}]->{USER_ROLE_CPU}, 100 - 5);
                if($readResult[$key]->{'cpu_limit'} > 95) $readResult[$key]->{'cpu_limit'} = 95;
                $readResult[$key]->{'ram_limit'} = get($roles[$data->{USER_ROLE}]->{USER_ROLE_RAM}, 100 - 5);
                if($readResult[$key]->{'ram_limit'} > 95) $readResult[$key]->{'ram_limit'} = 95;
                $readResult[$key]->{'hdd_limit'} = get($roles[$data->{USER_ROLE}]->{USER_ROLE_HDD}, $totalDisk - 512);
            }
        }

        $responseData['data'][DATA_TABLE] = $readResult;

        return $responseData;
    }
    

    public function getOffLimit(){
        Checker::method('post');
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        return Reply::finish(true, 'success', [
            'limit'=> "Unlimit",
            'UUID' => License::get_uuid(),
        ]);
    }

    public function getKeys(Request $request){
        Checker::method('post');
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $data = $request->all();
        $result = Query::boxCenter(APP_CENTER.'/api/offboxs/malicense/getKeys', $data, ['dataType'=>'']);
        return $result;
    }

    public function activeKey(Request $request){
        Checker::method('post');
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $data = $request->all();
        $result = Query::boxCenter(APP_CENTER.'/api/offboxs/malicense/active', $data, ['dataType'=>'json']);
        if(!$result) Reply::finish(false, 'Can not connect to server');
        if($result['result']){
            License::keepalive();
        }
        return $result;
    }

    public function deleteKey(Request $request){
        Checker::method('post');
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $data = $request->all();
        $result = Query::boxCenter(APP_CENTER.'/api/offboxs/malicense/delete', $data, ['dataType'=>'json']);
        if(!$result) Reply::finish(false, 'Can not connect to server');
        if($result['result']){
            License::keepalive();
        } 
        return $result;
    }

    public function offline() 
    {
        return view($this->viewblade);
    }
    
}