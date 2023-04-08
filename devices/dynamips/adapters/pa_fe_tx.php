<?php
/**
 * 
 * @author LIN 
 * @copyright pnetlab.com
 * @link https://www.pnetlab.com/
 * 
 */

class pa_fe_tx extends adapter
{

    function __construct($device, $slot, $subSlot)
    {
        parent::__construct($device, $slot, $subSlot);
        $this->name = 'PA-FE-TX';
        $this->flag = '-p ' . $slot . ':' . $this->name;
    }

    public function createEthernets()
    {
        $interfaceId = $this->slot * 16 + $this->subSlot * 16 + 0;
        if (!isset($this->ethernets[$interfaceId])) {
            $flag = '-s '.$this->slot.':0:tap:vunl' . $this->device->getSession() . '_' . $interfaceId;
            try {
                $this->ethernets[$interfaceId] = new Interfc( $this->device, array('name' => 'fa'.$this->slot.'/0', 'type' => 'ethernet', 'flag' => $flag), $interfaceId);
            } catch (Exception $e) {
                error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][40020]);
                error_log(date('M d H:i:s ') . (string) $e);
                return false;
            }
        }
    }
}
