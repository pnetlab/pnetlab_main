<?php
namespace App\Http\Controllers\Admin;

use App\Helpers\Admin\Upgrade;
use App\Helpers\Auth\Role;
use App\Helpers\Box\License;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Auth;
use App\Helpers\View\JS;
use Illuminate\Support\Facades\Cookie;
use App\Helpers\Control\Ctrl;
use App\Helpers\DB\Models;
use App\Helpers\Request\Checker;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class ImageController extends Controller  
{

    function __construct()
    {
        //Load intital variable to page that is not React
        parent::__construct();
        $this->folder = '/opt/unetlab/html/images/icons';
        
    }
    
    public function scan(){
        Checker::method('post');
        $images = scanDirFiles($this->folder);
        $images = array_map(function($item){return basename($item);}, $images);
        Reply::finish(true, 'success', $images);
    }

    public function delete(Request $request){
        Checker::method('post');
        if(!Role::checkRoot()) Reply::finish(false, ERROR_PERMISSION);
        $image = $request->input('file', null);
        if($image == null) Reply::finish(false, ERROR_UNDEFINE, ['data'=>'Image']);
        try {
            $image = basename($image);
            unlink($this->folder.'/'.$image);
        } catch (\Exception $e) {
            Reply::finish(false, $e->getMessage());
        }
        Reply::finish(true, 'success', '');
    }

    public function upload(Request $request){
        
        $files = $request->file('files', null);
        if($files == null) Reply::finish(false, 'No file');

        if(count($files) >= (int)ini_get('max_file_uploads')) Reply::finish(false, 'error_uploadsize_limit', ['data'=>ini_get('max_file_uploads')]);

        $confirm = $request->input('confirm', 0);
        $overWritten = [];
        foreach($files as $file){
            $validator = Validator::make(['file'=>$file], ['file'=>'required|image']);
            if ($validator->fails()) {
                return Reply::make(false, 'You can only upload image');
            }
            $basename = basename($file->getClientOriginalName());
            if(is_file($this->folder.'/'. $basename) ){
                $overWritten[$basename] = $basename;
            }
        }

        if($confirm == 0 && count($overWritten) > 0){
            Reply::finish(false, 'file_existed_alert', ['data'=> implode(', ', $overWritten), 'code'=>"confirm"]);
        }

     
        foreach($files as $file){
            $fileName = $this->folder.'/'.basename($file->getClientOriginalName());
            if(is_file($fileName)){
                if($confirm == -1){
                    continue;
                }else{
                    unlink($fileName);
                }
            }

            move_uploaded_file($file->getPathName(), $fileName );
        }

        Reply::finish(true, 'success', '');
    }

}