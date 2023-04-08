<?php
/**
 * 
 * @author LIN 
 * @copyright pnetlab.com
 * @link https://www.pnetlab.com/
 * 
 */

class device_c1710 extends device_dynamips {
    
    public function createEthernets($quantity)
    {
        
        if (!isset($this->ethernets[0])) {
            $flag = ' -s 0:1:tap:vunl' . $this->getSession() . '_0';
            try {
                $this->ethernets[0] = new Interfc($this, [
                    'name' => 'e0', 
                    'type' => 'ethernet',
                    'flag' => $flag
                ], 0);
            } catch (Exception $e) {
                error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][40020]);
                error_log(date('M d H:i:s ') . (string) $e);
                return false;
            }
        }

        if (!isset($this->ethernets[1])) {
            $flag = ' -s 0:0:tap:vunl' . $this->getSession() . '_1';
            try {
                $this->ethernets[1] = new Interfc($this, [
                    'name' => 'fa0',
                    'type' => 'ethernet',
                    'flag' => $flag
                ], 1);
            } catch (Exception $e) {
                error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][40020]);
                error_log(date('M d H:i:s ') . (string) $e);
                return false;
            }
        }
        
        return $this->ethernets;
    }
}