<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\Auth\Role;
use App\Helpers\Control\Ctrl;
use App\Helpers\Request\Checker;
use App\Helpers\Request\Query;
use App\Helpers\Request\Reply;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;

class SyncController extends Controller
{

    function __construct()
    {
        //Load intital variable to page that is not React
        parent::__construct();
        $this->viewblade = 'reactjs.reactjs';
    }

    public function view()
    {
        return view($this->viewblade);
    }

}