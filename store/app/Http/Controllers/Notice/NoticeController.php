<?php
namespace App\Http\Controllers\Notice;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Request\Checker;
use App\Helpers\Request\Query;
use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Auth;


class NoticeController extends Controller  
{

    function __construct()
    {
        parent::__construct();
        
    }

    public function edit(Request $request)
    {
        $data = $request->all();
        $result = Query::center(APP_CENTER.'/api/boxs/notice/edit', 'post', $data, ['dataType'=>'']);
        return $result;
    }

    public function read(Request $request)
    {
        $data = $request->all();
        $result = Query::center(APP_CENTER.'/api/boxs/notice/read', 'post', $data, ['dataType'=>'']);
        return $result;
    }

    public function read_more(Request $request){
        $data = $request->all();
        $result = Query::center(APP_CENTER.'/api/boxs/notice/read_more', 'post', $data, ['dataType'=>'']);
        return $result;
    }

    public function off_read_more(Request $request){
        $data = $request->all();
        $result = Query::boxCenter(APP_CENTER.'/api/offboxs/notice/read_more', $data, ['dataType'=>'']);
        return $result;
    }

    public function off_check(Request $request){
        $data = $request->all();
        $result = Query::boxCenter(APP_CENTER.'/api/offboxs/notice/check', $data, ['dataType'=>'']);
        return $result;
    }

    
}