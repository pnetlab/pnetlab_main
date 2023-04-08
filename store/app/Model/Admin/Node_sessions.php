<?php

namespace App\Model\Admin;

use Illuminate\Support\Facades\DB;

use App\Model\Model_basic;
use App\Helpers\Request\Reply;


class Node_sessions extends Model_basic
{
    function __construct()
    {

        parent::__construct();

        $this->struct = array(
            NODE_SESSION_ID => [
                PROP_NAME => NODE_SESSION_ID,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],
            NODE_SESSION_LAB => [
                PROP_NAME => NODE_SESSION_LAB,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],
            NODE_SESSION_PORT => [
                PROP_NAME => NODE_SESSION_PORT,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],

            NODE_SESSION_NID => [
                PROP_NAME => NODE_SESSION_NID,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],

            NODE_SESSION_TYPE => [
                PROP_NAME => NODE_SESSION_TYPE,
                PROP_NULL => true,
                PROP_REGEX => "Varchar",
            ],

            NODE_SESSION_WORKSPACE => [
                PROP_NAME => NODE_SESSION_WORKSPACE,
                PROP_NULL => true,
                PROP_REGEX => "Varchar",
            ],
            NODE_SESSION_RUNNING => [
                PROP_NAME => NODE_SESSION_RUNNING,
                PROP_NULL => true,
                PROP_REGEX => "Pass",
            ],
            NODE_SESSION_CPU => [
                PROP_NAME => NODE_SESSION_CPU,
                PROP_NULL => true,
                PROP_REGEX => "Pass",
            ],
            NODE_SESSION_RAM => [
                PROP_NAME => NODE_SESSION_RAM,
                PROP_NULL => true,
                PROP_REGEX => "Pass",
            ],
            NODE_SESSION_HDD => [
                PROP_NAME => NODE_SESSION_HDD,
                PROP_NULL => true,
                PROP_REGEX => "Pass",
            ],
            NODE_SESSION_POD => [
                PROP_NAME => NODE_SESSION_POD,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],
            NODE_SESSION_IOL => [
                PROP_NAME => NODE_SESSION_IOL,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],

        );

        $this->query_builder = DB::table(NODE_SESSIONS_TABLE);
        $this->id = NODE_SESSION_ID;
        $this->name = NODE_SESSIONS_TABLE;
        $this->uploader = APP_UPLOAD;

        $this->registerSql = [
            //['Auth/MapUG', AUTHEN_ID, MAP_UG_PEOPLEID, null, null, 'cascade', null],
        ];

        $this->registerDepend = [
            //['Auth/MapUG', AUTHEN_NAME, MAP_UG_PEOPLENAME, AUTHEN_ID, MAP_UG_PEOPLEID],

        ];
    }
}
