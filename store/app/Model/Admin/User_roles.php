<?php

namespace App\Model\Admin;

use Illuminate\Support\Facades\DB;

use App\Model\Model_basic;
use App\Helpers\Request\Reply;


class User_roles extends Model_basic
{
    function __construct()
    {

        parent::__construct();

        $this->struct = array(
            USER_ROLE_ID => [
                PROP_NAME => USER_ROLE_ID,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],
            USER_ROLE_NAME => [
                PROP_NAME => USER_ROLE_NAME,
                PROP_NULL => true,
                PROP_REGEX => "Varchar",
            ],
            USER_ROLE_WORKSPACE => [
                PROP_NAME => USER_ROLE_WORKSPACE,
                PROP_NULL => true,
                PROP_REGEX => "Varchar",
            ],
            USER_ROLE_NOTE => [
                PROP_NAME => USER_ROLE_NOTE,
                PROP_NULL => true,
                PROP_REGEX => "Varchar",
            ],
            USER_ROLE_RAM => [
                PROP_NAME => USER_ROLE_RAM,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],
            USER_ROLE_CPU => [
                PROP_NAME => USER_ROLE_CPU,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],
            USER_ROLE_HDD => [
                PROP_NAME => USER_ROLE_HDD,
                PROP_NULL => true,
                PROP_REGEX => "Number",
            ],

        );

        $this->query_builder = DB::table(USER_ROLES_TABLE);
        $this->id = USER_ROLE_ID;
        $this->name = USER_ROLES_TABLE;
        $this->uploader = APP_UPLOAD;

        $this->registerSql = [
            ['Admin/Users', USER_ROLE_ID, USER_ROLE, null, null, function ($data) {
                return null;
            }],
            ['Admin/User_permission', USER_ROLE_ID, USER_PER_ROLE, null, null, 'cascade'],
        ];

        $this->registerDepend = [
            //['Auth/MapUG', AUTHEN_NAME, MAP_UG_PEOPLENAME, AUTHEN_ID, MAP_UG_PEOPLEID],

        ];
    }
}
