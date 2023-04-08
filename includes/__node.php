<?php

class Node
{


	private $type;
	private $template;
	private $tenant;
	private $host;
	private $session = null;
	private $port;

	private $lab = null;
	private $lab_session = null;
	private $node_sessions = array();
	private $if_sessions = array();

	private $id;
	private $iol_id = null;
	private $lab_id;
	private $deviceFactory = null;
	private $params = [];


	public function __construct($p, $id, $tenant, $lab)
	{

		$this->params = $p;
		$this->lab = $lab;

		if (!isset($p['type']) || !isset($p['template'])) {
			error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][40000]);
			throw new Exception('40000');
			return 40000;
		}


		// Now building the node

		$this->id = (int) $id;
		$this->lab_id = $lab->getId();
		$this->lab_session = $lab->getSession();
		$this->template = $p['template'];
		$this->tenant = (int) $tenant;
		$this->type = $p['type'];

		$this->node_sessions = $lab->node_sessions;
		$this->if_sessions = $lab->if_sessions;

		if ($this->lab_session != null) {

			$node_session = $this->addNodeSession($this->lab_session, $this->id, $this->type);

			if ($node_session['result']) {
				$node_session = $node_session['data'];
				$this->port = $node_session['node_session_port'];
				$this->session = $node_session['node_session_id'];
				$this->host = $node_session['node_session_pod'];
			} else {
				throw new Exception($node_session['message']);
			}
		}

		// auto import class and create device factory
		try {

			if (is_file('/opt/unetlab/html/devices/' . $this->type . '/device_' . $this->type . '.php')) {
				require_once('/opt/unetlab/html/devices/' . $this->type . '/device_' . $this->type . '.php');
			} else {
				emptyLabSession($tenant);
				throw new ResponseException('Not support device', ['data' => $this->type]);
			}

			if (is_file('/opt/unetlab/html/devices/' . $this->type . '/device_' . $this->template . '.php')) {
				require_once('/opt/unetlab/html/devices/' . $this->type . '/device_' . $this->template . '.php');
				$class = 'device_' . $this->template;
				$this->deviceFactory = new $class($this);
			}

			if (!$this->deviceFactory) {
				$class = 'device_'. $this->type;
				$this->deviceFactory = new $class($this);
			}
			
			if (!$this->deviceFactory) {
				emptyLabSession($tenant);
				throw new ResponseException('Not support device', ['data' => $this->template]);
			}

			$this->edit($p);
			
		} catch (Exception $e) {
			emptyLabSession($tenant);
			throw new ResponseException('Not support device', ['data' => $this->template]);
		}
	}



	private function createNodeSession()
	{
		$db = checkDatabase();
		$query = 'SELECT node_session_id FROM node_sessions';
		$statement = $db->prepare($query);
		$statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		$idColumn = array_column($result, 'node_session_id', 'node_session_id');
		$id = count($idColumn) + 1;
		while (isset($idColumn[$id % 30000])) {
			$id++;
		}
		return $id % 30000;
	}

	private function addNodeSession($lab_session, $node_id, $node_type)
	{

		try {
			if (isset($this->node_sessions[$node_id])) {
				$node_session = $this->node_sessions[$node_id];
			} else {
				
				$nodeModel = loadModel('node_sessions');
				
				$id = $this->createNodeSession($lab_session, $node_id);

				$lab = getLabFromSession($lab_session);
				$port = 30000 + $id;
				$node_session = [
					'node_session_id' => $id,
					'node_session_nid' => $node_id,
					'node_session_lab' => $lab_session,
					'node_session_port' => $port,
					'node_session_type' => $node_type,
					'node_session_workspace' => createRunningPath($lab_session, $id),
					'node_session_pod' => $lab['lab_session_pod'],
				];

				$nodeModel->insert($node_session);
			}

			return ['result' => true, 'message' => 'Success', 'data' => $node_session];
		} catch (Exception $e) {
			return ['result' => false, 'message' => $e->getMessage()];
		}
	}

	public function delNodeSession()
	{

		try {
			
			$nodeModel = loadModel('node_sessions');
			$nodeModel->drop([[
				'node_session_id' ,'=', $this->getSession(),
			]]);
			return ['result' => true, 'message' => 'Success'];
		} catch (Exception $e) {
			return ['result' => false, 'message' => $e->getMessage()];
		}
	}


	public function getIolId()
	{

		if ($this->type == 'iol') {
			if ($this->iol_id != null) return $this->iol_id;

			$db = checkDatabase();
			$query = 'SELECT * FROM ' . NODE_SESSIONS_TABLE . ' WHERE ' . NODE_SESSION_ID . ' = :id';
			$statement = $db->prepare($query);
			$statement->execute([
				'id' => $this->getSession()
			]);
			$result = $statement->fetch(PDO::FETCH_ASSOC);
			if (isset($result[NODE_SESSION_IOL]) && $result[NODE_SESSION_IOL] > 0) {
				$this->iol_id = $result[NODE_SESSION_IOL];
				return $this->iol_id;
			};

			$query = 'SELECT ' . NODE_SESSION_IOL . ' FROM ' . NODE_SESSIONS_TABLE . ' WHERE ' . NODE_SESSION_POD . '=:pod AND ' . NODE_SESSION_LAB . ' =:lab_session AND ' . NODE_SESSION_TYPE . '=:type';
			$statement = $db->prepare($query);
			$statement->execute(['pod' => $this->host, 'lab_session' => $this->lab_session, 'type' => 'iol']);
			$result = $statement->fetchAll(PDO::FETCH_ASSOC);
			$idColumn = array_column($result, NODE_SESSION_IOL, NODE_SESSION_IOL);

			for ($i = 1; $i <= 512; $i++) {
				if (!isset($idColumn[$i])) {
					$iol_id = $i;
					break;
				}
			}

			$this->iol_id = $iol_id;

			$query = 'UPDATE ' . NODE_SESSIONS_TABLE . ' SET ' . NODE_SESSION_IOL . '=:iol_id WHERE ' . NODE_SESSION_ID . ' = :id';
			$statement = $db->prepare($query);
			$statement->execute(['iol_id' => $iol_id, 'id' => $this->getSession()]);

			return $this->iol_id;
		}
		return null;
	}


	public function edit($p)
	{
		$result = $this->deviceFactory->editParams($p);
		$this->addIfSessions();
		return $result;
	}

	public function export()
	{
		return $this->deviceFactory->export();
	}

	public function getActiveConfig()
	{
		return $this->lab->getMulti_config_active();
	}

	public function addMultiCfg($config_data, $name)
	{
		try {
			$this->deviceFactory->multi_config[$name] = $config_data;
			return true;
		} catch (Exception $e) {
			return false;
		}
	}

	public function editMultiCfg($config_data, $name)
	{
		try {
			if (isset($this->deviceFactory->multi_config[$name])){
				$this->deviceFactory->multi_config[$name] = $config_data;
				// if($this->getActiveConfig() == $name){
				// 	$this->updateStartUpConfig($config_data);
				// }
			}
				
			return true;
		} catch (Exception $e) {
			return false;
		}
	}

	public function renameMultiCfg($oldName, $newName)
	{
		try {

			if (isset($this->deviceFactory->multi_config[$oldName])) {
				$this->deviceFactory->multi_config[$newName] = $this->deviceFactory->multi_config[$oldName];
				unset($this->deviceFactory->multi_config[$oldName]);
			}
			return true;
		} catch (Exception $e) {
			return false;
		}
	}

	public function delMultiCfg($name)
	{
		try {
			if (isset($this->deviceFactory->multi_config[$name])) {
				unset($this->deviceFactory->multi_config[$name]);
			}
			return true;
		} catch (Exception $e) {
			return false;
		}
	}

	public function getMultiCfg($name)
	{
		try {
			if (isset($this->deviceFactory->multi_config[$name])) {
				return $this->deviceFactory->multi_config[$name];
			} else {
				return '';
			}
		} catch (Exception $e) {
			return '';
		}
	}


	public function getId()
	{
		return $this->id;
	}

	public function getLid()
	{
		return $this->lab_id;
	}

	public function getNode($id)
	{
		$nodes = $this->lab->getNodes();
		return isset($nodes[$id]) ? $nodes[$id] : null;
	}

	public function getNetwork($id)
	{
		$network = $this->lab->getNetworks();
		return isset($network[$id]) ? $network[$id] : null;
	}

	public function getHost()
	{
		return $this->host;
	}

	public function getName()
	{
		return $this->deviceFactory->name;
	}

	/**
	 * @return the $multi_config_lab
	 */
	public function getMulti_config()
	{
		if (!isset($this->deviceFactory->multi_config) || $this->deviceFactory->multi_config == '') {
			return [];
		}
		return $this->deviceFactory->multi_config;
	}

	public function getParams()
	{
		return $this->params;
	}


	public function getOptions()
	{
		return $this->deviceFactory->getParams();
	}


	/**
	 * Method to get config bin.
	 * Configured startup-config
	 */
	public function getConfigData()
	{
		return $this->deviceFactory->config_data;
	}

	/**
	 * Method to get config bin.
	 * Configured startup-config
	 */
	public function getConfig()
	{
		return $this->deviceFactory->config;
	}


	public function getIcon()
	{
		return $this->deviceFactory->icon;
	}



	/**
	 * Method to get node console URL.
	 * 
	 * @return	string                      Node console URL
	 */
	public function getConsoleUrl($html5)
	{
		return $this->deviceFactory->getConsoleUrl($html5);
	}


	/**
	 * Method to get node console URL.
	 * 
	 * @return	string                      Node console URL
	 */
	public function getSecondConsoleUrl($html5)
	{
		return $this->deviceFactory->getSecondConsoleUrl($html5);
	}

	public function getGuacConsoleLink($index)
	{
		return $this->deviceFactory->getGuacConsoleLink($index);
	}

	public function getEthernets()
	{
		return $this->deviceFactory->getEthernets();
	}

	public function getImage()
	{
		return $this->deviceFactory->image;
	}

	public function getInterfaces()
	{
		return $this->getEthernets() + $this->getSerials();
	}

	public function getNType()
	{
		return $this->type;
	}

	public function getScriptTimeout()
	{
		return $this->lab->getScriptTimeout();
	}

	public function getPort()
	{
		return $this->port;
	}

	public function setPort($port)
	{
		return $this->port = $port;
	}

	public function getSecondPort()
	{
		return 10000 + $this->getPort();
	}

	public function getSession()
	{
		return $this->session;
	}

	public function getLabSession()
	{
		return $this->lab_session;
	}

	public function getTenant(){
		return $this->tenant;
	}

	/**
	 * Method to get running path.
	 * 
	 * @return	string                      Running path
	 */
	public function getRunningPath()
	{
		if ($this->session == null) return null;
		return createRunningPath($this->lab_session, $this->session);
	}

	/**
	 * Method to get node Serial interfaces.
	 * 
	 * @return	Array                       Array of interfaces
	 */
	public function getSerials()
	{
		return $this->deviceFactory->getSerials();
	}

	/**
	 * Method to get node status.
	 * 
	 * @return	int                         0 is stopped, 1 is running, 2 is building and started, 3 is building and stopped
	 */
	public function getStatus()
	{
		return getNodeStatus($this->session, $this->type, $this->getRunningPath(), $this->port);
	}

	/** Update node status after device is started or Stoped */
	private function updateRunning($session_id, $state){
		$db = checkDatabase();
		$query = 'UPDATE ' . NODE_SESSIONS_TABLE . ' SET ' .NODE_SESSION_RUNNING. '= :node_session_running WHERE ' . NODE_SESSION_ID . '=:node_session_id';
		$statement = $db->prepare($query);
		$statement->execute([
			'node_session_running' => $state,
			'node_session_id' => $session_id,
		]);
	}

	/**
	 * Method to get node template.
	 * 
	 * @return	string                      Node template
	 */
	public function getTemplate()
	{
		return $this->template;
	}

	public function start()
	{

		$this->updateRunning($this->getSession(), '1');
		return $this->deviceFactory->start();
	}

	public function stop()
	{
		$this->updateRunning($this->getSession(), '0');
		return $this->deviceFactory->stop();
	}

	public function wipe()
	{
		$this->updateRunning($this->getSession(), '0');
		return $this->deviceFactory->wipe();
	}


	/**
	 * Method to link an interface.
	 * 
	 * @param   Array   $p                  Parameters
	 * @return  int                         0 means ok
	 */
	public function linkInterface($p, $hot = false)
	{
		if (!isset($p['id']) || (int) $p['id'] < 0) {
			throw new Exception('If ID is wrong');
		}
		$interfs = $this->getInterfaces();
		
		if (isset($interfs[$p['id']])) {
			$result = $interfs[$p['id']]->edit($p);
			if($hot) $interfs[$p['id']]->plug();
			return $result;
		}
		// throw new Exception('Non existent interface');
	}

	/** Create interface session data for node */
	public function addIfSessions(){
		if ($this->lab_session != null) {
			$interfs = $this->getInterfaces();
			foreach($interfs as $interf){
				$interf->addIfSession($this->lab_session, $this->session, $this->if_sessions);
			}
			
		}
	}

	/**
	 * Method to set config bin.
	 * 
	 * @param   string  $config_data         Binary config
	 * @return  int                         0 means ok
	 */
	public function setConfigData($config_data)
	{
		$this->deviceFactory->config_data = $config_data;
		// if($this->getActiveConfig()==''){
		// 	$this->updateStartUpConfig();
		// }
		return 0;
	}


	/**
	 * Method to update configuration to startup config
	 * Current no use
	 */

	public function updateStartUpConfig(){
		$startConfigFile = $this->getRunningPath() . '/startup-config';
		$configedFlag = $this->getRunningPath().'/.configured';

		$result = exec('sudo rm -f '.$startConfigFile);
		$result = exec('sudo rm -f '.$configedFlag);
		$result = exec('sudo touch '. $startConfigFile);
		$result = exec('sudo chown www-data:www-data '.$startConfigFile);

		$activeConfig = $this->getActiveConfig();
		if ($activeConfig == '') {
			$config_data = $this->getConfigData();
		} else {
			$config_data = get($this->getMulti_config()[$activeConfig], '');
		}
		if(is_file($startConfigFile)){
			file_put_contents($startConfigFile, $config_data);
		}
		
		return true;
	}


	public function unlock(){
		$lockFile = $this->getRunningPath().'/.lock';
		if(is_file($lockFile)){
			exec('sudo rm -f '.$lockFile);
		}
		return true;
	}


	/**
	 * Method to unlink an interface.
	 * 
	 * @param   int     $i                  Interface ID
	 * @return  int                         0 means ok
	 */
	public function unlinkInterface($i, $hot = false)
	{
		if (!isset($i) || (int) $i < 0) {
			error_log(date('M d H:i:s ') . 'WARNING: ' . $GLOBALS['messages'][40017]);
			return 40017;
		}

		// Ethernet interface
		$ethernets = $this->getEthernets();
		if (isset($ethernets[$i])) {

			$ethernets[$i]->unApplyQuality();
			$ethernets[$i]->removeQuality();
			$ethernets[$i]->removeSuspendStatus();

			if($hot) $ethernets[$i]->unplug();

			$result = $ethernets[$i]->edit(array('network_id' => ''));
	
			return $result;
		}

		// Serial interface
		$serials = $this->getSerials();
		if (isset($serials[$i])) {
			return $serials[$i]->edit(array('remote_id' => '', 'remote_if' => ''));
		}

		// Non existent interface
		error_log(date('M d H:i:s ') . 'WARNING: ' . $GLOBALS['messages'][40018]);
		return 40018;
	}
}
