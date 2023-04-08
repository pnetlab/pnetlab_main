<?php
class ResponseException extends Exception 
{
    private $_data = '';

    public function __construct($message, $data=null, $code=0) 
    {
        $this->_data = $data;
        parent::__construct($message, $code);
    }

    public function getData()
    {
        return $this->_data;
    }
}