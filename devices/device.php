<?php

/**
 * 
 * @author LIN 
 * @copyright pnetlab.com
 * @link https://www.pnetlab.com/
 * 
 *
 * 
 * Device: device factory
 *  |
 *  |__ Device Type : extends device factory (device_iol.php, device_dynamips.php, device_qemu.php, device_docker.php, device_vpcs.php)
 *          |
 *          |__ Device Line: Extends device type (device_[device line name].php)
 *          |
 *          |__ Adapter : Line card, network module
 * 
 *       
 */


/**   
 * @property type $console protocol. It's optional.
 * @property type $config Filename for the startup configuration. It's optional.
 * @property type $config_data The full startup configuration. It's optional.
 * @property type $cpu CPUs configured on the node. It's optional.
 * @property type $delay Seconds before starting the node. It's optional.
 * @property type $id Device ID. It's mandatory and set during contruction phase.
 * @property type $ethernet Number of configured Ethernet interfaces/portgroups. It's optional.
 * @property type $ethernets Configured Ethernet interfaces/portgroups. It's optional.
 * @property type $icon Icon used on diagram. It's optional.
 * @property type $idlepc Idle PC for Dynamips nodes. It's optional.
 * @property type $image Image for the node. It's mandatory and automatically set to one of the available one.
 * @property type $lab_id Lab ID. It's mandatory and set during contruction phase.
 * @property type $left Left margin for visual position. It's optional.
 * @property type $name Name of the node. It's optional but suggested.
 * @property type $nvram RAM configured on the node. It's optional.
 * @property type $port Console port. It's mandatory and set during contruction phase.
 * @property type $ram NVRAM configured on the node. It's optional.
 * @property type $serial Number of configured Serial interfaces/porgroups. It's optional (IOL only)
 * @property type $serials Configured Serial interfaces/porgroups. It's optional (IOL only)
 * @property type $slots Array of configured slots. It's optional (Dynamips only)
 * @property type $template Template of the node. It's mandatory.
 * @property type $tenant Tenant ID. It's mandatory and set during contruction phase.
 * @property type $top Top margin for visual position.
 * @property type $type Type of the node. It's mandatory.

 */



class device
{
    public $console;
    public $config;
    public $config_data;
    public $multi_config = [];
    public $config_script;
    public $cpu;
    public $cpulimit = 1;
    public $delay;
    public $ethernet;
    public $firstmac;
    public $icon;
    public $idlepc;
    public $image;
    public $left;
    public $name;
    public $nvram;
    public $ram;
    public $serial;
    public $top;
    public $size = '';


    protected $node = null;
    protected $ethernets = [];
    protected $serials = [];
    protected $modules = [];
    protected $tpl = []; // save template value

    function __construct($node)
    {
        $this->node = $node;
        try {
            $this->tpl = yaml_parse_file(BASE_DIR . '/html/templates/' . $this->getTemplate() . '.yml');
        } catch (Exception $e) {
            throw new ResponseException('Can not load template file {data}', ['data' => $this->getTemplate()]);
        }
    }

    /**
     * Create and return an unique MAC address for Node
     */
    public function createNodeMac($id)
    {
        $session = $this->getSession();
        $session = sprintf('%06x', $session);
        $mac = '50:' . chunk_split($session, 2, ':') . '00:' . sprintf('%02x', $id);
        return $mac;
    }

    /**
     * Create and Return an unique the First MAC address for Node
     */
    private $createFirstMacResult = null;
    public function createFirstMac()
    {
        if (IsValidMac($this->firstmac)) return $this->firstmac;

        if (!$this->createFirstMacResult ||  $this->createFirstMacResult == '') {
            $session = $this->getSession();
            $session = sprintf('%04x', $session);
            $random = sprintf('%04x', rand(0, 16 * 16 * 16 * 16));
            $mac = '50:' . chunk_split($random, 2, ':') . chunk_split($session, 2, ':') . '00';
            $this->createFirstMacResult = $mac;
        }

        return $this->createFirstMacResult;
    }

    /**
     * Create ethernet interfaces for onboard card
     * @property quantity : number of ethernet interface
     */
    public function createEthernets($quantity)
    {
        return $this->ethernets;
    }

    /**
     * Create serial interfaces for onboard card
     * @property quantity : number of serial interface
     */
    public function createSerials($quantity)
    {
        return $this->serials;
    }

    /**
     * Add network module or card to device
     * @property slot: Slot id
     * @property subSlot: Sub-Slot id
     * @property nm: Network module name
     * 
     */
    public function createModule($slot, $subSlot, $nm)
    {
        return $this->modules;
    }

    /**
     * Return all ethernets interface instances of device.
     * all interfaces in onboard and network modules
     * 
     */
    public function getEthernets()
    {
        $ethernets = $this->ethernets;
        foreach ($this->modules as $module) {
            foreach ($module->getEthernets() as $ethernet) {
                $ethernets[$ethernet->getId()] = $ethernet;
            }
        }
        return $ethernets;
    }

    /**
     * Return all serials interface instances of device.
     * all interfaces in onboard and network modules
     * 
     */
    public function getSerials()
    {
        $serials = $this->serials;
        foreach ($this->modules as $module) {
            foreach ($module->getserials() as $serial) {
                $serials[$serial->getId()] = $serial;
            }
        }
        return $serials;
    }

    public function getInterfaces()
    {
        return $this->getEthernets() + $this->getSerials();
    }


    /**
     * 
     * Return Flag to setting all interfaces and modules
     * in comand 
     */

    public function getFlag()
    {

        $flag = '';
        foreach ($this->ethernets as $eth) {
            $flag .= ' ' . $eth->getFlag();
        }
        foreach ($this->serials as $serial) {
            $flag .= ' ' . $serial->getFlag();
        }
        foreach ($this->modules as $module) {
            $flag .= ' ' . $module->getFlag();
        }
        return preg_replace('/\s+/m', ' ', $flag);
    }

    /**
     * Return all Network Modules
     * 
     */
    public function getModules()
    {
        return $this->modules;
    }

    /**
     * Return session id of node. 
     * When a node is loaded system will create a unique id (session) and save in database
     * session id will be deleted when you destroy lab.
     */
    public function getSession()
    {
        return $this->node->getSession();
    }

    /**
     * Return Lab session id
     */

    public function getLabSession()
    {
        return $this->node->getLabSession();
    }


    /**
     * 
     * Get console port of Node
     */
    public function getPort()
    {
        return $this->node->getPort();
    }

    /**
     * 
     * Get secondary port of Node
     */
    public function getSecondPort()
    {
        return $this->node->getSecondPort();
    }

    /**
     * Get Remote node by id
     */
    public function getNode($id)
    {
        return $this->node->getNode($id);
    }

    /**
     * Get network by ID
     */
    public function getNetwork($id)
    {
        return $this->node->getNetwork($id);
    }

    /**
     * Return Running folder of Node
     */
    public function getRunningPath()
    {
        return $this->node->getRunningPath();
    }

    /**
     * Return Node type 
     */
    public function getNType()
    {
        return $this->node->getNType();
    }

    /**
     * Return Node template name
     */

    public function getTemplate()
    {
        return $this->node->getTemplate();
    }


    /**
     * Return pod of user who create node session
     */

    public function getHost()
    {
        return $this->node->getHost();
    }

    /**
     * @return Status of node
     */

    public function getStatus()
    {
        return $this->node->getStatus();
    }


    /** 
     * @return int User POD of current session
     */
    public function getTenant()
    {
        return $this->node->getTenant();
    }

    /**
     * @return int ID of node in lab
     */
    public function getId()
    {
        return $this->node->getId();
    }

    /**
     * 
     *@return ScriptTimeout: the time system will wait before running script to apply start-up configuration
     * The time wait = Script Timeout + Delay    
     */
    public function getScriptTimeout()
    {
        if ($this->script_timeout > 0) return $this->script_timeout;
        return $this->node->getScriptTimeout();
    }


    public function getIolId()
    {
        return $this->node->getIolId();
    }

    /**
     * Return parameters for a device.
     * The return data of this function will be used to save node's data to .unl file 
     * or show on edit node form
     */
    public function getParams()
    {




        return [
            'config' => $this->config,
            'config_script' => $this->config_script,
            'script_timeout' => $this->script_timeout,
            'config_data' => base64_encode($this->config_data),
            'multi_config' => base64_encode(json_encode($this->multi_config)),
            'delay' => (int) $this->delay,
            'icon' => $this->icon,
            'image' => $this->image,
            'left' => (int) $this->left,
            'name' => $this->name,
            'top' => (int) $this->top,
            'size' => (int) $this->size,
            'console' => $this->console,
            'ethernet' => (int) $this->ethernet,
            'nvram' => (int) $this->nvram,
            'ram' => (int) $this->ram,
            'serial' => (int) $this->serial,
            'idlepc' => $this->idlepc,
            'console' => $this->console,
            'cpu' => (int) $this->cpu,
            'cpulimit' => (int) $this->cpulimit,
        ];
    }

    /**
     * Using parameters get from .unl file or add edit node form to set value for device instance
     * @property p: node's params get from .unl file or add/edit node form
     * 
     */

    public function editParams($p)
    {

        if (isset($p['config'])) {
            $this->config = $p['config'];
        }

        if (isset($p['config_script']) && $p['config_script'] != '') {
            $this->config_script = $p['config_script'];
        }

        if (isset($p['script_timeout'])) {
            $this->script_timeout = $p['script_timeout'];
        }

        if (isset($p['config_data'])) {
            $this->config_data = base64_decode($p['config_data']);
        }

        if (isset($p['multi_config'])) {
            try {
                $this->multi_config = json_decode(base64_decode($p['multi_config']), true);
            } catch (Exception $th) {
                $this->multi_config = [];
            }
        }

        if (isset($p['delay'])) {
            $this->delay = (int) $p['delay'];
        }

        if (isset($p['icon'])) {
            $this->icon = $p['icon'] != '' ? $p['icon'] : 'Router.png';
        }

        if (isset($p['image'])) {
            $this->image = $p['image'];
        }

        if (isset($p['left'])) {
            $this->left = $p['left'] != '' ? $p['left'] : rand(100, 924);
        }

        if (isset($p['name'])) {
            $this->name = $p['name'];
        }

        if (isset($p['top'])) {
            $this->top = $p['top'] != '' ? $p['top'] : rand(100, 668);
        }

        if (isset($p['size'])) {
            $this->size = $p['size'];
        }

        if (isset($p['console'])) {
            $this->console = $p['console'];
            if (in_array($this->type, array('iol', 'dynamips'))) {
                $this->console = 'telnet';
            }
        }

        if (isset($p['ethernet']) && $this->ethernet !== (int) $p['ethernet']) {
            $this->ethernet = (int) $p['ethernet'];
            $this->createEthernets($this->ethernet);
        }

        if (isset($p['nvram'])) {
            $this->nvram = $p['nvram'] != '' ? (int) $p['nvram'] : 1024;
        }

        if (isset($p['ram'])) {
            $this->ram = $p['ram'] != '' ? (int) $p['ram'] : 1024;
        }

        if (isset($p['serial']) && $this->serial !== (int) $p['serial']) {
            $this->serial = (int) $p['serial'];
            $this->createSerials($this->serial);
        }

        if (isset($p['idlepc'])) {
            $this->idlepc = $p['idlepc'] != '' ? $p['idlepc'] : '0x0';
        }

        if (isset($p['console'])) {
            $this->console = htmlentities($p['console']);
        }

        if (isset($p['cpu'])) {
            $this->cpu = (int) $p['cpu'];
        }

        if (isset($p['cpulimit'])) {
            $this->cpulimit = (int) $p['cpulimit'];
        }
    }


    /**
     * Method to get node console URL.
     * 
     * @return	string                      Node console URL
     */
    public function getConsoleUrl($html5)
    {

        if ($html5 != 1) {
            switch ($this->console) {
                default:
                case 'telnet':
                    return 'telnet://' . $_SERVER['SERVER_NAME'] . ':' . $this->getPort();
                    break;;
                case 'ssh':
                    return 'ssh://' . $_SERVER['SERVER_NAME'] . ':' . $this->getPort();
                    break;;
                case 'vnc':
                    return 'vnc://' . $_SERVER['SERVER_NAME'] . ':' . $this->getPort();
                    break;;
                case 'rdp':
                    return '/rdp/?target=' . $_SERVER['SERVER_NAME'] . '&port=' . $this->getPort();
                    break;;
                case 'winbox':
                    return 'winbox://' . $_SERVER['SERVER_NAME'] . ':' . $this->getPort();
                    break;;
                case 'http':
                    return 'http://' . $_SERVER['SERVER_NAME'] . ':' . $this->getPort();
                    break;;
                case 'https':
                    return 'https://' . $_SERVER['SERVER_NAME'] . ':' . $this->getPort();
                    break;;
            }
        } else {
            if ($this->console == 'winbox') return 'winbox://' . $_SERVER['SERVER_NAME'] . ':' . $this->getPort();
            if ($this->console == 'http') return 'http://' . $_SERVER['SERVER_NAME'] . ':' . $this->getPort();
            if ($this->console == 'https') return 'https://' . $_SERVER['SERVER_NAME'] . ':' . $this->getPort();
            return 'guacamole';
        }
    }


    /**
     * Method to get node 2nd console URL.
     * 
     * @return	string                      Node 2nd console URL
     */
    public function getSecondConsoleUrl($html5)
    {
        if (!isset($this->console_2nd) || $this->console_2nd == '') {
            return '';
        }

        $secondPort = $this->getSecondPort();

        if ($html5 != 1) {
            switch ($this->console_2nd) {
                default:
                case 'telnet':
                    return 'telnet://' . $_SERVER['SERVER_NAME'] . ':' . $secondPort;
                    break;;
                case 'ssh':
                    return 'ssh://' . $_SERVER['SERVER_NAME'] . ':' . $secondPort;
                    break;;
                case 'vnc':
                    return 'vnc://' . $_SERVER['SERVER_NAME'] . ':' . $secondPort;
                    break;;
                case 'rdp':
                    return '/rdp/?target=' . $_SERVER['SERVER_NAME'] . '&port=' . $secondPort;
                    break;;
                case 'winbox':
                    return 'winbox://' . $_SERVER['SERVER_NAME'] . ':' . $secondPort;
                    break;;
                case 'http':
                    return 'http://' . $_SERVER['SERVER_NAME'] . ':' . $secondPort;
                    break;;
                case 'https':
                    return 'https://' . $_SERVER['SERVER_NAME'] . ':' . $secondPort;
                    break;;
            }
        } else {
            if ($this->console_2nd == 'winbox') return 'winbox://' . $_SERVER['SERVER_NAME'] . ':' . $secondPort;
            if ($this->console_2nd == 'http') return 'http://' . $_SERVER['SERVER_NAME'] . ':' . $secondPort;
            if ($this->console_2nd == 'https') return 'https://' . $_SERVER['SERVER_NAME'] . ':' . $secondPort;
            return 'guacamole';
        }
    }


    /**
     * 
     * Get Html console link
     * Called when user console to device in HTML console mode
     * @param int index: 1 for primary console; 2 for secondary console
     * @return string link to connect to guacamole.
     */

    public function getGuacConsoleLink($index)
    {
        $html5_db = html5_checkDatabase();
        $username = getUser()['username'];

        if ($index == 1) {
            $console = $this->console;
            $port = $this->getPort();
        } else {
            $console = $this->console_2nd;
            $port = $this->getSecondPort();
        }

        if (!isset($console) || $console == '') {
            $console = 'telnet';
        }

        if ($console == 'http'){
            return 'http://' . $_SERVER['SERVER_NAME'] . ':' . $port;
        }
        if ($console == 'https'){
            return 'https://' . $_SERVER['SERVER_NAME'] . ':' . $port;
        }

        if ($console == 'rdp' || $console == 'vnc') {
            html5AddSession($html5_db, $this->name . '_' . $this->getId() . '_' . $username, $console, $port, $this->getTenant(), null, null, $this->username, $this->password, 'reconnect');
        } else {
            html5AddSession($html5_db, $this->name . '_' . $this->getId() . '_' . $username, $console, $port, $this->getTenant());
        }

        $token = getHtml5Token($this->getTenant());
        $b64id = base64_encode($port . $this->getTenant() . "\0" . 'c' . "\0" . 'mysql');

        return '/html5/#/client/' . $b64id . '?token=' . $token;
    }


    /**
     * 
     * Build command to start device
     */
    public function command()
    {
        return '';
    }

    /**
     * Make device ready for starting
     */
    public function prepare()
    {

        posix_setsid();
        posix_setgid(32768);

        if (!is_file($this->getRunningPath() . '/.prepared') && !is_file($this->getRunningPath() . '/.lock')) {

            // Node is not prepared/locked
            if (!is_dir($this->getRunningPath()) && !mkdir($this->getRunningPath(), 0775, True)) {
                // Cannot create running directory
                error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80037]);
                return 80037;
            }


            if ($this->config == '1') {
                // Node should use saved startup-config

                $activeConfig = $this->getActiveConfig();
                if ($activeConfig == '') {
                    $startupCfg = $this->config_data;
                } else {
                    $startupCfg = get($this->multi_config[$activeConfig], '');
                }

                if ($startupCfg != '') {
                    if (!dumpConfig($startupCfg, $this->getRunningPath() . '/startup-config')) {
                        error_log(date('M d H:i:s ') . 'WARNING: ' . $GLOBALS['messages'][80067]);
                    }
                }
            }
        }

        return 0;
    }

    /**
     * Make device ready for starting
     */
    public function start()
    {

        $result = $this->prepare();

        if ($result > 0) return $result;

        if (!chdir($this->getRunningPath())) {
            // Failed to change directory
            error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80047]);
            return 80047;
        }

        $cmd = $this->command();
        $cmd = secureCmd($cmd) . " 2>&1 &";
        if (!isset($cmd) || $cmd == '') return;
        $cmd = preg_replace('/\s+/m', ' ', $cmd);

        error_log(date('M d H:i:s ') . 'INFO: CWD is ' . getcwd());
        error_log(date('M d H:i:s ') . 'INFO: starting ' . $cmd);
        // Clean TCP port
        exec("fuser -k -n tcp " . ($this->getPort()));
        exec($cmd, $o, $rcp);

        if ($rcp == 0 && $this->type != 'docker') {
            $ethernets = $this->getEthernets();
            foreach ($ethernets as $ethernet) {
                if (count($ethernet->getQuality()) > 0) $ethernet->applyQuality();
                if ($ethernet->getSuspendStatus() == 1) $ethernet->applySuspendStatus();
            }
        }

        return $rcp;
    }

    /**
     * stop device
     * 
     */
    public function stop()
    {
        if ($this->getStatus() != 0) {
            if ($this->getNType() == 'docker') {
                $cmd = 'sudo docker -H=tcp://127.0.0.1:4243 stop docker' . $this->getSession();
            } else {
                $cmd = 'sudo fuser -k -TERM ' . $this->getRunningPath();
            }
            error_log(date('M d H:i:s ') . 'INFO: stopping ' . $cmd);
            exec($cmd, $o, $rc);

            if ($this->getStatus() != 0) {
                if ($this->command() != '') {
                    $cmd = 'sudo pkill -term  \'' . $this->command() . '\'';
                    error_log(date('M d H:i:s ') . 'INFO: stopping ' . $cmd);
                    exec($cmd, $o, $rc);
                }
            }

            usleep(200000); //sleep waiting for vunl free
            $cmd = 'ip link | grep vunl' . $this->getSession() . '_ | sed \'s/.*\(vunl[0-9]\+_[0-9]\+\).*/\1/g\' | while read line; do sudo ip link set $line down; sudo tunctl -d $line; done';
            error_log(date('M d H:i:s ') . 'ERROR: ' . $cmd);
            exec($cmd, $o, $rc);

            return 0;
        }
        return 0;
    }

    /**
     * Export configuration
     */

    public function export()
    {
        return 0;
    }


    /**
     * @return multi_config_active Config actived of Lab
     **/
    public function getActiveConfig()
    {
        return $this->node->getActiveConfig();
    }

    /**
     * Wipe Node
     */

    public function wipe()
    {

        $runningPath = $this->getRunningPath();
        if ($runningPath != null && $runningPath != '') {
            $cmd = 'sudo rm -rf ' . $runningPath;
            exec($cmd, $o, $rc);
        }

        return 0;
    }


    public function __get($name)
    {
        return isset($this->$name) ? $this->name : '';
    }
}
