<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Request\Checker;
use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Auth;


class ControllerController extends Controller  
{

    function __construct()
    {
        parent::__construct();
        $this->mainModel = $this->models->getModel('Admin/Controller');
        $this->viewblade = 'reactjs.reactjs';
        
        $this->mainModel->loadDepend();
        $this->dependCols = array_unique(array_column($this->mainModel->registerDepend, 1, 1));
        die;
    }

    public function add(Request $request)
    {
        $datas = $request->input('data', array());
        foreach ($datas as $key=>$val){
            $datas[$key] = array_diff_key($datas[$key], $this->dependCols);
        }
        Reply::finish($this->mainModel->add($datas)); 
    }

    public function drop(Request $request)
    {
        $datas = $request->input('data', array()); 
        foreach ($datas as $key=>$data){
            $datas[$key] =  $this->mainModel->keyToCondition($data);
        }
        
        $dropResult = $this->mainModel->drop($datas);
        Reply::finish($dropResult);
    }

    public function edit(Request $request)
    {
        $datas = $request->input('data', array());
        foreach ($datas[DATA_KEY] as $key=>$data){
            $datas[DATA_KEY][$key] =  $this->mainModel->keyToCondition($data);
        }
        $datas[DATA_EDITOR] = array_diff_key($datas[DATA_EDITOR], $this->dependCols);
        $editResult = $this->mainModel->edit($datas);
        Reply::finish($editResult);
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

    public function suggest(Request $request)
    {
        $datas = $request->input('search', '');
        $suggestData = $this->mainModel->read([[[CTRL_VALUE, 'contain', $datas]]], function($builder){$builder->limit(20);});
        $suggest = [];
        if($suggestData['result']){
             
            $suggest = $suggestData['data']->mapWithKeys(function ($item){
                return [$item->{CTRL_KEY} => $item->{CTRL_VALUE}];
            });
        }
        Reply::finish(true, '', $suggest);
    }
    
    public function mapping(){
        $mapData = [];
        //$mapData[CUS_PRO] = $this->getMapData(null, $this->models->getModel('Admin/Projects'), null, PRO_NAME, PRO_NAME);
        Reply::finish(true, 'Success', $mapData);
    }

    public function filter(Request $request)
    {
        $datas = $request->input('data', array());
        
        $datas[FLAG_FILTER_LOGIC] = 'and';
        
        $responseData = $this->mainModel->filter($datas);
        
        if(!$responseData['result']) Reply::finish($responseData);
        
        Reply::finish($responseData);
    }

    public function view() 
    {
        return view($this->viewblade);
    }
    
}
