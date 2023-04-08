<?php

/**
 * 
 * @author LIN 
 * @copyright pnetlab.com
 * @link https://www.pnetlab.com/
 * 
 */

class device_docker extends device
{

    public function createEthernets($quantity)
    {
        $ethernets = [];
        for ($i = 0; $i < $quantity; $i++) {

            if (!isset($this->ethernets[$i])) {
                $n = 'eth' . $i;        // Interface name
                try {
                    $ethernets[$i] = new Interfc($this, [
                        'name' => $n,
                        'type' => 'ethernet',
                    ], $i);
                } catch (Exception $e) {
                    error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][40020]);
                    error_log(date('M d H:i:s ') . (string) $e);
                    return 40020;
                }
            } else {
                $ethernets[$i] = $this->ethernets[$i];
            }
        }
        $this->ethernets = $ethernets;
        return $this->ethernets;
    }

    public function editParams($p)
    {
        
        if (isset($p['docker_options'])) {
            $this->docker_options = (string) $p['docker_options'];
        }

        if (isset($p['username'])) {
            $this->username = (string) $p['username'];
        }

        if (isset($p['password'])) {
            $this->password = (string) $p['password'];
        }

        if (isset($p['console_2nd'])) {
            $this->console_2nd = (string) $p['console_2nd'];
        }

        if (isset($p['map_port'])) {
            $this->map_port = (string) $p['map_port'];
        }

        if (isset($p['map_port_2nd'])) {
            $this->map_port_2nd = (string) $p['map_port_2nd'];
        }

        if (isset($p['eth1_dhcp'])) {
            $this->eth1_dhcp = (int) $p['eth1_dhcp'];
        }

        if (isset($p['eth1_ip'])) {
            $this->eth1_ip = (string) $p['eth1_ip'];
        }

        parent::editParams($p);
    }

    public function getParams()
    {
        $params = parent::getParams();
        return array_replace($params, [
            'docker_options' => $this->docker_options,
            'username' => $this->username,
            'password' => $this->password,
            'console_2nd' => $this->console_2nd,
            'map_port' => $this->map_port,
            'map_port_2nd' => $this->map_port_2nd,
            'eth1_dhcp' => $this->eth1_dhcp,
            'eth1_ip' => $this->eth1_ip,
        ]);
    }

    public function prepare()
    {
        $result = parent::prepare();
        if($result != 0) return $result;

        if($this->map_port == ''){
            if ($this->console == 'vnc') {
                $connPort = 5900;
            } elseif ($this->console == 'rdp') {
                $connPort = 3389;
            } elseif ($this->console == 'ssh') {
                $connPort = 22;
            } elseif ($this->console == 'http') {
                $connPort = 80;
            } elseif ($this->console == 'https') {
                $connPort = 443;
            }else {
                $connPort = 23;
            }
        }else{
            $connPort = (int) $this->map_port;
        }

        if($this->map_port_2nd == ''){
            if ($this->console_2nd == 'vnc') {
                $connPort2nd = 5900;
            } elseif ($this->console_2nd == 'rdp') {
                $connPort2nd = 3389;
            } elseif ($this->console_2nd == 'ssh') {
                $connPort2nd = 22;
            } elseif ($this->console == 'http') {
                $connPort = 80;
            } elseif ($this->console == 'https') {
                $connPort = 443;
            } else {
                $connPort2nd = 23;
            }
        }else{
            $connPort2nd = (int) $this->map_port_2nd;
        }

        
        $cmd = 'docker -H=tcp://127.0.0.1:4243 inspect --format="{{ .State.Running }}" docker' . $this->getSession();
 	    error_log(date('M d H:i:s ') . 'INFO: starting ' . $cmd);
        secureCmd($cmd);
        exec($cmd, $o, $rc);
	    error_log($rc);
        if ($rc != 0) {
            // Must create docker.io container
            //Check Docker Options
            if($connPort == 23){
                $consoleCmd = '';
            }else{
                $consoleCmd = '--net=bridge -p ' . $this->getPort() . ':' . $connPort;
            }

            if($connPort2nd == 23){
                $consoleCmd2nd = '';
            }else{
                $consoleCmd2nd = '--net=bridge -p ' . $this->getSecondPort() . ':' . $connPort2nd;
            }

	    error_log($connPort2nd);

            if(!isset($this->docker_options)) $this->docker_options = '';
           
            $cmd = 'docker -H=tcp://127.0.0.1:4243 create -ti --memory ' . $this->ram . 'M ' ;
            if($this->cpu > 0) $cmd .= ' --cpus=' . $this->cpu . ' ';
            $cmd .= $this->docker_options . ' ' . $consoleCmd.' '.$consoleCmd2nd.' --name=docker' . $this->getSession() . ' -h "' . $this->name . '" ' . $this->image;
            $cmd = preg_replace('/\s+/m', ' ', $cmd);
            error_log(date('M d H:i:s ') . 'INFO: starting ' . $cmd);
            secureCmd($cmd);
            exec($cmd, $o, $rc);
            
            if ($rc != 0) {
                error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80083]);
                return 80083;
            }
        }

        if (!touch($this->getRunningPath() . '/.prepared')) {
            // Cannot write on directory
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80044]);
            return 80044;
        }

        return 0;
    }


    public function start()
    {

        $result = parent::start();
        if($result != 0) return $result;

        $cmd = 'docker -H=tcp://127.0.0.1:4243 start docker' . $this->getSession();
		error_log(date('M d H:i:s ') . 'INFO: starting ' . $cmd);
        exec($cmd, $o, $rc);
        sleep((int) $this->delay);
        if ($rc == 0) {

            $cmd = 'docker -H=tcp://127.0.0.1:4243 inspect --format "{{ .State.Pid }}" docker' . $this->getSession();
            //error_log(date('M d H:i:s ').'INFO: starting '.$cmd);
            exec($cmd, $o, $rc);
            $pid = $o[1];

            foreach ($this->getEthernets() as $interface_id => $interface) {
                // TODO must check each step against errors

                // remove link before creating it. OK if it fails.
                $cmd = 'ip link delete vunl' . $this->getSession() . '_' . $interface_id;
                error_log(date('M d H:i:s ') . 'INFO: deleting ' . $cmd);
                exec($cmd, $o, $rc);

                // ip link add docker3_4_5 type veth peer name vnet3_4_5
                $cmd = 'ip link add docker' . $this->getSession() . '_' . $interface_id . ' type veth peer name vunl' . $this->getSession() . '_' . $interface_id;
                error_log(date('M d H:i:s ') . 'INFO: starting ' . $cmd);
                exec($cmd, $o, $rc);

                // 26 Aug 2018 - VNET should not be added unless there is a link on a interface meaning there should be no bridge. Have to see if there is another process for links
                // ip link set dev vnet3_4_5 up
                
                $cmd = 'ip link set dev vunl' . $this->getSession() . '_' . $interface_id . ' up';
                error_log(date('M d H:i:s ') . 'INFO: starting ' . $cmd);
                exec($cmd, $o, $rc);
                // brctl addif vnet0_1 vnet3_4_5
                

                $network = $this->getNetwork($interface->getNetworkId());

                if (isset($network) && $network->isCloud()) {
                    // Network is a Cloud
                    $net_name = $network->getNType();
                } else {
                    $net_name = 'vnet' . $this->getLabSession() . '_' . $interface->getNetworkId();
                }

                $cmd = 'brctl addif ' . $net_name . ' vunl' . $this->getSession() . '_' . $interface_id;
                error_log(date('M d H:i:s ') . 'INFO: starting ' . $cmd);
                exec($cmd, $o, $rc);
                //
                // PID=$(docker inspect --format '{{ .State.Pid }}' docker3_4) # Must be greater than 0
                
                // ip link set netns ${PID} docker3_4_5 name eth0 address 22:ce:e0:99:04:05 up
                $cmd = 'ip link set netns ' . $pid . ' docker' . $this->getSession() . '_' . $interface_id . ' name eth' . $interface_id . ' address ' . $this->createNodeMac($interface_id) . ' up';
                error_log(date('M d H:i:s ') . 'INFO: starting ' . $cmd);
                exec($cmd, $o, $rc);
            }

            // Start configuration process
            
            touch($this->getRunningPath() . '/.lock');
            $configScript = ($this->config_script != "") ? $this->config_script : (isset($this->tpl['config_script']) ? $this->tpl['config_script'] : "");
            $cmd = secureCmd('nohup /opt/unetlab/scripts/' . $configScript . ' -a put -i docker' . $this->getSession() . ' -f ' . $this->getRunningPath() . '/startup-config -t ' . ($this->delay + 300)) . ' > /dev/null 2>&1 &';
            exec($cmd, $o, $rc);
            error_log(date('M d H:i:s ') . 'INFO: importing ' . $cmd);
            
            $output = exec('ifconfig docker0 | grep "inet "');
            error_log( $output);

            if(preg_match('/inet[^0-9]*([0-9]+.[0-9]+.[0-9]+.[0-9]+)/', $output, $match)){
                $docker0 = $match[1];
                $cmd = '/opt/unetlab/wrappers/nsenter -t '.$pid.' -n route del default gw ' . $docker0;
                exec($cmd, $o, $rc);
                error_log(date('M d H:i:s ') . 'INFO: importing ' . $cmd);
            }

            if(preg_match('/([0-9]+.[0-9]+.[0-9]+.[0-9]+)\/[0-9]+/', $this->eth1_ip)){
                $cmd = '/opt/unetlab/wrappers/nsenter -t '.$pid.' -n ifconfig eth1 ' . $this->eth1_ip;
                exec($cmd, $o, $rc);
                error_log(date('M d H:i:s ') . 'INFO: importing ' . $cmd);
            }else if($this->eth1_dhcp){
                $cmd = '/opt/unetlab/wrappers/nsenter -t '.$pid.' -n dhclient eth1';
                exec($cmd, $o, $rc);
                error_log(date('M d H:i:s ') . 'INFO: importing ' . $cmd);
            }

            $attachCmd = 'sh';
            $cmd = 'docker -H=tcp://127.0.0.1:4243 exec -i docker'.$this->getSession().' ls /bin/bash';
            $o = [];
            exec($cmd, $o, $rc);
            error_log(date('M d H:i:s ') . 'INFO: importing ' . $cmd);
            if(count($o) > 0) $attachCmd = '/bin/bash';

            if($this->console == 'telnet'){
                $cmd = secureCmd('sudo /opt/unetlab/wrappers/docker_wrapper -P ' . $this->getPort() . ' -t "'.$this->name.'" -p ' . $this->getSession() .' -c '. $attachCmd .' > ' . $this->getRunningPath()) . '/wrapper.txt 2>&1 &';
                exec($cmd, $o, $rc);
                error_log(date('M d H:i:s ') . 'INFO: run ' . $cmd);
            } 
            else if($this->console_2nd == 'telnet'){
                $cmd = secureCmd('sudo /opt/unetlab/wrappers/docker_wrapper -P ' . $this->getSecondPort() . ' -t "'.$this->name.'" -p ' . $this->getSession() .' -c '. $attachCmd .' > ' . $this->getRunningPath()) . '/wrapper.txt 2>&1 &';
                exec($cmd, $o, $rc);
                error_log(date('M d H:i:s ') . 'INFO: run ' . $cmd);
            }


            $ethernets = $this->getEthernets();
            $index = 0;
            foreach($ethernets as $ethernet){
                $index ++;
                if($index == 1) continue; // Keep eth0 up for management
                if(count($ethernet->getQuality()) > 0) $ethernet->applyQuality();
                if($ethernet->getSuspendStatus() == 1) $ethernet->applySuspendStatus();
                if($ethernet->getNetworkId() == 0) $ethernet->setLinkState('down');
            }
            
        }

        return 0;
    }

    public function export()
    {
        // Unsupported
        error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80061]);
        return 80061;
    }

    public function wipe()
    {
        
        $cmd = 'sudo /usr/bin/docker -H=tcp://127.0.0.1:4243 rm docker' . $this->getSession();
        exec($cmd, $o, $rc);

        return parent::wipe();
        
    }
}
