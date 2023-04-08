<?php

class if_sessions extends model_basic {


    function __construct()
    {
        parent::__construct();
        $this->table = LAB_SESSIONS_TABLE;
    }
}