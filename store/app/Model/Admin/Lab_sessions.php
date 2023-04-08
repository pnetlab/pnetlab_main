<?php

namespace App\Model\Admin;

use Illuminate\Support\Facades\DB;

use App\Model\Model_basic;
use App\Helpers\Request\Reply;


class Lab_sessions extends Model_basic
{
    function __construct()
    {

        parent::__construct();

        $this->struct = array(
            LAB_SESSION_ID => [
                PROP_NAME => LAB_SESSION_ID,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],
            LAB_SESSION_LID => [
                PROP_NAME => LAB_SESSION_LID,
                PROP_NULL => true,
                PROP_REGEX => "Varchar",
            ],
            LAB_SESSION_POD => [
                PROP_NAME => LAB_SESSION_POD,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],
            LAB_SESSION_JOINED => [
                PROP_NAME => LAB_SESSION_JOINED,
                PROP_NULL => true,
                PROP_REGEX => "Varchar",
            ],
            LAB_SESSION_PATH => [
                PROP_NAME => LAB_SESSION_PATH,
                PROP_NULL => true,
                PROP_REGEX => "Varchar",
            ],
            LAB_SESSION_RUNNING => [
                PROP_NAME => LAB_SESSION_RUNNING,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],

        );

        $this->query_builder = DB::table(LAB_SESSIONS_TABLE);
        $this->id = LAB_SESSION_ID;
        $this->name = LAB_SESSIONS_TABLE;
        $this->uploader = APP_UPLOAD;

        $this->registerSql = [
            //['Auth/MapUG', AUTHEN_ID, MAP_UG_PEOPLEID, null, null, 'cascade', null],
        ];

        $this->registerDepend = [
            //['Auth/MapUG', AUTHEN_NAME, MAP_UG_PEOPLENAME, AUTHEN_ID, MAP_UG_PEOPLEID],

        ];
    }
}
