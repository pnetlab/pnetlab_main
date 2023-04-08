<?php
namespace App\Http\Controllers\Admin;

use App\Helpers\Admin\Upgrade;
use App\Helpers\Box\License;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Request\Reply;
use Illuminate\Support\Facades\Auth;
use App\Helpers\View\JS;
use Illuminate\Support\Facades\Cookie;
use App\Helpers\Control\Ctrl;
use App\Helpers\DB\Models;
use Illuminate\Support\Facades\Response;

class MainController extends Controller  
{

    function __construct()
    {
        //Load intital variable to page that is not React
        parent::__construct();
        
    }
    
    public function view(Request $request){
        $relicense = $request->input('relicense', false);
        if($relicense) License::relicense(false, Auth::user());
        return view('main.main');
    }
}