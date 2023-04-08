<?php

/**
 * 
 * @author LIN 
 * @copyright pnetlab.com
 * @link https://www.pnetlab.com/
 * 
 */

class device_vpcs extends device
{

    public function createEthernets($quantity)
    {
        $ethernets = [];
        for ($i = 0; $i < $quantity; $i++) {
            $flag = ' -e -d vunl' . $this->getSession() . '_' . $i;
            if (!isset($this->ethernets[$i])) {
                $n = 'eth' . $i;          // Interface name
                try {
                    $ethernets[$i] = new Interfc($this, [
                        'name' => $n,
                        'type' => 'ethernet',
                        'flag' => $flag
                    ], $i);
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

    public function command()
    {
        $cmd = '/opt/vpcsu/bin/vpcs -m ' . $this->getSession() . ' -N ' . $this->name;
        $flags = ' -i 1 -p ' . $this->getPort();
        $flags .= ' ' . $this->getFlag();
        $cmd .= $flags . ' > ' . $this->getRunningPath() . '/wrapper.txt';

        return $cmd;
    }

    public function prepare()
    {
        $result = parent::prepare();
        if($result != 0) return $result;

        if (!checkUsername($this->getSession())) {
            error_log(date('M d H:i:s ') . date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][14]);
            return 14;
        }

        $user = 'unl' . $this->getSession();


        foreach ($this->getEthernets() as $interface_id => $interface) {
			$tap_name = 'vunl' . $this->getSession() . '_' . $interface_id;
            $network = $this->getNetwork($interface->getNetworkId());
			if ($network && $network->isCloud()) {
				// Network is a Cloud
				$net_name = $network->getNType();
			} else {
				$net_name = 'vnet' . $this->getLabSession() . '_' . $interface->getNetworkId();
			}

			// Remove interface
			$rc = delTap($tap_name);
			if ($rc !== 0) {
				// Failed to delete TAP interface
				return $rc;
			}


			// Add interface
			$rc = addTap($tap_name, $user);
			if ($rc !== 0) {
				// Failed to add TAP interface
				return $rc;
			}

			if ($interface->getNetworkId() !== 0) {
				// Connect interface to network
				$rc = connectInterface($net_name, $tap_name);
				if ($rc !== 0) {
					// Failed to connect interface to network
					return $rc;
				}
			}
        }
        
        if(is_file($this->getRunningPath() . '/startup-config')){
            copy($this->getRunningPath() . '/startup-config',  $this->getRunningPath() . '/startup.vpc');
        }
        
        if (!touch($this->getRunningPath() . '/.prepared')) {
            // Cannot write on directory
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80044]);
            return 80044;
        }
    }

    public function export()
    {
        $tmp = tempnam(sys_get_temp_dir(), 'unl_cfg_' . $this->getSession());

        if (is_file($tmp) && !unlink($tmp)) {
            // Cannot delete tmp file
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80059]);
            return 80059;
        }


        if (!is_file($this->getRunningPath() . '/startup.vpc')) {
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80062]);
        } else {
            copy($this->getRunningPath() . '/startup.vpc', $tmp);
        }

        if (!is_file($tmp)) {
            // File not found
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80062]);
            return 80062;
        }

        // Now save the config file within the lab
        clearstatcache();
        $fp = fopen($tmp, 'r');
        if (!isset($fp)) {
            // Cannot open file
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80064]);
            return 80064;
        }
        $config_data = fread($fp, filesize($tmp));
        if ($config_data === False || $config_data === '') {
            // Cannot read file
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80065]);
            return 80065;
        }

        $activeConfig = $this->getActiveConfig();
        if($activeConfig == ''){
            $this->config_data = $config_data;
        }else{
            $this->multi_config[$activeConfig] = $config_data;
        }

        if (!unlink($tmp)) {
            // Failed to remove tmp file
            error_log(date('M d H:i:s ') . 'WARNING: ' . $GLOBALS['messages'][80070]);
        }

        return 0;
    }
}
