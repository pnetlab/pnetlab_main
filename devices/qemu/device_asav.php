<?php

/**
 * 
 * @author LIN 
 * @copyright pnetlab.com
 * @link https://www.pnetlab.com/
 * 
 */

class device_asav extends device_qemu
{

    function __construct($node)
    {
        parent::__construct($node);
    }

    public function createEthernets($quantity)
    {
        $ethernets = [];

        for ($i = 0; $i < $quantity; $i++) {

            if($i == 0 && $this->first_nic != ''){
                $flag = ' -device '.$this->first_nic.',netdev=net' . $i . ',mac=' . incMac($this->createFirstMac(), $i);
            }else{
                $flag = ' -device %NICDRIVER%,netdev=net' . $i . ',mac=' . incMac($this->createFirstMac(), $i);
            }
            $flag .= ' -netdev tap,id=net' . $i . ',ifname=vunl' . $this->getSession() . '_' . $i . ',script=no';

            if (!isset($this->ethernets[$i])) {

                if ($i == 0) {
                    $n = 'Mgmt0/0';         // Interface name
                } else {
                    $n = 'Gi0/' . ($i - 1);   // Interface name
                }
                try {
                    $ethernets[$i] = new Interfc( $this, array('name' => $n, 'type' => 'ethernet', 'flag' => $flag), $i);
                } catch (Exception $e) {
                    error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][40020]);
                    error_log(date('M d H:i:s ') . (string) $e);
                    return false;
                }
            } else {
                $ethernets[$i] = $this->ethernets[$i];
            }
            // Setting CMD flags (virtual device and map to TAP device)

        }

        $this->ethernets = $ethernets;
        return $this->ethernets;
    }


    public function prepare()
    {
        $result = parent::prepare();
        if ($result != 0) return $result;

        if (is_file($this->getRunningPath() . '/startup-config') && !is_file($this->getRunningPath() . '/.configured')) {
            copy($this->getRunningPath() . '/startup-config',  $this->getRunningPath() . '/day0-config');
            $isocmd = 'mkisofs -r -o ' . $this->getRunningPath() . '/config.iso -l --iso-level 2 ' . $this->getRunningPath() . '/day0-config';
            exec($isocmd, $o, $rc);
        }

        return 0;
    }

    public function customFlag($flag)
    {
        if(is_file($this->getRunningPath() . '/config.iso') && !is_file($this->getRunningPath() . '/.configured') && $this->config != 0) {
            $flag .= ' -cdrom config.iso';
        }
        return $flag;
    }
}
