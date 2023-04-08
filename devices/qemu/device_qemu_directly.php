<?php

/**
 * 
 * @author LIN 
 * @copyright pnetlab.com
 * @link https://www.pnetlab.com/
 * 
 */

class device_qemu extends device
{

    function __construct($node)
    {
        parent::__construct($node);
    }

    //Default qemu device factory

    public function createEthernets($quantity)
    {

        $ethernets = [];
        $p = $this->node->getParams();
        $tpl = $this->tpl;
        $prefix = 'e';
        $eth_format = ($this->eth_format != "") ? $this->eth_format : (isset($p['eth_format']) ? $p['eth_format'] : "");
       
        if ($eth_format != '') {
            $format = EthFormat2val($eth_format);
            $prefix = $format['prefix'];
            $first = $format['first'];
        } else {
            $first = 0;
        }
        $pass = 0;
        for ($i = 0; $i < $quantity; $i++) {
            if (!isset($this->ethernets[$i])) {
                $flags = ' -device %NICDRIVER%,netdev=net' . $i . ',mac=' . $this->createNodeMac($i);
                $flags .= ' -netdev tap,id=net' . $i . ',ifname=vunl' . $this->getSession() . '_' . $i . ',script=no';

                $n = $prefix;
                if (isset($tpl['eth_name'][$i]) && $tpl['eth_name'][$i] != '') {
                    $n = $tpl['eth_name'][$i];
                    $pass +=  1;
                } else {
                    if (isset($format['slotstart']) && $format['slotstart'] != 9999) {
                        $n .= ((int) (($i - $pass) / $format['mod'])  + $format['slotstart']) . $format['sep'];
                    }
                    if (isset($format['mod']) && $format['mod'] != 9999) {
                        $n .= (($i - $pass) % $format['mod'] + $format['first']);
                    } else {
                        $n .= $i - $pass + $first;
                    }
                }

                try {
                    $ethernets[$i] = new Interfc(array('name' => $n, 'type' => 'ethernet', 'flag' => $flags), $i);
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

    public function getParams()
    {
        $params = parent::getParams();
        $re = '/\'|"|\\\\"|\\\\\'/m';
        $this->qemu_options = preg_replace($re, "\'", $this->qemu_options);

        return array_replace($params, [
            'uuid' => $this->uuid,
            'firstmac' => $this->firstmac,
            'qemu_options' => $this->qemu_options,
            'qemu_version' => $this->qemu_version,
            'qemu_arch' => $this->qemu_arch,
            'qemu_nic' => $this->qemu_nic,
            'username' => $this->username,
            'password' => $this->password,
            'eth_format' => $this->eth_format,
            'console_2nd' => $this->console_2nd,
            'map_port' => $this->map_port,
            'map_port_2nd' => $this->map_port_2nd,
        ]);
    }


    public function editParams($p)
    {

        if(isset($p['eth_format'])){
            $this->eth_format = (string) $p['eth_format'];
        }

        parent::editParams($p);

        if (isset($p['uuid'])) {
            $this->uuid = $p['uuid'];
            if (!checkUuid($this->uuid)) {
                $this->uuid = genUuid();
            }
        }

        if (isset($p['firstmac'])) {

            if (isValidMac($p['firstmac'])) {
                $this->firstmac = (string) $p['firstmac'];
            } else {
                $this->firstmac =  $this->createFirstMac();
            }
        }

        if ((isset($p['qemu_options']))) {
            $this->qemu_options = (string) $p['qemu_options'];
            $re = '/\'|"|\\\\"|\\\\\'/m';
            $this->qemu_options = preg_replace($re, "\'", $this->qemu_options);
        }

        if (isset($p['qemu_version'])) {
            $this->qemu_version = (string) $p['qemu_version'];
            if ($this->qemu_version == '') $this->qemu_version = '2.4.0';
        }

        if (isset($p['qemu_arch'])) {
            $this->qemu_arch = (string) $p['qemu_arch'];
        }

        if (isset($p['qemu_nic'])) {
            $this->qemu_nic = (string) $p['qemu_nic'];
        }

        if (isset($p['username'])) {
            $this->username = (string) $p['username'];
        }

        if (isset($p['password'])) {
            $this->password = (string) $p['password'];
        }

        if (isset($p['console_2nd'])) {
            $this->console_2nd = (string) $p['console_2nd'];
            if($this->console_2nd == $this->console) $this->console_2nd = '';
        }

        if (isset($p['map_port'])) {
            $this->map_port = (string) $p['map_port'];
        }

        if (isset($p['map_port_2nd'])) {
            $this->map_port_2nd = (string) $p['map_port_2nd'];
        }

        
    }

    public function command()
    {

        $bin = '';;
        $flags = '';

        $p = $this->tpl;
        $qarch = ($this->qemu_arch != "") ? $this->qemu_arch : (isset($p['qemu_arch']) ? $p['qemu_arch'] : "");
        if ($qarch == "") {
            // Arch not found
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80015]);
            return array(False, False);
        }

        $qversion = ($this->qemu_version != "") ? $this->qemu_version : (isset($p['qemu_version']) ? $p['qemu_version'] : "");
        if ($qversion != "") {

            $bin .= '/opt/qemu-' . $qversion . '/bin/qemu-system-' . $qarch;
            error_log(date('M d H:i:s ') . 'ERROR: ' . $bin);
        } else {
            $bin .= '/opt/qemu/bin/qemu-system-' . $qarch;
            error_log(date('M d H:i:s ') . 'ERROR: ' . $bin);
        }

        if (!is_file($bin)) {
            // QEMU not found
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80016]);
            return array(False, False);
        }

        $flags .= ' ' . $this->getFlag();

        if ($this->console == 'rdp') {
            $flags .= ' -device %NICDRIVER%,netdev=net' . $this->ethernet . ',mac=' . $this->createNodeMac($this->ethernet);
            $flags .= ' -netdev user,id=net' . $this->ethernet . ',hostfwd=tcp::' . $this->getPort() . '-:3389,net=169.254.1.100/30,dhcpstart=169.254.1.100,restrict=on';
        }
        else if ($this->console_2nd == 'rdp') {
            $flags .= ' -device %NICDRIVER%,netdev=net' . $this->ethernet . ',mac=' . $this->createNodeMac($this->ethernet);
            $flags .= ' -netdev user,id=net' . $this->ethernet . ',hostfwd=tcp::' . $this->getSecondPort() . '-:3389,net=169.254.1.100/30,dhcpstart=169.254.1.100,restrict=on';
        }


        if ($this->console == 'vnc') {
            $flags .= ' -vnc :' . ($this->getPort() - 5900);  // start a VNC server on display
        }
        else if ($this->console_2nd == 'vnc') {
            $flags .= ' -vnc :' . ($this->getSecondPort() - 5900);  // start a VNC server on display
        } 
        else {
            $flags .= ' -nographic ';
        }

        if($this->console == 'telnet'){
            $port = $this->getPort();
            // $flags .= ' -serial tcp::'.$port.',server';
            $flags .= ' -serial telnet::'.$port.',server,nowait';
        }else if($this->console_2nd == 'telnet'){
            $port = $this->getSecondPort();
            // $flags .= ' -serial tcp::'.$port.',server';
            $flags .= ' -serial telnet::'.$port.',server,nowait';
        }


        
        $qnic = ($this->qemu_nic != "") ? $this->qemu_nic : (isset($p['qemu_nic']) ? $p['qemu_nic'] : "");
        if (preg_match('/^[0-9a-zA-Z-]+$/', $qnic)) {
            // Setting non default NIC driver
            $flags = str_replace('%NICDRIVER%', $qnic, $flags);
        } else if ($qnic != '') {
            // Invalid NIC driver
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80017]);
            return '';
        } else {
            // Setting default NIC driver
            $flags = str_replace('%NICDRIVER%', 'e1000', $flags);
        }

        $flags .= ' -smp ' . $this->cpu;             // set the number of CPUs
        $flags .= ' -m ' . $this->ram;              // configure guest RAM
        $flags .= ' -name ' . $this->name;          // set the name of the guest
        $flags .= ' -uuid ' . $this->uuid;          // specify machine UUID



        // Adding controller
        foreach (scandir('/opt/unetlab/addons/qemu/' . $this->image) as $filename) {
            if (preg_match('/^megasas[a-z]+.qcow2$/', $filename)) {
                // MegaSAS
                $flags .= ' -device megasas,id=scsi0,bus=pci.0,addr=0x5';                                             // Define SCSI BUS
                break;
            } else if (preg_match('/^lsi[a-z]+.qcow2$/', $filename)) {
                // LSI
                $flags .= ' -device lsi,id=scsi0,bus=pci.0,addr=0x5';                                             // Define SCSI BUS
                break;
            }
        }

        // Adding disks
        foreach (scandir('/opt/unetlab/addons/qemu/' . $this->image) as $filename) {
            if ($filename == 'cdrom.iso') {
                // CDROM
                $flags .= ' -cdrom /opt/unetlab/addons/qemu/' . $this->image . '/cdrom.iso';
            } else if ($filename == 'kernel.img') {
                // Custom Kernel
                $flags .= ' -kernel /opt/unetlab/addons/qemu/' . $this->image . '/kernel.img';
            } else if (preg_match('/^megasas[a-z]+.qcow2$/', $filename)) {
                // MegaSAS
                $patterns[0] = '/^megasas([a-z]+).qcow2$/';
                $replacements[0] = '$1';
                $disk_id = preg_replace($patterns, $replacements, $filename);
                $lun = (int) ord(strtolower($disk_id)) - 97;
                $flags .= ' -device scsi-disk,bus=scsi0.0,scsi-id=' . $lun . ',drive=drive-scsi0-0-' . $lun . ',id=scsi0-0-' . $lun . ',bootindex=' . $lun;  // Define SCSI disk
                $flags .= ' -drive file=' . $filename . ',if=none,id=drive-scsi0-0-' . $lun . ',cache=none';                        // Define SCSI file
            } else if (preg_match('/^lsi[a-z]+.qcow2$/', $filename)) {
                // LSI
                $patterns[0] = '/^lsi([a-z]+).qcow2$/';
                $replacements[0] = '$1';
                $disk_id = preg_replace($patterns, $replacements, $filename);
                $lun = (int) ord(strtolower($disk_id)) - 97;
                $flags .= ' -device scsi-disk,bus=scsi0.0,scsi-id=' . $lun . ',drive=drive-scsi0-0-' . $lun . ',id=scsi0-0-' . $lun . ',bootindex=' . $lun;  // Define SCSI disk
                $flags .= ' -drive file=' . $filename . ',if=none,id=drive-scsi0-0-' . $lun . ',cache=none';                        // Define SCSI file
            } else if (preg_match('/^hd[a-z]+.qcow2$/', $filename)) {
                // IDE
                $patterns[0] = '/^hd([a-z]+).qcow2$/';
                $replacements[0] = '$1';
                $disk_id = preg_replace($patterns, $replacements, $filename);
                $flags .= ' -hd' . $disk_id . ' ' . $filename;
                if ($this->getTemplate() == 'nxosv9k') {
                    $flags .= ' -bios /opt/qemu/share/qemu/OVMF.fd -drive file=hda.qcow2,if=ide,index=2';
                }
            } else if (preg_match('/^virtide[a-z]+.qcow2$/', $filename)) {
                // IDE
                $patterns[0] = '/^virtide([a-z]+).qcow2$/';
                $replacements[0] = '$1';
                $disk_id = preg_replace($patterns, $replacements, $filename);
                $disk_num = (int) ord(strtolower($disk_id)) - 97;
                $flags .= ' -device virtio-blk-pci,scsi=off,drive=idedisk' . $disk_num . ',id=hd' . $disk_id . ',bootindex=1';
                $flags .= ' -drive file=' . $filename . ',if=none,id=idedisk' . $disk_num . ',format=qcow2,cache=none';
            } else if (preg_match('/^virtio[a-z]+.qcow2$/', $filename)) {
                // VirtIO
                $patterns[0] = '/^virtio([a-z]+).qcow2$/';
                $replacements[0] = '$1';
                $disk_id = preg_replace($patterns, $replacements, $filename);
                $lun = (int) ord(strtolower($disk_id)) - 97;
                $flags .= ' -drive file=' . $filename . ',if=virtio,bus=0,unit=' . $lun . ',cache=none';
            } else if (preg_match('/^scsi[a-z]+.qcow2$/', $filename)) {
                // SCSI
                $patterns[0] = '/^scsi([a-z]+).qcow2$/';
                $replacements[0] = '$1';
                $disk_id = preg_replace($patterns, $replacements, $filename);
                $lun = (int) ord(strtolower($disk_id)) - 97;
                $flags .= ' -drive file=' . $filename . ',if=scsi,bus=0,unit=' . $lun . ',cache=none';
            } else if (preg_match('/^sata[a-z]+.qcow2$/', $filename)) {
                //SATA
                $patterns[0] = '/^sata([a-z]+).qcow2$/';
                $replacements[0] = '$1';
                $disk_id = preg_replace($patterns, $replacements, $filename);
                $disk_id = (int) ord(strtolower($disk_id)) - 97;
                $flags .= ' -device ahci,id=ahci' . $disk_id . ',bus=pci.0';
                $flags .= ' -drive file=' . $filename . ',if=none,id=drive-sata-disk' . $disk_id . ',format=qcow2';
                $flags .= ' -device ide-drive,bus=ahci' . $disk_id . '.0,drive=drive-sata-disk' . $disk_id . ',id=drive-sata-disk' . $disk_id . ',bootindex=' . ($disk_id + 1);
                if ($this->getTemplate() == 'nxosv9k') {
                    $flags .= " -bios /opt/qemu/share/qemu/OVMF-sata.fd";
                }
            }
        }

        // Adding custom flags
        $qoptions = ($this->qemu_options != "") ? $this->qemu_options : (isset($p['qemu_options']) ? $p['qemu_options'] : "");
        $flags .= ' ' . $qoptions;
        $flags = $this->customFlag($flags);

        


        // $cmd = '/opt/unetlab/wrappers/qemu_wrapper -T ' . $this->getHost() . ' -D ' . $this->getSession() . ' -P ' . $port . ' -t "' . $this->name . '" -F ' . $bin . ' -d ' . $this->delay;
        // if ($this->console != 'telnet'  && $this->console_2nd != 'telnet') {
        //     // Disable telnet (wrapper) console
        //     $cmd .= ' -x';
        // }

        $cmd = $bin . $flags . ' > ' . $this->getRunningPath() . '/wrapper.txt 2>&1 &';

        return $cmd;
    }

    /**
     * Flag is a command's parameter signal by -- in wrapper
     * This function is overwritten by children to custom 
     * @property flag : current flag
     * @return flag: flag after custom
     */
    public function customFlag($flag)
    {
        return $flag;
    }


    public function prepare()
    {
        $result = parent::prepare();
        if ($result != 0) return $result;

        if (!checkUsername($this->getSession())) {
            error_log(date('M d H:i:s ') . date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][14]);
            return 14;
        }

        $user = 'unl' . $this->getSession();

        if ($this->console == 'rdp') {
            $cmd = 'iptables -t nat -D INPUT -p tcp --dport ' . $this->getPort() . ' -j SNAT --to 169.254.1.102';
            exec($cmd, $o, $rc);
            $cmd = 'iptables -t nat -I INPUT -p tcp --dport ' . $this->getPort() . ' -j SNAT --to 169.254.1.102';
            exec($cmd, $o, $rc);
        }

        if ($this->console_2nd == 'rdp') {
            $cmd = 'iptables -t nat -D INPUT -p tcp --dport ' . $this->getSecondPort() . ' -j SNAT --to 169.254.1.102';
            exec($cmd, $o, $rc);
            $cmd = 'iptables -t nat -I INPUT -p tcp --dport ' . $this->getSecondPort() . ' -j SNAT --to 169.254.1.102';
            exec($cmd, $o, $rc);
        }

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


        if (!is_file($this->getRunningPath() . '/.prepared') && !is_file($this->getRunningPath() . '/.lock')) {

            $image = '/opt/unetlab/addons/qemu/' . $this->image;

            if (!touch($this->getRunningPath() . '/.lock')) {
                // Cannot lock directory
                error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80041]);
                return 80041;
            }

            // Copy files from template
            foreach (scandir($image) as $filename) {
                if (preg_match('/^[a-zA-Z0-9]+.qcow2$/', $filename)) {
                    // TODO should check if file exists
                    $cmd = '/opt/qemu/bin/qemu-img create -b "' . $image . '/' . $filename . '" -f qcow2 "' . $this->getRunningPath() . '/' . $filename . '"';
                    exec($cmd, $o, $rc);
                    if ($rc !== 0) {
                        // Cannot make linked clone
                        error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80045]);
                        error_log(date('M d H:i:s ') . implode("\n", $o));
                        return 80045;
                    }
                }
            }

            if (is_file($this->getRunningPath() . '/.lock')) {
                if (!unlink($this->getRunningPath() . '/.lock')) {
                    // Cannot unlock directory
                    error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80042]);
                    return 80042;
                }
            }

            if (!touch($this->getRunningPath() . '/.prepared')) {
                // Cannot write on directory
                error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80044]);
                return 80044;
            }
        }
    }


    public function start()
    {
        $result = parent::start();

        if ($result == 0) {
            if (is_file($this->getRunningPath() . '/startup-config') && !is_file($this->getRunningPath() . '/.configured') && $this->config != 0) {
                // Start configuration process or check if bootstrap is done
                $configScript = ($this->config_script != "") ? $this->config_script : (isset($this->tpl['config_script']) ? $this->tpl['config_script'] : "");

                if($configScript != '' && is_file('/opt/unetlab/scripts/' . $configScript)){
                    touch($this->getRunningPath() . '/.lock');
                    $cmd = 'nohup /opt/unetlab/scripts/' . $configScript . ' -a put -p ' . $this->getPort() . ' -f ' . $this->getRunningPath() . '/startup-config -t ' . ($this->delay + $this->getScriptTimeout()) . ' > /dev/null 2>&1 &';
                    exec($cmd, $o, $rc);
                    error_log(date('M d H:i:s ') . 'INFO: importing ' . $cmd);
                }else{
                    touch($this->getRunningPath() . '/.configured');
                }
               
            }

            if ($this->cpulimit == 1) {
                sleep(1);
                $tpid = [];
                $cpucommand = "ps axw -o pid,cmd | grep 'vunl" . $this->getSession() . "_'| grep smp | grep qemu-system | grep -v 'sh ' | grep -v 'wrapper' | cut -d '/' -f1";
                error_log(date('M d H:i:s ') . 'INFO: ' . $cpucommand);
                exec($cpucommand, $tpid, $rc);

                if ($rc == 0 && isset($tpid) && count($tpid) > 0) {
                    error_log(date('M d H:i:s ') . 'INFO: qemu pid is ' . $tpid[0]);
                    exec("cgclassify -g pids:/cpulimit " . $tpid[0], $ro, $rc);
                }
            }
            return 0;
        }
        return $result;
    }


    public function export()
    {
        $tmp = tempnam(sys_get_temp_dir(), 'unl_cfg_' . $this->getSession());

        if (is_file($tmp) && !unlink($tmp)) {
            // Cannot delete tmp file
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80059]);
            return 80059;
        }

        if ($this->getStatus() < 2 || !isExitConfigScript($this->getTemplate())) {
            // Skipping powered off nodes or unsupported nodes
            error_log(date('M d H:i:s ') . 'WARNING: ' . $GLOBALS['messages'][80084]);
            return 80084;
        } else {
            $timeout = 45;
            // Depending on configuration's size, export from mikrotik could take longer than 15 seconds
            if ($this->getTemplate() == 'mikrotik') {
                $timeout = 45;
            }

            $configScript = ($this->config_script != "") ? $this->config_script : (isset($this->tpl['config_script']) ? $this->tpl['config_script'] : "");
            $cmd = '/opt/unetlab/scripts/' . $configScript . ' -a get -p ' . $this->getPort() . ' -f ' . $tmp . ' -t ' . $timeout;
            exec($cmd, $o, $rc);
            error_log(date('M d H:i:s ') . 'INFO: exporting ' . $cmd);
            if ($rc != 0) {
                error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80060]);
                error_log(date('M d H:i:s ') . implode("\n", $o));
                return 80060;
            }
        }


        if (!is_file($tmp)) {
            // File not found
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80062]);
            return 80062;
        }

        // Add no shut
        if (($this->getTemplate() == "csr1000vng" || $this->getTemplate() == "csr1000v" || $this->getTemplate() == "crv" || $this->getTemplate() == "vios" || $this->getTemplate() == "viosl2" || $this->getTemplate() == "xrv" || $this->getTemplate() == "xrv9k")) {
            file_put_contents($tmp, preg_replace('/(\ninterface.*)/', '$1' . chr(10) . ' no shutdown', file_get_contents($tmp)));
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
        if ($activeConfig == '') {
            $this->config_data = $config_data;
        } else {
            $this->multi_config[$activeConfig] = $config_data;
        }

        if (!unlink($tmp)) {
            // Failed to remove tmp file
            error_log(date('M d H:i:s ') . 'WARNING: ' . $GLOBALS['messages'][80070]);
        }
        return 0;
    }
}
