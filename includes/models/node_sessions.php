<?php

class node_sessions extends model_basic {


    function __construct()
    {
        parent::__construct();
        $this->table = NODE_SESSIONS_TABLE;
    }
}