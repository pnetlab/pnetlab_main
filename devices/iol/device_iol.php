<?php

use Illuminate\Console\Parser;

/**
 * 
 * @author LIN 
 * @copyright pnetlab.com
 * @link https://www.pnetlab.com/
 * 
 */

class device_iol extends device
{

    // IOL uses porgroups, 4 interfaces each portgroup
    // Ethernets before Serials
    // i = x/y -> i = x + y * 16 -> x = i - y * 16 = i % 16

    public function createEthernets($quantity)
    {
        $ethernets = [];
        for ($x = 0; $x < $quantity; $x++) {
            for ($y = 0; $y <= 3; $y++) {
                $i = $x + $y * 16;      // Interface ID
                $n = 'e' . $x . '/' . $y;     // Interface name
                if (!isset($this->ethernets[$i])) {
                    try {
                        $ethernets[$i] = new Interfc($this, array('name' => $n, 'type' => 'ethernet'), $i);
                    } catch (Exception $e) {
                        error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][40020]);
                        error_log(date('M d H:i:s ') . (string) $e);
                        return false;
                    }
                } else {
                    $ethernets[$i] = $this->ethernets[$i];
                }
            }
        }
        $this->ethernets = $ethernets;
        return $this->ethernets;
    }

    public function createSerials($quantity)
    {
        $serials = [];
        $ethGroupCount = $this->ethernet;
        for ($x = 0; $x < $quantity; $x++) {
            for ($y = 0; $y <= 3; $y++) {
                $i = $ethGroupCount + $x + $y * 16;      // Interface ID 
                $n = 's' . ($x + $ethGroupCount) . '/' . $y;   // Interface name
                if (!isset($this->serials[$i])) {
                    try {
                        $serials[$i] = new Interfc($this, array('name' => $n, 'type' => 'serial'), $i);
                    } catch (Exception $e) {
                        error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][40022]);
                        error_log(date('M d H:i:s ') . (string) $e);
                        return false;
                    }
                } else {
                    $serials[$i] = $this->serials[$i];
                }
            }
        }

        $this->serials = $serials;
        return $this->serials;
    }

    public function editParams($p)
    {
        
        if (isset($p['iol_options'])) {
            $this->iol_options = (string) $p['iol_options'];
        }
        if (isset($p['keepalive'])) {
            $this->keepalive = (string) $p['keepalive'];
        }

        parent::editParams($p);
    }

    public function getParams()
    {
        $params = parent::getParams();
        
        return array_replace($params, [
            'iol_options' => $this->iol_options,
            'keepalive' => $this->keepalive
        ]);
    }

    public function command()
    {
        $iol_id = $this->node->getIolId();
        if ($iol_id == null) {
            error_log(date('M d H:i:s ') . 'ERROR: maximum 512 IOL node foreach user');
            return 12;
        }

        // if($this->isKeepAlive()){
        //     $cmd = '/opt/unetlab/wrappers/iol_wrapper_telnet ';
        // }else{
        //     $cmd = '/opt/unetlab/wrappers/iol_wrapper ';
        // }
        $cmd = '/opt/unetlab/wrappers/iol_wrapper ';
        $cmd .= '-D ' . $iol_id . ' -S ' . $this->getSession() . ' -P ' . $this->getPort() . ' -t "' . $this->name . '" -F ' . $this->node->getRunningPath() . '/' . $this->image . ' -d ' . (int)$this->delay . ' -e ' . (int)$this->ethernet . ' -s ' . (int)$this->serial;

        foreach ($this->getSerials() as $interface_id => $interface) {
            $remote_id = $interface->getRemoteId();
            if ($remote_id > 0) {
                $remote_node = $this->getNode($remote_id);
                if (!$remote_node) {
                    error_log('ERROR: Can not find node ' + $remote_id);
                    return;
                }
                $cmd .= ' -l ' . $interface_id . ':localhost:' . $remote_node->getIolId() . ':' . $interface->getRemoteIf() . ':' . $remote_node->getPort();
            }
        }
        
        $flags = ' -n ' . $this->nvram;  // Size of nvram in Kb
        $flags .= ' -q';                       // Suppress informational messages
        $flags .= ' -m ' . $this->ram;    // Megabytes of router memory

        if($this->isKeepAlive()) $flags .= ' -l'; // Add L1 keepalive option

        if ($this->config == '1') {
            $flags .= ' -c startup-config';        // Configuration file name
        }

        $flags .= isset($this->iol_options) ? ' '.$this->iol_options : '';

        $cmd .= ' -- ' . $flags . ' > ' . $this->getRunningPath() . '/wrapper.txt';
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

        // if($this->isKeepAlive()){

        //     $netmap = $this->getRunningPath().'/NETMAP';
        //     $netmapWriter = fopen($netmap, 'w');
        //     $ifIndex = 0;
        //     foreach ($this->getEthernets() as $interface_id => $interface) {
        //         $ifIndex ++;
        //         fwrite($netmapWriter, $this->getIolId(). ":" . preg_replace('/[a-zA-Z]/', '' , $interface->getName()) . " " . ($this->getIolId() + $ifIndex). ":" . preg_replace('/[a-zA-Z]/', '' , $interface->getName()));
        //         fwrite($netmapWriter, "\n");
        //     }

        //     fclose($netmapWriter);
        // }
        

        if (!is_file($this->getRunningPath() . '/.prepared') && !is_file($this->getRunningPath() . '/.lock')) {

            // Node is not prepared/locked
            if (!is_dir($this->getRunningPath()) && !mkdir($this->getRunningPath(), 0775, True)) {
                // Cannot create running directory
                error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80037]);
                return 80037;
            }


            if (!is_file('/opt/unetlab/addons/iol/bin/iourc')) {
                // IOL license not found
                error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80039]);
                return 80039;
            }

            if (!file_exists($this->getRunningPath() . '/iourc') && !symlink('/opt/unetlab/addons/iol/bin/iourc', $this->getRunningPath() . '/iourc')) {
                // Cannot link IOL license
                error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80040]);
                return 80040;
            }

            if (file_exists('/opt/unetlab/addons/iol/bin/' . $this->image)) {
                symlink('/opt/unetlab/addons/iol/bin/' . $this->image, $this->getRunningPath() . '/' . $this->image);
            }

            if (file_exists('/opt/unetlab/addons/iol/bin/keepalive.pl')) {
                symlink('/opt/unetlab/addons/iol/bin/keepalive.pl', $this->getRunningPath() . '/keepalive.pl');
            }
        }

        if (!touch($this->getRunningPath() . '/.prepared')) {
            // Cannot write on directory
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80044]);
            return 80044;
        }

        $cmd = 'id -u ' . $user . ' 2>&1';
        exec($cmd, $o, $rc);
        $uid = $o[0];
        if (!posix_setuid($uid)) {
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80036]);
            return 80036;
        }

        return 0;
    }


    public function start(){
        $result = parent::start();
        if( $this->isKeepAlive()){
            $interfaces = $this->getInterfaces();
            foreach($interfaces as $interface){
                if($interface->getNType() == 'ethernet'){
                    if($interface->getNetworkId() > 0 && $interface->getSuspendStatus() != 1){
                        usleep(100000); // waiting for device ready
                        $interface->setLinkState('up');
                    }
                }else{
                    // serial link
                    if($interface->getRemoteId() > 0 && $interface->getSuspendStatus() != 1){
                        usleep(100000); // waiting for device ready
                        $interface->setLinkState('up');
                    }
                }
            } 
        }
        return $result;
    }

    public function stop(){

        $cmd = 'ps -aux | grep keepalive | grep vunl'.$this->getSession().'_ | grep -v "ps -aux" | tr -s " "| cut -d " " -f 2';
        $o = [];
        exec($cmd, $o, $rc);
        foreach($o as $pid){
            exec('sudo kill -9 '. $pid);
            error_log('sudo kill -9 '. $pid);
        }
        return parent::stop();
    }

    public function export()
    {
        $tmp = tempnam(sys_get_temp_dir(), 'unl_cfg_' . $this->getSession());

        if (is_file($tmp) && !unlink($tmp)) {
            // Cannot delete tmp file
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80059]);
            return 80059;
        }


        error_log(date('M d H:i:s ') . 'SCAN: ' . $this->getRunningPath());
        foreach (scandir($this->getRunningPath()) as $filename) {
            if (preg_match('/nvram_/', $filename)) {
                $nvram = $this->getRunningPath() . '/' . $filename;
                break;
            }
        }

        if (!isset($nvram)) {
            // NVRAM file not found
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80066]);
            return 80066;
        }

        $cmd = '/opt/unetlab/scripts/wrconf_iol.py -p ' . $this->getPort() . ' -t 30';
        exec($cmd, $o, $rc);
        error_log(date('M d H:i:s ') . 'INFO: force write configuration ' . $cmd);
        if ($rc != 0) {
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80060]);
            error_log(date('M d H:i:s ') . implode("\n", $o));
            return 80060;
        }
        $cmd = '/opt/unetlab/scripts/iou_export ' . $nvram . ' ' . $tmp;
        exec($cmd, $o, $rc);
        usleep(1);
        error_log(date('M d H:i:s ') . 'INFO: exporting ' . $cmd);
        if ($rc != 0) {
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80060]);
            error_log(date('M d H:i:s ') . implode("\n", $o));
            return 80060;
        }
        // Add no shut
        if (is_file($tmp)) file_put_contents($tmp, preg_replace('/(\ninterface.*)/', '$1' . chr(10) . ' no shutdown', file_get_contents($tmp)));

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


    public function isKeepAlive(){
        // if(count($this->getSerials()) > 0) return false;
        return $this->keepalive == 1;
    }

    /** Return ethernet index in ethernets array. Using for create iou2net command */
    public function getEthernetIndex($ifId){
        $index = 0;
        $ethernets = $this->getEthernets();
        foreach($ethernets as $ethernet){
            if($ethernet->getId() == $ifId) return $index;
            $index ++;
        }
        return null;
    }

    /** Return ethernet index in all interface array. Using for create iou2net command */
    public function getInterfaceIndex($type, $ifId){
        $index = 0;
        if($type == 'ethernet'){
            $ethernets = $this->getEthernets();
            foreach($ethernets as $ethernet){
                if($ethernet->getId() == $ifId) return $index;
                $index ++;
            }
        }else if($type == 'serial'){
            $serials = $this->getSerials();
            foreach($serials as $serial){
                if($serial->getId() == $ifId) return $index;
                $index ++;
            }
        }
        return null;
        
    }

}
