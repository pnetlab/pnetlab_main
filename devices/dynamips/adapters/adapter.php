<?php
/**
 * 
 * @author LIN 
 * @copyright pnetlab.com
 * @link https://www.pnetlab.com/
 * 
 */

class adapter
{
    function __construct($device, $slot, $subSlot)
    {
        $this->device = $device;
        $this->slot = $slot;
        $this->subSlot = $subSlot;
        $this->createEthernets();
        $this->createSerials();
    }

    protected $device = null;
    protected $ethernets= [];
    protected $serials = [];
    protected $slot = 0;
    protected $subSlot = 0;
    protected $flag = '';
    protected $name = "";

    public function createEthernets(){
        return $this->ethernets;
    }
    public function createSerials(){
        return $this->serials;
    }
    
    public function getEthernets(){
        return $this->ethernets;
    }
    public function getSerials(){
        return $this->serials;
    }

    public function getName(){
        return $this->name;
    }

    public function getSlot(){
        return $this->slot;
    }

    public function getSubSlot(){
        return $this->subSlot;
    }



    public function getFlag(){
        $flag = $this->flag;
        foreach($this->ethernets as $eth){
            $flag .= ' '. $eth->getFlag();
        }
        foreach($this->serials as $serial){
            $flag .= ' '. $serial->getFlag();
        }
        return preg_replace('/\s+/m', ' ', $flag);
    }

}