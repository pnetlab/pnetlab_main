<?php

use App\Exceptions\FinishException;

$db = null;
function checkDatabase()
{
	// Database connection
	try {
		//$db = new PDO('sqlite:'.DATABASE);
		if ($GLOBALS['db'] == null) {
			$db = new PDO('mysql:host=localhost;dbname=pnetlab_db', 'pnetlab', 'pnetlab');
			$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$GLOBALS['db'] = $db;
		}

		return $GLOBALS['db'];
	} catch (Exception $e) {
		error_log(date('M d H:i:s ') . (string) $e);
		return False;
	}
}


/** Helper for load model */
$models = [];
function loadModel($name){
	if(!isset($GLOBALS['models'][$name])){
		$modelName = BASE_DIR.'/html/includes/models/'. $name. '.php';
		if(is_file($modelName)){
			require_once($modelName);
			$GLOBALS['models'][$name] = new $name();
		}else{
			throw new Exception($modelName . ' is not exist');
		}
	}
	return $GLOBALS['models'][$name];
}


/**
 * Function to check user expiration.
 *
 * @param	PDO		$db					PDO object for database connection
 * @param	string	$username			Username
 * @return	bool						True if valid
 */
function checkUserExpiration($db, $username)
{
	$now = time() + SESSION;
	try {
		$query = 'SELECT COUNT(*) AS rows FROM users WHERE username = :username AND (expiration < 0 OR expiration >= :expiration);';
		$statement = $db->prepare($query);
		$statement->bindParam(':expiration', $now, PDO::PARAM_INT);
		$statement->bindParam(':username', $username, PDO::PARAM_STR);
		$statement->execute();
		$result = $statement->fetch();
		if ($result['rows'] == 1) {
			return True;
		} else {
			return False;
		}
	} catch (Exception $e) {
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][90024]);
		error_log(date('M d H:i:s ') . (string) $e);
		return False;
	}
}



function updateOnlineTime($pod)
{
	$db = checkDatabase();
	$query = 'UPDATE users SET online_time=:now WHERE pod = :pod';
	$statement = $db->prepare($query);
	$statement->execute(['now' => time(), 'pod' => $pod]);
}




/**
 * Function to lock a file.
 *
 * @param   string  $file               File to lock
 * @return  bool                        True if locked
 */
function lockFile($file)
{
	$timeout = TIMEOUT * 1000000;
	$locked = False;

	while ($timeout > 0) {
		if (file_exists($file . '.lock')) {
			// File is locked, wait for a random interval
			$wait = 1000 * rand(0, 500);
			$timeout = $timeout - $wait;
			usleep($wait);
		} else {
			$locked = True;
			touch($file . '.lock');
			break;
		}
	}

	if (!$locked) unlockFile($file);

	return true;
}

/**
 * Function to unlock a file.
 *
 * @param   string  $file               File to lock
 * @return  bool                        True if unlocked
 */
function unlockFile($file)
{
	if (is_file($file . '.lock')) {
		return unlink($file . '.lock');
	}
	return true;
}


function lockSession($labSession)
{
	$timeout = TIMEOUT * 1000000;
	$locked = False;
	$file = BASE_LAB . '/'.$labSession.'.lock';

	while ($timeout > 0) {
		if (file_exists($file)) {
			$wait = 1000 * rand(0, 500);
			$timeout = $timeout - $wait;
			usleep($wait);
		} else {
			$locked = True;
			touch($file);
			break;
		}
	}

	if (!$locked) unlockSession($labSession);

	return true;
}

/**
 * Function to unlock a file.
 *
 * @param   string  $file               File to lock
 * @return  bool                        True if unlocked
 */
function unlockSession($labSession)
{
	$file = BASE_LAB . '/'.$labSession.'.lock';
	if (is_file($file)) {
		return unlink($file);
	}
	return true;
}


function Ctrl_get($name, $default=''){
	try {
		$db = checkDatabase();
		$query = 'SELECT * FROM control WHERE control_name=:control_name';
		$statement = $db->prepare($query);
		$statement->execute(['control_name' => $name]);
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		if (isset($result[0])) {
			return $result[0][CONTROL_VALUE];
		} else {
			return $default;
		}
	} catch (Exception $th) {
		return $default;
	}
}


/**
 * Function to update user session (expiration).
 *
 * @param   PDO     $db                 PDO object for database connection
 * @param   string  $username           Username
 * @param   string  $cookie             Session cookie
 * @return  0                           0 means ok
 */
function updateUserCookie($db, $username, $cookie)
{
	try {
		$ip = $_SERVER['REMOTE_ADDR'];
		$now = time() + SESSION;
		$query = 'UPDATE users SET cookie = :cookie, session = :session, ip = :ip WHERE username = :username;';
		$statement = $db->prepare($query);
		$statement->bindParam(':cookie', $cookie, PDO::PARAM_STR);
		$statement->bindParam(':session', $now, PDO::PARAM_INT);
		$statement->bindParam(':username', $username, PDO::PARAM_STR);
		$statement->bindParam(':ip', $ip, PDO::PARAM_STR);
		$statement->execute();
		return 0;
	} catch (Exception $e) {
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][90017]);
		error_log(date('M d H:i:s ') . (string) $e);
		return 90017;
	}
}

/**
 * Function to update user folder.
 *
 * @param   PDO     $db                 PDO object for database connection
 * @param   string  $cookie             Session cookie
 * @param   string  $folder             Last seen folder
 * @return  0                           0 means ok
 */
function updateUserFolder($pod, $folder)
{
	try {
		$db=checkDatabase();
		$query = 'UPDATE users SET folder = :folder WHERE pod = :pod;';
		$statement = $db->prepare($query);
		$statement->bindParam(':pod', $pod, PDO::PARAM_STR);
		$statement->bindParam(':folder', $folder, PDO::PARAM_STR);
		$statement->execute();
		return 0;
	} catch (Exception $e) {
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][90033]);
		error_log(date('M d H:i:s ') . (string) $e);
		return 90033;
	}
}

/**
 * Function to update POD lab.
 *
 * @param   PDO     $db                 PDO object for database connection
 * @param   string  $cookie             Session cookie
 * @param   string  $lab				Running lab
 * @return  0                           0 means ok
 */


function html5_checkDatabase()
{
	// Database connection
	try {
		//$db = new PDO('sqlite:'.DATABASE);
		$db = new PDO('mysql:host=127.0.0.1;dbname=guacdb', 'guacuser', 'pnetlab');
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		return $db;
	} catch (Exception $e) {
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][90003]);
		error_log(date('M d H:i:s ') . (string) $e);
		return False;
	}
}


function html5AddSession($db, $name, $type, $port, $userid, $hostname = null, $servicePort = null, $username = null, $password = null, $onresize = null)
{
	if ($servicePort === null) $servicePort = $port;
	if ($hostname === null) $hostname = '127.0.0.1';
	
	$connectionId = $port.$userid;

	$query = "delete from guacamole_connection where connection_id=:connection_id";
	$statement = $db->prepare($query);
	$statement->execute(['connection_id'=>$connectionId]);

	$query = "replace into guacamole_connection ( connection_id , connection_name , protocol ) values ( " . $connectionId . ",'" . $name . "','" . $type . "');";
	$statement = $db->prepare($query);
	$statement->execute();

	$query = "replace into guacamole_connection_permission ( entity_id, connection_id, permission ) values ( " . ($userid + 1000) . " , " . $connectionId . ", 'READ' );";
	$statement = $db->prepare($query);
	$statement->execute();

	$connectionData = [
		
		"( " . $connectionId . ",'ignore-cert','true' )",
		"( " . $connectionId . ", 'hostname', '".$hostname."' )",
		"( " . $connectionId . ", 'port', '".$servicePort."' )",
		"( " . $connectionId . ",'create-drive-path','true' )",
		"( " . $connectionId . ",'enable-drive','true' )",
		"( " . $connectionId . ",'enable-printing','false' )",
		"( " . $connectionId . ",'drive-path','/tmp/" . $connectionId . "' )",
		
	];

	if ($password != null && $username != null) {
		$connectionData[] = "( " . $connectionId . ",'disable-auth','false' )";
		$connectionData[] = "( " . $connectionId . ",'username', '".$username."' )";
		$connectionData[] = "( " . $connectionId . ",'password', '".$password."' )";
		$connectionData[] = "( " . $connectionId . ",'security', 'any' )";

		if ($onresize != null) {
			$connectionData[] = "( " . $connectionId . ",'resize-method', '".$onresize."' )";
		}

	}else{
		$connectionData[] = "( " . $connectionId . ",'disable-auth','true' )";
	}

	if($type == 'rdp'){
		$connectionData[] = "( " . $connectionId . ",'disable-glyph-caching', 'true' )";
	}

	$query = "insert into guacamole_connection_parameter ( connection_id , parameter_name , parameter_value ) values ". implode(',', $connectionData);
	$statement = $db->prepare($query);
	$statement->execute();
	
}

function updateUserToken($username, $password, $pod)
{
	$url = 'http://127.0.0.1/html5/api/tokens';
	$data = array('username' => $username, 'password' => $password);
	
	$options = array(
		'http' => array(
			'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
			'method'  => 'POST',
			'content' => http_build_query($data),
		)
	);

	$context  = stream_context_create($options);
	$result = (array) json_decode(file_get_contents($url, false, $context));
	
	$db = checkDatabase();
	$token = $result['authToken'];
	$query = "delete from html5 where username = '" . $username . "';";
	$statement = $db->prepare($query);
	$statement->execute();
	$query = "delete from html5 where pod = '" . $pod . "';";
	$statement = $db->prepare($query);
	$statement->execute();
	$query = "replace into html5 ( username , pod, token ) values ( '" . $username . "','" . $pod . "','" . $token . "');";
	$statement = $db->prepare($query);
	$statement->execute();
}

function getHtml5Token($userid)
{
	$db = checkDatabase();
	$query = "select token from html5 where pod = " . $userid . " ;";
	$statement = $db->prepare($query);
	$statement->execute();
	$result = $statement->fetch();
	return $result['token'];
}


function style_to_object($style)
{
	$return = array();
	$divstyle = explode(";", $style);
	array_pop($divstyle);
	foreach ($divstyle as $param) {
		$key = trim(explode(":", $param)[0]);
		$value = trim(explode(":", $param)[1]);
		$return[$key] = $value;
	}
	return $return;
}
function data_to_textobjattr($data)
{
	$return = array();
	$text = "";
	$dom = new DOMDocument();
	if (preg_match("/style/i", $data)) {
		$dom->loadHTML(htmlspecialchars_decode($data));
	} else {
		if (preg_match("/RECT/i", base64_decode($data))) {
			// OLD RECT STYLE 
			return -1;
		}
		$dom->loadHTML(base64_decode($data));
	}
	$pstyle = style_to_object($dom->documentElement->getElementsByTagName("div")->item(0)->getAttribute("style"));
	$doc = $dom->documentElement->getElementsByTagName("p")->item(0);
	$childs = $doc->childNodes;
	for ($i = 0; $i < $childs->length; $i++) {
		$text .= $dom->saveXML($childs->item($i));
	}
	$tstyle = style_to_object($dom->documentElement->getElementsByTagName("p")->item(0)->getAttribute("style"));
	$return['text'] = $text;
	$return['top'] = preg_replace('/px/', '', $pstyle['top']);
	$return['left'] = preg_replace('/px/', '', $pstyle['left']);
	$return['fontColor'] = $tstyle['color'];
	$return['fontWeight'] = $tstyle['font-weight'];
	$return['bgColor'] = $tstyle['background-color'];
	$return['fontSize'] = preg_replace('/px/', '', $tstyle['font-size']);
	$return['zindex'] = $pstyle['z-index'];
	if (isset($pstyle['transform'])) {
		$return['transform'] = $pstyle['transform'];
	} else {
		$return['transform'] = "rotate(0deg)";
	}
	return $return;
}
function dataToCircleAttr($data)
{
	$return = array();
	$p = xml_parser_create();
	if (preg_match("/style/i", $data)) {
		xml_parse_into_struct($p, htmlspecialchars_decode($data), $vals, $index);
	} else {
		xml_parse_into_struct($p, base64_decode($data), $vals, $index);
	}
	$svg = $vals[$index["SVG"][0]];
	$style = (style_to_object($vals[$index["DIV"][0]]["attributes"]["STYLE"]));
	$circle = $vals[$index["ELLIPSE"][0]];
	$return["borderWidth"] = $circle["attributes"]["STROKE-WIDTH"];
	$return["stroke"] = $circle["attributes"]["STROKE"];
	$return["bgcolor"] = $circle["attributes"]["FILL"];
	$return["cx"] = $circle["attributes"]["CX"];
	$return["cy"] = $circle["attributes"]["CY"];
	$return["rx"] = $circle["attributes"]["RX"];
	$return["ry"] = $circle["attributes"]["RY"];
	$return['top'] = preg_replace('/px/', '', $style['top']);
	$return['left'] = preg_replace('/px/', '', $style['left']);
	$return['width'] = preg_replace('/px/', '', $style['width']);
	$return['height'] = preg_replace('/px/', '', $style['height']);
	$return['svgWidth'] = $svg["attributes"]["WIDTH"];
	$return['svgHeight'] = $svg["attributes"]["HEIGHT"];
	$return['zindex'] = $style['z-index'];
	if (isset($circle["attributes"]["STROKE-DASHARRAY"])) {
		$return["strokeDashArray"] = $circle["attributes"]["STROKE-DASHARRAY"];
	} else {
		$return["strokeDashArray"] = "0,0";
	}
	if (isset($style['transform'])) {
		$return['transform'] = $style['transform'];
	} else {
		$return['transform'] = "rotate(0deg)";
	}
	return $return;
}
function datatoSquareAttr($data)
{
	$return = array();
	$p = xml_parser_create();
	if (preg_match("/style/i", $data)) {
		xml_parse_into_struct($p, preg_replace('/"=""/', '', htmlspecialchars_decode($data)), $vals, $index);
	} else {
		xml_parse_into_struct($p, preg_replace('/"=""/', '', base64_decode($data)), $vals, $index);
	}
	$svg = $vals[$index["SVG"][0]];
	$square = $vals[$index["RECT"][0]];
	$style = (style_to_object($vals[$index["DIV"][0]]["attributes"]["STYLE"]));
	$return['top'] = preg_replace('/px/', '', $style['top']);
	$return['left'] = preg_replace('/px/', '', $style['left']);
	$return['width'] = preg_replace('/px/', '', $style['width']);
	$return['height'] = preg_replace('/px/', '', $style['height']);
	$return['svgWidth'] = $svg["attributes"]["WIDTH"];
	$return['svgHeight'] = $svg["attributes"]["HEIGHT"];
	$return['zindex'] = $style['z-index'];
	$return["stroke"] = $square["attributes"]["STROKE"];
	if (isset($square["attributes"]["STROKE-DASHARRAY"])) {
		$return["strokeDashArray"] = $square["attributes"]["STROKE-DASHARRAY"];
	} else {
		$return["strokeDashArray"] = "0,0";
	}
	$return["borderWidth"] = $square["attributes"]["STROKE-WIDTH"];
	$return["bgcolor"] = $square["attributes"]["FILL"];
	if (isset($style['transform'])) {
		$return['transform'] = $style['transform'];
	} else {
		$return['transform'] = "rotate(0deg)";
	}
	return $return;
}

/** EVE_STORE Whireshark */

function getDockerIp()
{
	$cmd = 'ifconfig docker0 | grep inet';
	exec($cmd, $o, $rc);
	foreach ($o as $line) {
		if (preg_match('/inet\s(addr:)?(?<ip>[0-9]+.[0-9]+.[0-9]+.[0-9]+)/', $line, $matches)) {
			return $matches['ip'];
		}
	}
	return '';
}

function getWiresharkPort($db)
{
	$query = 'SELECT ws_port FROM wiresharks';
	$statement = $db->prepare($query);
	$statement->execute();
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);
	$portColumn = array_column($result, 'ws_port', 'ws_port');
	$basePort = 60000;
	$port = $basePort + count($portColumn);
	while (isset($portColumn[$port])) {
		$port++;
	}
	return $port;
}

function addWireshark($lab, $node_id, $interface_id)
{
	if ($interface_id === '' || $node_id === '') throw new Exception('Missing data');
	$lab_session = $lab->getSession();
	if ($lab_session == null) throw new Exception('No Lab Session');

	$tenant = $lab->getTenant();

	$db=checkDatabase();

	$query = 'SELECT * FROM wiresharks WHERE ws_tenant=:ws_tenant AND ws_lab=:ws_lab AND ws_node=:ws_node AND ws_if=:ws_if';
	$statement = $db->prepare($query);
	$statement->execute([
		'ws_tenant' => $tenant,
		'ws_lab' => $lab_session,
		'ws_node' => $node_id,
		'ws_if' => $interface_id,
	]);

	$result = $statement->fetchAll(PDO::FETCH_ASSOC);
	if (count($result) == 0) {

		$node = $lab->getNodes()[$node_id];
		if (!$node) throw new Exception('Undefine node');
		$interface = $node->getInterfaces()[$interface_id];
		if (!$interface) throw new Exception('Undefine Interface');

		$network_id = $interface->getNetworkId();
		$node_name = $node->getName();
		$interface_name = $interface->getName();
		$uniqueId = $tenant . '_' . $lab_session . '_' . $node_id . '_' . $interface_id;
		$dockerName = 'Capture_' . $uniqueId;
		$port = getWiresharkPort($db);
		$oct4 = $port % 255;
		$oct3 = 200 + floor($port / 255) % 55;

		$dockerIp = getDockerIp();
		$dockerIp = explode('.', trim($dockerIp));

		$oct1 = isset($dockerIp[0]) ? $dockerIp[0] : 10;
		$oct2 = isset($dockerIp[1]) ? $dockerIp[1] : 178;

		$ipAddress = $oct1 . '.' . $oct2 . '.' . $oct3 . '.' . $oct4;

		$query = 'INSERT INTO wiresharks (ws_tenant, ws_lab, ws_node, ws_if, ws_net, ws_node_name, ws_if_name, ws_dc_name, ws_port, ws_ip) 
					VALUES (:ws_tenant, :ws_lab, :ws_node, :ws_if, :ws_net, :ws_node_name, :ws_if_name, :ws_dc_name, :ws_port, :ws_ip)';
		$statement = $db->prepare($query);
		$statement->execute([
			'ws_tenant' => $tenant,
			'ws_lab' => $lab_session,
			'ws_node' => $node_id,
			'ws_if' => $interface_id,
			'ws_net' => $network_id,
			'ws_node_name' => $node_name,
			'ws_if_name' => $interface_name,
			'ws_dc_name' => $dockerName,
			'ws_port' => $port,
			'ws_ip' => $ipAddress,
		]);
	}
}

function addWiresharkSystem($lab, $node_id, $interface_id)
{
	secureCmd($node_id);
	secureCmd($interface_id);
	if ($interface_id === '' || $node_id === '') throw new Exception('Missing data');

	$lab_session = $lab->getSession();
	if ($lab_session == null) throw new Exception('No Lab Session');

	$nets = $lab->getNetworks();
	$node = $lab->getNodes()[$node_id];
	if (!$node) throw new Exception('Node is undefined');
	$interface = $node->getInterfaces()[$interface_id];
	if (!$interface) throw new Exception('Interface is undefined');

	$tenant = $lab->getTenant();

	$db=checkDatabase();

	$query = 'SELECT * FROM wiresharks WHERE ws_tenant=:ws_tenant AND ws_lab=:ws_lab AND ws_node=:ws_node AND ws_if=:ws_if';
	$statement = $db->prepare($query);
	$statement->execute([
		'ws_tenant' => $tenant,
		'ws_lab' => $lab_session,
		'ws_node' => $node_id,
		'ws_if' => $interface_id,
	]);

	$result = $statement->fetchAll(PDO::FETCH_ASSOC);
	if (count($result) > 0) {
		$result = $result[0];
		$network_id = $result['ws_net'];
		$node_name = $result['ws_node_name'];
		$interface_name = $result['ws_if_name'];
		$uniqueId = $tenant . '_' . $lab_session . '_' . $node_id . '_' . $interface_id;
		$dockerName = 'Capture_' . $uniqueId;
		$port = $result['ws_port'];
		$ipAddress = $result['ws_ip'];
	} else {
		throw new Exception('Please capture again');
	}

	$connectPort = 3389;

	if (isset($nets[$interface->getNetworkId()]) && $nets[$interface->getNetworkId()]->isCloud()) {
		// Network is a Cloud
		$net_name = $nets[$interface->getNetworkId()]->getNType();
	} else {
		$net_name = 'vnet' . $lab_session . '_' . $interface->getNetworkId();
	}

	// create wireshark docker container.

	$cmd = 'docker -H=tcp://127.0.0.1:4243 container ls -a | grep ' . $dockerName; // Check docker is exist
	$o = [];
	exec($cmd, $o, $rc);

	if (count($o) == 0) {
		$cmd = 'docker -H=tcp://127.0.0.1:4243 create --shm-size 1G --privileged -ti --net=none --name=' . $dockerName . ' -h "' . $node_name . '_' . $interface_name . '" pnetlab/pnet-wireshark';
		exec($cmd, $o, $rc);
	}

	$cmd = 'docker -H=tcp://127.0.0.1:4243 start ' . $dockerName;
	exec($cmd, $o, $rc);

	$cmd = 'docker -H=tcp://127.0.0.1:4243 inspect --format "{{ .State.Pid }}" ' . $dockerName;
	$o = [];
	exec($cmd, $o, $rc);
	$pid = $o[0];

	// Create rdp connection to eth1

	$cmd = 'ip link | grep rdp' . $uniqueId;
	$o = [];
	exec($cmd, $o, $rc);

	if (count($o) == 0) {
		$cmd = 'ip link add rdp' . $uniqueId . ' type veth peer name dc0' . $uniqueId;
		exec($cmd, $o, $rc);
		$cmd = 'ip link set dev rdp' . $uniqueId . ' up';
		exec($cmd, $o, $rc);

		$cmd = 'ip link set dev dc0' . $uniqueId . ' up';
		exec($cmd, $o, $rc);

		// Add eth1 for docker

		$cmd = 'ip link set netns ' . $pid . ' dc0' . $uniqueId . ' name eth1 address ' . '48:' . sprintf('%02x', $lab_session) . ':' . sprintf('%02x', $node_id / 512) . ':' . sprintf('%02x', $node_id % 512) . ':' . sprintf('%02x', $interface_id) . ':' . sprintf('%02x', 1) . ' up';
		exec($cmd, $o, $rc);

		//connect eth1 to docker 0
		$cmd = 'brctl addif docker0 rdp' . $uniqueId;
		exec($cmd, $o, $rc);

		//config ip address eth1
		$cmd = 'sudo /opt/unetlab/wrappers/nsenter -t ' . $pid . ' -n ip addr add ' . $ipAddress . '/16 dev eth1';
		exec($cmd, $o, $rc);

		$cmd = 'sudo /opt/unetlab/wrappers/nsenter -t ' . $pid . ' -n ip route add default via ' . $ipAddress;
		exec($cmd, $o, $rc);

		// // nat rdp port
		// $cmd = 'sudo iptables -t nat -I PREROUTING -p tcp --dport ' . $port . ' -j DNAT --to ' . $ipAddress . ':' . $connectPort;
		// exec($cmd, $o, $rc);

		// $dockerIp = getDockerIp();
		// $cmd = 'sudo iptables -t nat -I POSTROUTING -p tcp -d ' . $ipAddress . ' --dport ' . $connectPort . ' -j SNAT --to ' . $dockerIp;
		// exec($cmd, $o, $rc);
	}

	$cmd = 'ip link | grep span' . $uniqueId;
	$o = [];
	exec($cmd, $o, $rc);

	if (count($o) == 0) {

		$cmd = 'ip link add span' . $uniqueId . ' type veth peer name cap' . $uniqueId;
		exec($cmd, $o, $rc);

		$cmd = 'ip link set dev span' . $uniqueId . ' up';
		exec($cmd, $o, $rc);

		$cmd = 'ip link set dev span' . $uniqueId. ' mtu 9000';
		exec($cmd, $o, $rc);

		$cmd = 'ip link set dev cap' . $uniqueId . ' up';
		exec($cmd, $o, $rc);

		$cmd = 'ip link set dev cap' . $uniqueId. ' mtu 9000';
		exec($cmd, $o, $rc);

		// add capture port to docker 
		$cmd = 'ip link set netns ' . $pid . ' cap' . $uniqueId . ' name eth0 address ' . '48:' . sprintf('%02x', $lab_session) . ':' . sprintf('%02x', $node_id / 512) . ':' . sprintf('%02x', $node_id % 512) . ':' . sprintf('%02x', $interface_id) . ':' . sprintf('%02x', 0) . ' up';
		exec($cmd, $o, $rc);

		// add span port to network need capture
		$cmd = 'brctl addif ' . $net_name . ' span' . $uniqueId;
		exec($cmd, $o, $rc);

		// set age
		$cmd = 'brctl setageing ' . $net_name . ' 0';
		exec($cmd, $o, $rc);
	}


	$html5_db = html5_checkDatabase();

	html5AddSession($html5_db, $dockerName, 'rdp', $port, $tenant, $ipAddress, $connectPort, 'root', LOCAL_PASS, 'reconnect');
	$html5_db = null;
	// addHtml5Perm($port, $tenant);
	$token = getHtml5Token($tenant);
	$b64id = base64_encode($port.$tenant . "\0" . 'c' . "\0" . 'mysql');
	$link = '/html5/#/client/' . $b64id . '?token=' . $token;

	$output = [];
	$output['code'] = 200;
	$output['status'] = 'success';
	$output['message'] = [
		'link' => $link,
		'node' => $node_name,
		'port' => $interface_name,
	];
	return $output;
}



function deleteWireshark($lab, $node_id, $interface_id)
{
	// delete wireshark when user close capture;
	$tenant = $lab->getTenant();
	$lab_session = $lab->getSession();
	if ($lab_session == null) throw new Exception('No Lab Session');

	$db=checkDatabase();

	$query = 'SELECT * FROM wiresharks WHERE ws_tenant=:ws_tenant AND ws_lab=:ws_lab AND ws_node=:ws_node AND ws_if=:ws_if';
	$statement = $db->prepare($query);
	$statement->execute([
		'ws_tenant' => $tenant,
		'ws_lab' => $lab_session,
		'ws_node' => $node_id,
		'ws_if' => $interface_id,
	]);

	$result = $statement->fetchAll(PDO::FETCH_ASSOC);
	if (count($result) > 0) {
		$result = $result[0];
		$port = $result['ws_port'];
		$ipAddress = $result['ws_ip'];
		deleteWiresharkSystem($tenant, $lab_session, $node_id, $interface_id, $port, $ipAddress);
	}

	$query = 'DELETE FROM wiresharks WHERE ws_tenant=:ws_tenant AND ws_lab=:ws_lab AND ws_node=:ws_node AND ws_if=:ws_if';
	$statement = $db->prepare($query);
	$statement->execute([
		'ws_tenant' => $tenant,
		'ws_lab' => $lab_session,
		'ws_node' => $node_id,
		'ws_if' => $interface_id,
	]);
}


function deleteWiresharkSystem($tenant, $lab_session, $node_id, $interface_id, $port, $ipAddress)
{

	$uniqueId = $tenant . '_' . $lab_session . '_' . $node_id . '_' . $interface_id;
	$dockerName = 'Capture_' . $uniqueId;
	$connectPort = 3389;
	// nat rdp port
	$cmd = 'sudo iptables -t nat -D PREROUTING -p tcp --dport ' . $port . ' -j DNAT --to ' . $ipAddress . ':' . $connectPort;
	exec($cmd, $o, $rc);

	$dockerIp = getDockerIp();
	$cmd = 'sudo iptables -t nat -D POSTROUTING -p tcp -d ' . $ipAddress . ' --dport ' . $connectPort . ' -j SNAT --to ' . $dockerIp;
	exec($cmd, $o, $rc);

	// remove rdp connection to eth1
	$cmd = 'ip link delete rdp' . $uniqueId;
	$o = [];
	exec($cmd, $o, $rc);

	// remove span connection to eth1
	$cmd = 'ip link delete span' . $uniqueId;
	$o = [];
	exec($cmd, $o, $rc);

	$cmd = 'docker -H=tcp://127.0.0.1:4243 container stop ' . $dockerName;
	$o = [];
	exec($cmd, $o, $rc);

	$cmd = 'docker -H=tcp://127.0.0.1:4243 container rm ' . $dockerName . ' &';
	$o = [];
	exec($cmd, $o, $rc);

	return true;
}


function deleteWiresharkByNode($db, $lab, $node_id)
{
	// delete wireshark when a node is close, or delete
	$tenant = $lab->getTenant();
	$lab_session = $lab->getSession();
	if ($lab_session == null) throw new Exception('No Lab Session');

	$query = 'SELECT * FROM wiresharks WHERE ws_tenant=:ws_tenant AND ws_lab=:ws_lab AND ws_node=:ws_node';
	$statement = $db->prepare($query);
	$statement->execute([
		'ws_tenant' => $tenant,
		'ws_lab' => $lab_session,
		'ws_node' => $node_id,
	]);

	$result = $statement->fetchAll(PDO::FETCH_ASSOC);
	if (count($result) > 0) {
		foreach ($result as $ws) {
			$port = $ws['ws_port'];
			$ipAddress = $ws['ws_ip'];
			$node_id = $ws['ws_node'];
			$interface_id = $ws['ws_if'];
			deleteWiresharkSystem($tenant, $lab_session, $node_id, $interface_id, $port, $ipAddress);
		}
	}

	$query = 'DELETE FROM wiresharks WHERE ws_tenant=:ws_tenant AND ws_lab=:ws_lab AND ws_node=:ws_node';
	$statement = $db->prepare($query);
	$statement->execute([
		'ws_tenant' => $tenant,
		'ws_lab' => $lab_session,
		'ws_node' => $node_id,
	]);
}

function deleteWiresharkByLab($db, $lab)
{
	// delete wireshark when an user leave lab
	$tenant = $lab->getTenant();
	$lab_session = $lab->getSession();
	if ($lab_session == null) throw new Exception('No Lab Session');

	$query = 'SELECT * FROM wiresharks WHERE ws_tenant=:ws_tenant AND ws_lab=:ws_lab';
	$statement = $db->prepare($query);
	$statement->execute([
		'ws_tenant' => $tenant,
		'ws_lab' => $lab_session,
	]);

	$result = $statement->fetchAll(PDO::FETCH_ASSOC);
	if (count($result) > 0) {
		foreach ($result as $ws) {
			$port = $ws['ws_port'];
			$ipAddress = $ws['ws_ip'];
			$node_id = $ws['ws_node'];
			$interface_id = $ws['ws_if'];
			deleteWiresharkSystem($tenant, $lab_session, $node_id, $interface_id, $port, $ipAddress);
		}
	}

	$query = 'DELETE FROM wiresharks WHERE ws_tenant=:ws_tenant AND ws_lab=:ws_lab';
	$statement = $db->prepare($query);
	$statement->execute([
		'ws_tenant' => $tenant,
		'ws_lab' => $lab_session,
	]);
}

function deleteWiresharkBySession($db, $lab_session)
{
	//delete wireshark when session is destroyed
	if ($lab_session == null) throw new Exception('No Lab Session');

	$query = 'SELECT * FROM wiresharks WHERE ws_lab=:ws_lab';
	$statement = $db->prepare($query);
	$statement->execute([
		'ws_lab' => $lab_session,
	]);

	$result = $statement->fetchAll(PDO::FETCH_ASSOC);
	if (count($result) > 0) {
		foreach ($result as $ws) {
			$port = $ws['ws_port'];
			$ipAddress = $ws['ws_ip'];
			$node_id = $ws['ws_node'];
			$interface_id = $ws['ws_if'];
			$tenant = $ws['ws_tenant'];
			deleteWiresharkSystem($tenant, $lab_session, $node_id, $interface_id, $port, $ipAddress);
		}
	}

	$query = 'DELETE FROM wiresharks WHERE ws_lab=:ws_lab';
	$statement = $db->prepare($query);
	$statement->execute([
		'ws_lab' => $lab_session,
	]);
}




// ==========EVE_STORE workbook ===================//

function array_find($array, $callback)
{
	foreach ($array as $key => $item) {
		if ($callback($item)) {
			return $key;
		}
	}
	return false;
}

function objSort(&$objArray, $indexFunction, $sort_flags = 0)
{
	$indeces = array();
	foreach ($objArray as $obj) {
		$indeces[] = $indexFunction($obj);
	}
	return array_multisort($indeces, $objArray, $sort_flags);
}

if (!function_exists('get')) {
	function get(&$var, $default = null)
	{
		if (!isset($var)) return $default;
		if ($var === null) return $default;
		return $var;
	}
}

/** ============================ */


/** EVE_STORE lab session */

function createLabSession($db)
{
	$query = 'SELECT lab_session_id FROM lab_sessions';
	$statement = $db->prepare($query);
	$statement->execute();
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);
	$idColumn = array_column($result, 'lab_session_id');
	if (count($idColumn) > 0) {
		$id = $idColumn[count($idColumn) - 1];
	} else {
		$id = 1;
	}
	while (array_search($id, $idColumn) !== false) {
		$id++;
	}
	return $id;
}

function replaceLabSessionPath($search, $replacement){
	$db=checkDatabase();
	$query = 'UPDATE lab_sessions SET lab_session_path=REPLACE(lab_session_path, :search, :replacement)';
	$statement = $db->prepare($query);
	$statement->execute([
		"search" => $search,
		"replacement" => $replacement,
	]);
}


function addLabSession($lid, $pod, $labpath)
{
	try {
		//Check if labsession exited
		$db=checkDatabase();
		$query = 'SELECT * FROM lab_sessions WHERE lab_session_lid=:lab_session_lid AND lab_session_pod = :lab_session_pod';
		$statement = $db->prepare($query);
		$statement->execute([
			'lab_session_lid' => $lid,
			'lab_session_pod' => $pod,
		]);

		$result = $statement->fetchAll(PDO::FETCH_ASSOC);

		if (count($result) == 0) {
			lockSession(0);
			$id = createLabSession($db);
			$query = 'INSERT INTO lab_sessions (`lab_session_id`, `lab_session_lid`, `lab_session_pod`, `lab_session_joined`, `lab_session_path`) 
					VALUES (:lab_session_id, :lab_session_lid, :lab_session_pod, :lab_session_joined, :lab_session_path)';
			$statement = $db->prepare($query);
			$statement->execute([
				'lab_session_id' => $id,
				'lab_session_lid' => $lid,
				'lab_session_pod' => $pod,
				'lab_session_joined' => $pod,
				'lab_session_path' => $labpath,
			]);
			unlockSession(0);
			$query = 'UPDATE users SET lab_session = :lab_session WHERE pod = :pod;';
			$statement = $db->prepare($query);
			$statement->execute([
				'lab_session' => $id,
				'pod' => $pod,
			]);
		} else {
			$id = $result[0]['lab_session_id'];
			return joinLabSession($pod, $id);
		}

		return ['result' => true, 'message' => 'Success'];
	} catch (Exception $e) {
		return ['result' => false, 'message' => $e->getMessage()];
	}
}

function joinLabSession($tenant, $lab_session)
{
	try {
		$db=checkDatabase();
		$query = 'SELECT * FROM lab_sessions WHERE lab_session_id=:lab_session_id';
		$statement = $db->prepare($query);
		$statement->execute([
			'lab_session_id' => $lab_session,
		]);

		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		if (!isset($result[0])) throw new Exception('Lab Session not found');
		$labSession = $result[0];

		if ($labSession['lab_session_joined'] == '' || $labSession['lab_session_joined'] == null) {
			$joined = [];
		} else {
			$joined = explode(',', $labSession['lab_session_joined']);
		}

		$index = array_search($tenant, $joined);
		if ($index === false) {
			$joined[] = $tenant;
		}

		$query = 'UPDATE lab_sessions SET lab_session_joined = :lab_session_joined WHERE lab_session_id = :lab_session_id';
		$statement = $db->prepare($query);
		$statement->execute([
			'lab_session_joined' => implode(',', $joined),
			'lab_session_id' => $lab_session,
		]);

		$query = 'UPDATE users SET lab_session = :lab_session WHERE pod = :pod;';
		$statement = $db->prepare($query);
		$statement->execute([
			'lab_session' => $lab_session,
			'pod' => $tenant,
		]);

		return ['result' => true, 'message' => 'Success'];
	} catch (Exception $e) {
		return ['result' => false, 'message' => $e->getMessage()];
	}
}

function leaveLabSession($tenant, $lab)
{
	try {
		$db=checkDatabase();
		$query = 'SELECT * FROM lab_sessions WHERE lab_session_id=:lab_session_id';
		$statement = $db->prepare($query);
		$statement->execute([
			'lab_session_id' => $lab->getSession(),
		]);

		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		if (!isset($result[0])) throw new Exception('Lab Session not found');
		$labSession = $result[0];

		$joined = explode(',', $labSession['lab_session_joined']);
		$index = array_search($tenant, $joined);
		if ($index !== false) {
			array_splice($joined, $index, 1);
		}

		$query = 'UPDATE lab_sessions SET lab_session_joined = :lab_session_joined WHERE lab_session_id = :lab_session_id';
		$statement = $db->prepare($query);
		$statement->execute([
			'lab_session_joined' => implode(',', $joined),
			'lab_session_id' => $lab->getSession(),
		]);

		$query = 'UPDATE users SET lab_session = :lab_session WHERE pod = :pod;';
		$statement = $db->prepare($query);
		$statement->execute([
			'lab_session' => null,
			'pod' => $tenant,
		]);

		deleteWiresharkByLab($db, $lab);

		return ['result' => true, 'message' => 'Success'];
	} catch (Exception $e) {
		return ['result' => false, 'message' => $e->getMessage()];
	}
}

function emptyLabSession($tenant)
{
	$db = checkDatabase();
	$query = 'UPDATE users SET lab_session = :lab_session WHERE pod = :pod;';
	$statement = $db->prepare($query);
	$statement->execute([
		'lab_session' => null,
		'pod' => $tenant,
	]);
}

function destroyLabSession($lab)
{
	try {
		$db=checkDatabase();
		deleteWiresharkBySession($db, $lab->getSession());

		$query = 'SELECT * FROM lab_sessions WHERE lab_session_id=:lab_session_id';
		$statement = $db->prepare($query);
		$statement->execute([
			'lab_session_id' => $lab->getSession(),
		]);

		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		if (!isset($result[0])) throw new Exception('Lab Session not found');

		foreach ($lab->getNodes() as $node) {
			$result = stop($node);
			if ($result != 0) throw new Exception('Fail to Stop Node ' . $node->getName());

			$result = wipe($node);
			if ($result != 0) throw new Exception('Fail to Wipe Node ' . $node->getName());
		}

		$query = 'DELETE FROM node_sessions WHERE node_session_lab = :node_session_lab';
		$statement = $db->prepare($query);
		$statement->execute([
			'node_session_lab' => $lab->getSession(),
		]);

		$query = 'DELETE FROM lab_sessions WHERE lab_session_id = :lab_session_id';
		$statement = $db->prepare($query);
		$statement->execute([
			'lab_session_id' =>  $lab->getSession(),
		]);

		$query = 'UPDATE users SET lab_session = null WHERE lab_session = :lab_session';
		$statement = $db->prepare($query);
		$statement->execute([
			'lab_session' =>  $lab->getSession(),
		]);

		$cmd = 'brctl show | grep vnet' . $lab->getSession() . ' | sed \'s/^\(vnet[0-9]\+_[0-9]\+\).*/\1/g\' | while read line; do sudo ifconfig $line down; sudo brctl delbr $line; done';
		exec($cmd, $o, $rc);

		$cmd = 'sudo rm -rf ' . BASE_TMP . '/' . $lab->getSession();
		exec($cmd, $o, $rc);

		return ['result' => true, 'message' => 'Success'];
	} catch (Exception $e) {
		return ['result' => false, 'message' => $e->getMessage()];
	}
}


function stopLabSession($lab)
{
	// Run when user click on stop all nodes button of lab session
	try {
		$db=checkDatabase();
		deleteWiresharkBySession($db, $lab->getSession());

		$query = 'SELECT * FROM lab_sessions WHERE lab_session_id=:lab_session_id';
		$statement = $db->prepare($query);
		$statement->execute([
			'lab_session_id' => $lab->getSession(),
		]);

		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		if (!isset($result[0])) throw new Exception('Lab Session not found');

		foreach ($lab->getNodes() as $node) {
			$result = stop($node);
			if ($result != 0) throw new Exception('Fail to Stop Node ' . $node->getName());
		}
		
		return ['result' => true, 'message' => 'Success'];
	} catch (Exception $e) {
		return ['result' => false, 'message' => $e->getMessage()];
	}
}

function destroyBrokenLabSession($lab_session)
{
	try {
		$db=checkDatabase();
		deleteWiresharkBySession($db, $lab_session);

		$query = 'SELECT * FROM lab_sessions WHERE lab_session_id=:lab_session_id';
		$statement = $db->prepare($query);
		$statement->execute([
			'lab_session_id' => $lab_session,
		]);

		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		if (!isset($result[0])) throw new Exception('Lab Session not found');

		$query = 'SELECT * FROM node_sessions WHERE node_session_lab=:node_session_lab';
		$statement = $db->prepare($query);
		$statement->execute([
			'node_session_lab' => $lab_session,
		]);

		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		foreach ($result as $node) {
			if ($node['node_session_type'] == 'docker') {
				$cmd = 'sudo docker -H=tcp://127.0.0.1:4243 stop docker' . $node['node_session_id'];
				exec($cmd, $o, $rc);
				$cmd = 'sudo docker -H=tcp://127.0.0.1:4243 rm docker' . $node['node_session_id'];
				exec($cmd, $o, $rc);
			} else {
				$cmd = 'sudo fuser -k -TERM ' . $node['node_session_workspace'] . ' > /dev/null 2>&1';
				exec($cmd, $o, $rc);
			}
		}

		$query = 'DELETE FROM node_sessions WHERE node_session_lab = :node_session_lab';
		$statement = $db->prepare($query);
		$statement->execute([
			'node_session_lab' => $lab_session,
		]);

		$query = 'DELETE FROM lab_sessions WHERE lab_session_id = :lab_session_id';
		$statement = $db->prepare($query);
		$statement->execute([
			'lab_session_id' =>  $lab_session,
		]);

		$query = 'UPDATE users SET lab_session = null WHERE lab_session = :lab_session';
		$statement = $db->prepare($query);
		$statement->execute([
			'lab_session' =>  $lab_session
		]);

		$cmd = 'brctl show | grep vnet' . $lab_session . ' | sed \'s/^\(vnet[0-9]\+_[0-9]\+\).*/\1/g\' | while read line; do sudo ifconfig $line down; sudo brctl delbr $line; done';
		exec($cmd, $o, $rc);

		$cmd = 'sudo rm -rf ' . BASE_TMP . '/' . $lab_session;
		exec($cmd, $o, $rc);

		return ['result' => true, 'message' => 'Success'];
	} catch (Exception $e) {
		return ['result' => false, 'message' => $e->getMessage()];
	}
}

$getLabFromSessionResult = [];
function getLabFromSession($lab_session)
{
	if (!isset($GLOBALS['getLabFromSessionResult'][$lab_session])) {
		$db = checkDatabase();
		$query = 'SELECT * FROM lab_sessions WHERE lab_session_id=:lab_session_id';
		$statement = $db->prepare($query);
		$statement->execute(['lab_session_id' => $lab_session]);
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);

		if (isset($result[0])) {
			$GLOBALS['getLabFromSessionResult'][$lab_session] = $result[0];
		} else {
			$GLOBALS['getLabFromSessionResult'][$lab_session] = null;
		}
	}
	return $GLOBALS['getLabFromSessionResult'][$lab_session];
}


function getAllSessionOfNode($lab_id, $node_id)
{
	$db = checkDatabase();
	$query = 'SELECT * FROM node_sessions LEFT JOIN lab_sessions ON node_session_lab = lab_session_id WHERE node_session_nid=:node_session_nid AND lab_session_lid = :lab_session_lid';
	$statement = $db->prepare($query);
	$statement->execute([
		'node_session_nid' => $node_id,
		'lab_session_lid' => $lab_id,
	]);
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);

	foreach ($result as $key => $nodeSession) {
		$result[$key]['node_session_status'] = getNodeStatus(
			$nodeSession['node_session_id'],
			$nodeSession['node_session_type'],
			$nodeSession['node_session_workspace'],
			$nodeSession['node_session_port']
		);
	}

	return $result;
}

function getAllUser()
{
	$db = checkDatabase();
	$query = 'SELECT * FROM users';
	$statement = $db->prepare($query);
	$statement->execute();
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);
	return $result;
}







/** ======================== */

//==========================



function getNodesStatus($lab_session)
{
	$db = checkDatabase();
	if ($lab_session === null) {
		$query = 'SELECT * FROM node_sessions';
		$statement = $db->prepare($query);
		$statement->execute();
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		foreach ($result as $id => $node) {
			$result[$id]['node_session_status'] = getNodeStatus(
				$node['node_session_id'],
				$node['node_session_type'],
				$node['node_session_workspace'],
				$node['node_session_port']
			);
		}
		return $result;
	} else {
		$query = 'SELECT * FROM node_sessions WHERE node_session_lab=:node_session_lab';
		$statement = $db->prepare($query);
		$statement->execute(['node_session_lab' => $lab_session]);
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		$status = [];
		foreach ($result as $node) {
			$status[$node['node_session_nid']] = getNodeStatus(
				$node['node_session_id'],
				$node['node_session_type'],
				$node['node_session_workspace'],
				$node['node_session_port']
			);
		}
		return $status;
	}
}

function getNodeStatus($session, $type, $running_path, $port)
{
	
	if (!isset($session)) return 0;

	if ($type == 'docker') {
		$cmd = 'docker -H=tcp://127.0.0.1:4243 inspect --format="{{ .State.Running }}" docker' . $session;
		exec($cmd, $o, $rc);
		if ($rc == 0) {
			if ($o[0] == 'true') {
				// Node is running
				if (is_file($running_path . '/.lock')) {
					// Node is running and locked
					return 3;
				} else {
					return 2;
				}
			} else {
				if (is_file($running_path . '/.lock')) {
					// Node is stopped and locked
					return 1;
				} else {
					return 0;
				}
			}
		} else {
			// Instance does not exist
			return 0;
		}
	} else {
		// Need to check if node port is used (netstat + grep doesn't require root privileges)
		$cmd = 'netstat -a -t -n | grep LISTEN | grep :' . $port . ' 2>&1';
		
		exec($cmd, $o, $rc);
		if ($rc == 0) {
			// Console available -> node is running
			if (is_file($running_path . '/.lock')) {
				// Node is running and locked
				return 3;
			} else {
				return 2;
			}
		} else {
			// No console available -> node is stopped
			if (is_file($running_path . '/.lock')) {
				// Node is stopped and locked
				return 1;
			} else {
				return 0;
			}
		}
	}
}

function createRunningPath($lab_session, $node_session)
{
	return BASE_TMP . '/' . $lab_session . '/' . $node_session;
}


function getTemplates()
{

	$templates = $GLOBALS['node_templates'];
	$qemudir = scandir("/opt/unetlab/addons/qemu/");
	$ioldir = scandir("/opt/unetlab/addons/iol/bin/");
	$dyndir = scandir("/opt/unetlab/addons/dynamips/");

	foreach ($templates as $templ => $desc) {
		try {

			if (!is_file(BASE_DIR . '/html/templates/' . $templ . '.yml')) {
				unset($templates[$templ]);
				continue;
			}

			$p = yaml_parse_file(BASE_DIR . '/html/templates/' . $templ . '.yml');
			if (isset($p['description'])) {
				$desc = $p['description'];
			} else {
				$desc = $templ;
			}

			// }
			if(!isset($p['type'])){
				unset($templates[$templ]);
				continue;
			}

			$found = 0;
			if ($p['type'] == "iol") {
				foreach ($ioldir as $dir) {
					if (preg_match("/\.bin/", $dir)  ==  1) {
						$found = 1;
						break;
					}
				}
			}
			if ($p['type'] == 'dynamips') {
				foreach ($dyndir as $dir) {
					if (preg_match("/" . $templ . "/", $dir)  ==  1) {
						$found = 1;
						break;
					}
				}
			}
			if ($templ == "vpcs") {
				$found = 1;
			}

			if($p['type'] == 'docker'){
				if($templ == 'docker'){
					$found = 1;
				}else{
					$cmd = 'docker -H=tcp://127.0.0.1:4243 images | grep "'. $templ. '"';
					exec($cmd, $o, $r);
					if(count($o) > 0) $found = 1;
				}
			}

			foreach ($qemudir as $dir) {
				if (preg_match("/^" . $templ . "-.*/", $dir)  ==  1) {
					$found = 1;
					break;
				}
			}
			if ($found == 0) {
				$templates[$templ] = $desc . TEMPLATE_DISABLED;
			} else {
				$templates[$templ] = $desc;
			}

		}catch (Exception $e){
			throw new ResponseException('Can not load template {data}', ['data' => $templ]);
		}
	}

	return $templates;
}

function scanDirFiles($path)
{
	if (!is_dir($path)) return [];
	$files = [];
	$scaned = scandir($path);
	array_splice($scaned, 0, 2);
	foreach ($scaned as $item) {
		$itemPath = $path . '/' . $item;
		if (is_file($itemPath)) {
			$files[] = $itemPath;
		} else {
			$files = array_merge($files, scanDirFiles($itemPath));
		}
	}
	return $files;
}


/* license helper */
$user = null;
function getUser()
{
	if ($GLOBALS['user'] != null) return $GLOBALS['user'];
	return null;
}

function getLocalPass(){
	if ($GLOBALS['user'] != null) return $GLOBALS['user'][USER_PASSWORD];
	return null;
}

$role = null;
function getRole()
{
	if ($GLOBALS['role'] != null) return $GLOBALS['role'];
	$user = getUser();
	if (!$user) return null;
	$db = checkDatabase();
	$query = 'SELECT * FROM ' . USER_ROLES_TABLE . ' WHERE ' . USER_ROLE_ID . ' = :role';
	$statement = $db->prepare($query);
	$statement->execute([
		'role' => $user['role']
	]);
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);
	if (!isset($result[0])) return null;
	$GLOBALS['role'] = $result[0];
	return $GLOBALS['role'];
}

$getRoleByPod = [];
function getRoleByPod($pod)
{

	if (isset($GLOBALS['getRoleByPod'][$pod])) return $GLOBALS['getRoleByPod'][$pod];

	$user = getUser();
	if (!$user) return null;
	if ($user['pod'] == $pod) {
		$GLOBALS['getRoleByPod'][$pod] = getRole();
		return $GLOBALS['getRoleByPod'][$pod];
	}

	$db = checkDatabase();
	$hostLab = getUserByPod($pod);
	if(!$hostLab) return null;
	$roleID = $hostLab[USER_ROLE];

	$query = 'SELECT * FROM ' . USER_ROLES_TABLE . ' WHERE ' . USER_ROLE_ID . ' = :role';
	$statement = $db->prepare($query);
	$statement->execute([
		'role' => $roleID
	]);
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);
	if (!isset($result[0])) return null;

	$GLOBALS['getRoleByPod'][$pod] = $result[0];
	return $GLOBALS['getRoleByPod'][$pod];
}

$userByPod = [];
function getUserByPod($pod){
	if(!isset($userByPod[$pod])){
		$db = checkDatabase();
		$query = 'SELECT * FROM ' . USERS_TABLE . ' WHERE ' . USER_POD . ' = :pod';
		$statement = $db->prepare($query);
		$statement->execute([
			'pod' => $pod
		]);
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		if (!isset($result[0])) return false;
		$userByPod[$pod] = $result[0];
	}
	return $result[0];
}

function getTotalDisk()
{
	$cmd = 'df -k /';
	exec($cmd, $o, $rc);
	$data = [];
	foreach ($o as $output) {
		if (preg_match('/^.*\s([\d\.]+)\s+([\d\.]+)\s+([\d\.]+)\s+([\d]+)%.*$/mi', $output, $match)) {
			$data['free'] = (int) $match[3];
			$data['used'] = (int) $match[2];
			$data['total'] = (int) $match[1];
			$data['percent'] = (float) $match[4];
		}
	}
	return $data;
}


function checkRunningNodeLimit($pod){
	
	$hostLab = getUserByPod($pod);
	if(!$hostLab) throw new ResponseException('User not exist');
	if($hostLab[USER_ROLE] == 0) return true;

	$checkMaxNode = false;
	if(isset($hostLab[USER_MAX_NODE]) && $hostLab[USER_MAX_NODE] > 0){
		$checkMaxNode = true;
	}
	$checkMaxNodeLab = false;
	if(isset($hostLab[USER_MAX_NODELAB]) && $hostLab[USER_MAX_NODELAB] > 0){
		$checkMaxNodeLab = true;
	}

	if(!$checkMaxNode && !$checkMaxNodeLab) return true;

	$db = checkDatabase();
	$query = 'SELECT COUNT(*) as total_running_node FROM ' . NODE_SESSIONS_TABLE . ' WHERE ' . NODE_SESSION_POD . ' = :pod AND ' . NODE_SESSION_RUNNING . ' = 1';

	$statement = $db->prepare($query);
	$statement->execute([
		'pod' => $pod
	]);
	$result = $statement->fetch(PDO::FETCH_ASSOC);

	$totalRunningNode = $result['total_running_node'];

	if($checkMaxNode){
		if($totalRunningNode >= $hostLab[USER_MAX_NODE]){
			throw new ResponseException('max_running_node_limit', ['data' => $hostLab[USER_MAX_NODE]]);
		}
	}

	if($checkMaxNodeLab){
		if($totalRunningNode >= $hostLab[USER_MAX_NODELAB]){
			throw new ResponseException('max_running_nodelab_limit', ['data' => $hostLab[USER_MAX_NODELAB]]);
		}
	}

	return true;
}

function checkLimit($pod)
{

	$role = getRoleByPod($pod);

	$ramLimit = $role[USER_ROLE_RAM];
	$cpuLimit = $role[USER_ROLE_CPU];
	$hddLimit = $role[USER_ROLE_HDD];

	if ($ramLimit == '' || $ramLimit > 95) $ramLimit = 95;
	if ($cpuLimit == '' || $cpuLimit > 95) $cpuLimit = 95;
	if ($hddLimit == '') {
		$disk = getTotalDisk();
		$totalDisk = isset($disk['total']) ? ($disk['total'] / 1024) : 0;
		$hddLimit = $totalDisk - 512;
	}

	$db = checkDatabase();
	$query = 'SELECT SUM(' . NODE_SESSION_RAM . ') as consume_ram, SUM(' . NODE_SESSION_CPU . ') as consume_cpu, SUM(' . NODE_SESSION_HDD . ') as consume_hdd FROM ' . NODE_SESSIONS_TABLE . ' WHERE ' . NODE_SESSION_POD . ' = :pod';

	$statement = $db->prepare($query);
	$statement->execute([
		'pod' => $pod
	]);
	$result = $statement->fetch(PDO::FETCH_ASSOC);

	$consumeRam = $result['consume_ram'];
	$consumeCpu = $result['consume_cpu'];
	$consumeHdd = $result['consume_hdd'];

	if ($consumeCpu >= $cpuLimit) throw new Exception('Over the threshold:' . $cpuLimit . '% CPU. Please turn off idle Devices');
	if ($consumeRam >= $ramLimit) throw new Exception('Over the threshold:' . $ramLimit . '% RAM. Please turn off idle Devices');
	if ($consumeHdd >= $hddLimit) throw new Exception('Over the threshold:' . $hddLimit . 'MB Hard disk. Please Wipe or Destroy idle Devices and Labs');

	return true;
}



$permission = null;
function getPermission()
{
	if ($GLOBALS['permission'] != null) return $GLOBALS['permission'];
	$role = getRole();
	if (!$role) return null;
	$roleId = $role[USER_ROLE_ID];
	$db = checkDatabase();
	$query = 'SELECT * FROM ' . USER_PERMISSION_TABLE . ' WHERE ' . USER_PER_ROLE . ' = :role_id';
	$statement = $db->prepare($query);
	$statement->execute([
		'role_id' => $roleId
	]);
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);
	$GLOBALS['permission'] = $result;
	return $GLOBALS['permission'];
}

function isAdmin()
{
	$user = getUser();
	if (!$user) return false;
	return (int) $user['role'] === 0;
}

function isOffline()
{
	$user = getUser();
	if (!$user) return false;
	return $user['offline'] == 1;
}

function checkLockLab($lab)
{
	if ($lab->isLock()) throw new Exception('This lab is locked, Please unlock it first');
}


function getSharedFolder()
{
	try {
		$db = checkDatabase();
		$query = 'SELECT * FROM control WHERE control_name=:control_name';
		$statement = $db->prepare($query);
		$statement->execute(['control_name' => CTRL_SHARED]);
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		if (isset($result[0])) {
			return json_decode($result[0][CONTROL_VALUE]);
		} else {
			return [];
		}
	} catch (Exception $th) {
		return [];
	}
}



function checkSharePermission($action)
{
	if (isAdmin()) return true;
	try {
		$db = checkDatabase();
		$query = 'SELECT * FROM control WHERE control_name=:control_name';
		$statement = $db->prepare($query);
		$statement->execute(['control_name' => CTRL_SHARED_PERMISSION]);
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);
		if (isset($result[0])) {
			$permission = json_decode($result[0][CONTROL_VALUE]);
		} else {
			$permission = (object) [];
		}
	} catch (Exception $th) {
		$permission = (object) [];
	}
	if (!isset($permission->{$action})) return false;
	return $permission->{$action};
}


function checkWorkSpace($path, $allowShare = false)
{
	if (isAdmin()) return true;

	$path = str_replace(['//', '.'], ['/', ''], $path);
	if ($path[-1] != '/') $path .= '/';

	if ($allowShare) {
		$sharedFolders = getSharedFolder();
		foreach ($sharedFolders as $sharedFolder) {
			$sharedFolder = preg_replace('/' . preg_quote(BASE_LAB, '/') . '/', '', $sharedFolder, 1);
			if ($sharedFolder[-1] != '/') $sharedFolder .= '/';
			if (strpos($path, $sharedFolder) === 0) return true;
		}
	}

	$workspace = getWorkspace();

	if ($workspace[-1] != '/') $workspace .= '/';
	if (strpos($path, $workspace) === 0) return true;
	throw new Exception('You do not have permission to access folder ' . $path);
}

function getWorkspace()
{
	if (isAdmin()) return '/';

	$role = getRole();
	if ($role == 'null') throw new Exception('You do not have permission');
	$workspace = $role['user_role_workspace'];

	$user = getUser();
	if ($user[USER_WORKSPACE] != null && $user[USER_WORKSPACE] != '') {
		$workspace .= $user[USER_WORKSPACE];
		$workspace = str_replace('//', '/', $workspace);
	}

	if ($workspace[0] != '/') $workspace = '/' . $workspace;

	if (!is_dir(BASE_LAB . $workspace)) {
		mkdir(BASE_LAB . $workspace, 0755, true);
	}

	return $workspace;
}

function checkPermission($action)
{
	if (isAdmin()) return true;
	$permission = getPermission();
	if (!$permission) throw new Exception('You do not have permission');
	foreach ($permission as $item) {
		if ($item[USER_PER_NAME] == $action) return true;
	};
	throw new Exception('You do not have permission');
}

function checkLabPermission($lab, $action)
{
	if (isAdmin()) return true;

	$user = getUser();
	if (!$user) throw new Exception('You do not have permission');

	if ($action == USER_PER_EDIT_LAB) {
		$flag = $lab->getEditable();
		if ($flag == 0) throw new Exception('You do not have permission to Edit this Lab');
		if ($flag == 1) return true;
		$allowes = $lab->getEditableEmails();
		$email = $user['email'];
		$pod = $user['pod'];
		if (array_search($email, $allowes) !== false || array_search($pod, $allowes) !== false) return true;
		throw new Exception('You do not have permission to Edit this Lab');
	} else if ($action == USER_PER_OPEN_LAB) {
		$flag = $lab->getOpenable();
		if ($flag == 0) throw new Exception('You do not have permission to Open this Lab');
		if ($flag == 1) return true;
		$allowes = $lab->getOpenableEmails();
		$email = $user['email'];
		$pod = $user['pod'];
		if (array_search($email, $allowes) !== false || array_search($pod, $allowes) !== false) return true;
		throw new Exception('You do not have permission to Open this Lab');
	} else if ($action == USER_PER_JOIN_LAB) {
		$flag = $lab->getJoinable();
		if ($flag == 0) throw new Exception('You do not have permission to Join this Lab');
		if ($flag == 1) return true;
		$allowes = $lab->getJoinableEmails();
		$email = $user['email'];
		$pod = $user['pod'];
		if (array_search($email, $allowes) !== false || array_search($pod, $allowes) !== false) return true;
		throw new Exception('You do not have permission to Join this Lab');
	}
	throw new Exception('You do not have permission');
}

function checkDestroy($lab_session)
{
	if (isAdmin()) return true;
	$user = getUser();
	if (!$user) throw new Exception('You do not have permission');
	$labSession = getLabFromSession($lab_session);
	if (!$lab_session) throw new Exception('You do not have permission');
	if ($labSession['lab_session_pod'] == $user['pod']) {
		return true;
	}
	throw new Exception('Only Admin or Host can destroy the Lab Session');
}

function checkStopNodes($lab_session)
{
	// Function check before user click on stop all nodes
	if (isAdmin()) return true;
	$user = getUser();
	if (!$user) throw new Exception('You do not have permission');
	$labSession = getLabFromSession($lab_session);
	if (!$lab_session) throw new Exception('You do not have permission');
	if ($labSession['lab_session_pod'] == $user['pod']) {
		return true;
	}
	throw new Exception('Only Admin or Host can Stop this Lab Session');
}

function loadLanguage($lang)
{
	if(!isset($lang) || $lang == ''){
		$lang  = Ctrl_get(CTRL_DEFAULT_LANG, 'English');
	}
	if($lang == '') $lang = "English";
	$LANGDIR = '/opt/unetlab/html/language';
	$langPackes = scandir($LANGDIR);
	array_splice($langPackes, 0, 2);
	$langData = [];
	$log = 'Load language packages successfull';
	if (is_dir($LANGDIR . '/' . $lang)) {
		$langFiles = scandir($LANGDIR . '/' . $lang);
		array_splice($langFiles, 0, 2);
		
		foreach ($langFiles as $file) {
			try {
				$fileContent = file_get_contents($LANGDIR . '/' . $lang . '/' . $file);
				$data = json_decode($fileContent, true);
				$langData = array_merge($langData, $data);
			} catch (\Exception $th) {
				$log = '[Warning] Load language package faild: '. $lang . '/' . $file;
			}
		}
	}
	return ['packages' => $langPackes,  'language' => $lang, 'data' => (object) $langData, 'log'=>$log];
}


function secureCmd($cmd){
	$re = '/[#;|&]|\.{2,}/m';
	if(preg_match($re, $cmd, $matches)){
		print_r($matches);
		throw new Exception("The command contains dangerous characters [" . join(" ", $matches) . "]");
	}
	return $cmd;
}



/** ========EVE_STORE ==================*/
