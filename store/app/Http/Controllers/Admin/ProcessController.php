<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Request\Checker;
use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Auth;


class ProcessController extends Controller  
{

    function __construct()
    {
        parent::__construct();
        $this->mainModel = $this->models->getModel('Admin/Process');
        $this->viewblade = 'reactjs.reactjs';
        
        $this->mainModel->loadDepend();
        $this->dependCols = array_unique(array_column($this->mainModel->registerDepend, 1, 1));
        $this->dependCols[PROCESS_ID] = true;
        
    }

   
    public function read(Request $request)
    {
        $datas = $request->input('data', array());
        foreach ($datas as $key=>$data){
            $datas[$key] =  $this->mainModel->keyToCondition($data);
        }
        $readResult = $this->mainModel->read($datas);
        Reply::finish($readResult);
    }
    
}