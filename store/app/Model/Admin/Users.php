<?php

namespace App\Model\Admin;

use App\Helpers\DB\Models;
use Illuminate\Support\Facades\DB;

use App\Model\Model_basic;
use App\Helpers\Request\Reply;


class Users extends Model_basic
{
    function __construct()
    {

        parent::__construct();

        $this->struct = array(
            USER_USERNAME => [
                PROP_NAME => USER_USERNAME,
                PROP_NULL => true,
                PROP_REGEX => "Varchar",
            ],
            USER_COOKIE => [
                PROP_NAME => USER_COOKIE,
                PROP_NULL => true,
                PROP_REGEX => "Varchar",
            ],
            USER_EMAIL => [
                PROP_NAME => USER_EMAIL,
                PROP_NULL => true,
                PROP_REGEX => "Varchar",
            ],
            USER_EXPIRATION => [
                PROP_NAME => USER_EXPIRATION,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],
            USER_NAME => [
                PROP_NAME => USER_NAME,
                PROP_NULL => true,
                PROP_REGEX => "Varchar",
            ],
            USER_PASSWORD => [
                PROP_NAME => USER_PASSWORD,
                PROP_NULL => true,
                PROP_REGEX => "Varchar",
            ],
            USER_SESSION => [
                PROP_NAME => USER_SESSION,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],
            USER_IP => [
                PROP_NAME => USER_IP,
                PROP_NULL => true,
                PROP_REGEX => "Varchar",
            ],
            USER_ROLE => [
                PROP_NAME => USER_ROLE,
                PROP_NULL => true,
                PROP_REGEX => "Varchar",
            ],
            USER_FOLDER => [
                PROP_NAME => USER_FOLDER,
                PROP_NULL => true,
                PROP_REGEX => "Varchar",
            ],
            USER_HTML5 => [
                PROP_NAME => USER_HTML5,
                PROP_NULL => true,
                PROP_REGEX => "Varchar",
            ],
            USER_LICENSE => [
                PROP_NAME => USER_LICENSE,
                PROP_NULL => true,
                PROP_REGEX => "Varchar",
            ],
            USER_ONLINE_TIME => [
                PROP_NAME => USER_ONLINE_TIME,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],
            USER_LAB_SESSION => [
                PROP_NAME => USER_LAB_SESSION,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],
            USER_POD => [
                PROP_NAME => USER_POD,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],
            USER_NOTE => [
                PROP_NAME => USER_NOTE,
                PROP_NULL => true,
                PROP_REGEX => "Pass",
            ],
            USER_OFFLINE => [
                PROP_NAME => USER_OFFLINE,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],
            USER_ACTIVE_TIME => [
                PROP_NAME => USER_ACTIVE_TIME,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],
            USER_EXPIRED_TIME => [
                PROP_NAME => USER_EXPIRED_TIME,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],

            USER_STATUS => [
                PROP_NAME => USER_STATUS,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],

            USER_WORKSPACE => [
                PROP_NAME => USER_WORKSPACE,
                PROP_NULL => true,
                PROP_REGEX => "Pass",
            ],

            USER_MAX_NODE => [
                PROP_NAME => USER_MAX_NODE,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],

            USER_MAX_NODELAB => [
                PROP_NAME => USER_MAX_NODELAB,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],

        );

        $this->query_builder = DB::table(USERS_TABLE);
        $this->id = USER_USERNAME;
        $this->name = USERS_TABLE;
        $this->uploader = APP_UPLOAD;

        $this->registerSql = [
            ['Admin/Html5', USER_POD, HTML5_POD, null, null, 'cascade'],
            ['Admin/Lab_sessions', null, null, null, null, function ($data) {
                $deleteDatas = $data['data'];
                $labSessionsModel = Models::get('Admin/Lab_sessions');
                foreach ($deleteDatas as $deleteData) {
                    if ($labSessionsModel->is_exist([[[LAB_SESSION_POD, '=', $deleteData->{USER_POD}]]])) {
                        Reply::finish(false, 'ERROR', ['data' => 'Some Lab sessions are still owned this user. Please Destroy them first']);
                    }
                }
                return false;
            }]
        ];

        $this->registerDepend = [
            //['Auth/MapUG', AUTHEN_NAME, MAP_UG_PEOPLENAME, AUTHEN_ID, MAP_UG_PEOPLEID],

        ];
    }
}
