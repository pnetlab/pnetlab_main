<?php
/**
 * 
 * @author LIN 
 * @copyright pnetlab.com
 * @link https://www.pnetlab.com/
 * 
 */

class wic_1enet extends adapter
{

    function __construct($device, $slot, $subSlot)
    {
        parent::__construct($device, $slot, $subSlot);
        $this->name = 'WIC-1ENET';
        $this->flag = '-p ' . $slot . ':' . 16*(int)$subSlot.':'.$this->name;
    }

    public function createEthernets()
    {

        for ($p = 0; $p <= 0; $p++) {
            $interfaceId = $this->slot * 16 + $this->subSlot * 16 + $p;
            if (!isset($this->ethernets[$interfaceId])) {
                $flag = '-s '.$this->slot.':'.(16 * $this->subSlot + $p).':tap:vunl' . $this->device->getSession() . '_' . $interfaceId;
                try {
                    $this->ethernets[$interfaceId] = new Interfc( $this->device, array('name' => 'e'.$this->slot.'/'.$this->subSlot+$p, 'type' => 'ethernet', 'flag' => $flag), $interfaceId);
                } catch (Exception $e) {
                    error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][40020]);
                    error_log(date('M d H:i:s ') . (string) $e);
                    return false;
                }
            }
        }
    }
}
