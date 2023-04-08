<?php
namespace App\Http\Controllers\Admin;

use App\Helpers\Auth\Role;
use App\Helpers\Box\License;
use App\Helpers\DB\Models;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Request\Checker;
use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Helpers\Request\Query;
use Illuminate\Queue\RedisQueue;

class LabsController extends Controller  
{
    
    function __construct()
    {
        parent::__construct();
        $this->viewblade = 'reactjs.reactjs';
    }

    public function getDepends(Request $request){
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        // Check lab is exist and not encrpt and get all depend package
        $path = $request->input('path', '');
        if($path == '') Reply::finish(false, ERROR_UNDEFINE, ['data'=>'Lab path']);
        if(!is_file($path)) Reply::finish(false, 'Lab file is not exist');
        $fileContent = file_get_contents($path);
        if(substr($fileContent, 0, 5) != '<?xml') Reply::finish(false, 'You can not upload the lab not owned by you. Please choose another lab');
        $xml = simplexml_load_string($fileContent, 'SimpleXMLElement', LIBXML_PARSEHUGE);
        if (!$xml) Reply::finish(false, 'Lab is wrong format');

        $depends = [];
        $dependParsed = [];
        
        foreach ($xml -> xpath('//lab/topology/nodes/node') as $node_id => $node) {
            if (isset($node -> attributes() -> type) && isset($node -> attributes() -> image)){
                $type = (string) $node -> attributes() -> type;
                $image = (string) $node -> attributes() -> image;
                $tempID = $type.$image;
                if(isset($dependParsed[$tempID])) continue;
                $dependParsed[$tempID] = true;
                switch ($type) {
                    case 'iol':
                        $imagePath = '/opt/unetlab/addons/iol/bin/'. $image;
                        if(is_file($imagePath)){
                            $depends[] = $imagePath;
                        }
                        break;
                    case 'dynamips':
                        $imagePath = '/opt/unetlab/addons/dynamips/'. $image;
                        if(is_file($imagePath)){
                            $depends[] = $imagePath;
                        }
                        break;
                    case 'qemu':
                        $imagePath = '/opt/unetlab/addons/qemu/'. $image;
                        if(is_dir($imagePath)){
                            foreach (array_diff(scandir($imagePath), ['.', '..']) as $filename){
                                $file = secureCmd($imagePath.'/'.$filename);
                                $depends[] = $file;
                                if(preg_match('/^.+\.qcow2$/', $file)){
                                    $o = [];
                                    $result = exec('sudo qemu-img info --backing-chain '.$file.' | grep image', $o, $r);
                                    foreach($o as $key => $item){
                                        if(preg_match('/^image\:\s+(.+)$/', $item, $match)){
                                            if($key == 0) continue;
                                            if(!is_file($match[1])) continue;
                                            $depends[] = $match[1]; 
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    default:
                        break;
                }

            }
        }

        $depends = array_unique($depends);

        Reply::finish(true, 'Success', $depends);

    }

   

    public function view() 
    {
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        return view($this->viewblade);
    }

    
    public function create() 
    {
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        return view($this->viewblade);
    }
    
    public function editview() 
    {
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        return view($this->viewblade);
    }

    public function store(Request $request) 
    {

        $relicense = $request->input('relicense', false);
        if($relicense) License::relicense(false, Auth::user());

        if(!Role::checkRoot()) return redirect('/');
        return view($this->viewblade);
    }
    
    public function workbook() 
    {
        return view($this->viewblade);
    }

    public function workbookview() 
    {
        return view($this->viewblade);
    }

    public function terminal() 
    {
        return view($this->viewblade);
    }
    
    public function uploader(Request $request){
        /*
         * Upload lab_image
         */
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $action = $request->input('action', '');
        if($action == '') Reply::finish(false, ERROR_UNDEFINE, ['data' => 'Action']);
        switch ($action) {
    
            case 'Upload':{
                
                $data = $request->all();
                $result = Query::center(APP_CENTER.'/api/boxs/labs/uploader', 'post', $data, ['dataType'=>'']);
                return $result;
                
            }
    
            case 'Read':{
                $data = $request->all();
                $result = Query::center(APP_CENTER.'/api/boxs/labs/uploader', 'post', $data, ['continue'=>true]);
                $res = response($result)->header('Content-Type', curl_getinfo(Query::$ch, CURLINFO_CONTENT_TYPE ));
                curl_close(Query::$ch);
                
                return $res;
            }
    
            case 'Delete':{
                $data = $request->all();
                return Query::center(APP_CENTER.'/api/boxs/labs/uploader', 'post', $data, ['dataType'=>'']);
            }
    
            case 'History':{
                $data = $request->all();
                $result = Query::center(APP_CENTER.'/api/boxs/labs/uploader', 'post', $data, ['dataType'=>'']);
                return $result;
            }
            
    
            default:
                Reply::finish(false, 'Error', 'No Permission');
                break;
        }
    
    }


    public function addGetId(Request $request){
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $data = $request->all();
        $result = Query::center(APP_CENTER.'/api/boxs/labs/addGetId', 'post', $data, ['dataType'=>'']);
        return $result;
    }


    public function getOwnLabs(){
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $result = Query::center(APP_CENTER.'/api/boxs/labs/getOwnLabs', 'post', [], ['dataType'=>'']);
        return $result;
    }

    public function drop(Request $request){
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $data = $request->all();
        $result = Query::center(APP_CENTER.'/api/boxs/labs/drop', 'post',  $data, ['dataType'=>'']);
        return $result;
    }

    public function edit(Request $request){
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $data = $request->all();
        $result = Query::center(APP_CENTER.'/api/boxs/labs/edit', 'post',  $data, ['dataType'=>'']);
        return $result;
    }

    public function read(Request $request){
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $data = $request->all();
        $result = Query::center(APP_CENTER.'/api/boxs/labs/read', 'post',  $data, ['dataType'=>'']);
        return $result;
    }

    public function mapping(Request $request){
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $data = $request->all();
        $result = Query::center(APP_CENTER.'/api/boxs/labs/mapping', 'post',  $data, ['dataType'=>'']);
        return $result;
    }

    public function public(Request $request){
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $data = $request->all();
        $result = Query::center(APP_CENTER.'/api/boxs/labs/public', 'post',  $data, ['dataType'=>'']);
        return $result;
    }

    public function unpublic(Request $request){
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $data = $request->all();
        $result = Query::center(APP_CENTER.'/api/boxs/labs/unpublic', 'post',  $data, ['dataType'=>'']);
        return $result;
    }

    public function sellable(Request $request){
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $data = $request->all();
        $result = Query::center(APP_CENTER.'/api/boxs/labs/sellable', 'post',  $data, ['dataType'=>'']);
        return $result;
    }

    public function getUserAgreement(Request $request){
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $data = $request->all();
        $result = Query::center(APP_CENTER.'/api/boxs/labs/userAgreement', 'post',  $data, ['dataType'=>'']);
        return $result;
    }

    public function search(Request $request){

        $workspace = Role::getWorkspace();
        $search = strtolower($request->input('search', ''));
        $labs = \scanDirFiles(BASE_LAB.$workspace);

        $labs = array_map(function($item){
            return str_replace_first(BASE_LAB, '', $item);
        }, $labs);

        if($search != ''){
            $labs = array_filter($labs, function($item)use($search){
                if(strpos(strtolower($item), $search) !== false){
                    return true;
                }else{
                    return false;
                }
            });
            $labs = array_values($labs);
        }
        Reply::finish(true, 'success', $labs);
    }

   

    
    
}
