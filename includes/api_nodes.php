<?php
# vim: syntax=php tabstop=4 softtabstop=0 noexpandtab laststatus=1 ruler

/**
 * html/includes/api_nodes.php
 *
 * Nodes related functions for REST APIs.
 *
 * @author Andrea Dainese <andrea.dainese@gmail.com>
 * @copyright 2014-2016 Andrea Dainese
 * @license BSD-3-Clause https://github.com/dainok/unetlab/blob/master/LICENSE
 * @link http://www.unetlab.com/
 * @version 20160719
 */

/**
 * Function to add a node to a lab.
 *
 * @param   Lab     $lab                Lab
 * @param   Array   $p                  Parameters
 * @param   bool    $o                  True if need to add ID to name
 * @return  Array                       Return code (JSend data)
 */
function apiAddLabNode($lab, $p, $o)
{
	if (isset($p['numberNodes']))
		$numberNodes = $p['numberNodes'];

	$default_name = $p['name'];
	if ($default_name == "R")
		$o = True;

	$ids = array();
	$no_array = false;
	$initLeft = (int)$p['left'];
	$initTop = (int)$p['top'];
	if (!isset($numberNodes)) {
		$numberNodes = 1;
		$no_array = true;
	}
	for ($i = 1; $i <= $numberNodes; $i++) {
		if ($i > 1) {
			$p['left'] =  $initLeft + (($i - 1) % 5)   * 60;
			$p['top'] =  $initTop + (intval(($i - 1) / 5)  * 80);
		}
		$id = $lab->getFreeNodeId();
		//if ( $id > 127 ) { $rc = 20046 ;  break ;} 
		// Adding node_id to node_name if required
		if ($o == True && $default_name || $numberNodes > 1) $p['name'] = $default_name . $lab->getFreeNodeId();

		// Adding the node
		$rc = $lab->addNode($p);
		$ids[] = $id;
	}
	if ($rc === 0) {

		$output['code'] = 201;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][60023];

		$data = apiGetLabNodes($lab, getUser()['html5']);
		if ($data['status'] == 'success') {
			$data = $data['data'];
			$output['update'] = ['nodes' => $data];
		}
	} else {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][$rc];
	}
	return $output;
}

/**
 * Function to delete a lab node.
 *
 * @param   Lab     $lab                Lab
 * @param   int     $id                 Node ID
 * @return  Array                       Return code (JSend data)
 */
function apiDeleteLabNode($lab, $id, $tenant)
{
	// Delete all tmp files for the node

	$users = getAllUser();
	$userPod = [];
	foreach ($users as $user) {
		$userPod[$user['pod']] = $user;
	}

	$nodeSessions = getAllSessionOfNode($lab->getId(), $id);

	$using = [];
	foreach ($nodeSessions as $nodeSession) {
		if ($nodeSession['node_session_status'] == 2 || $nodeSession['node_session_status'] == 3) {
			$using[] = $userPod[$nodeSession['lab_session_pod']]['username'];
		}
	}

	if (count($using) > 0) {
		throw new ResponseException('node_session_running_alert', ['data' => implode(', ', $using)]);
	}

	$cmd = 'sudo /opt/unetlab/wrappers/unl_wrapper';
	$cmd .= ' -a delete';
	$cmd .= ' -T ' . $tenant;
	$cmd .= ' -S ' . $lab->getSession();
	$cmd .= ' -D ' . $id;
	$cmd .= ' -F "' . $lab->getPath() . '/' . $lab->getFilename() . '"';
	$cmd .= ' 2>> /opt/unetlab/data/Logs/unl_wrapper.txt';
	secureCmd($cmd);
	exec($cmd, $o, $rc);
	error_log(date('M d H:i:s ') . 'INFO: delete node ' . $cmd);

	// Deleting the node
	$rc = $lab->deleteNode($id);
	if ($rc === 0) {

		$output['code'] = 201;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][60023];

		$data = apiGetLabNodes($lab, getUser()['html5']);
		if ($data['status'] == 'success') {
			$data = $data['data'];
			$output['update'] = ['nodes' => $data];
		}
	} else {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][$rc];
	}
	return $output;
}

/**
 * Function to edit a lab node.
 *
 * @param   Lab     $lab                Lab
 * @param   Array   $p                  Parameters
 * @return  Array                       Return code (JSend data)
 */
function apiEditLabNode($lab, $p)
{

	// Edit node
	$rc = $lab->editNode($p);

	if ($rc === 0) {


		$output['code'] = 201;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][60023];

		$data = apiGetLabNodes($lab, getUser()['html5']);
		if ($data['status'] == 'success') {
			$data = $data['data'];
			$output['update'] = ['nodes' => $data];
		}
	} else {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][$rc];
	}
	return $output;
}
/**
 * Function to edit multiple lab node.
 *
 * @param   Lab     $lab                Lab
 * @param   Array   $p                  Parameters
 * @return  Array                       Return code (JSend data)
 */
function apiEditLabNodes($lab, $p)
{
	// Edit node
	//$rc=$lab -> editNode
	foreach ($p as $node) {
		$node['save'] = 0;
		$rc = $lab->editNode($node);
	}
	$rc = $lab->save();
	if ($rc === 0) {


		$output['code'] = 201;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][60023];

		$data = apiGetLabNodes($lab, getUser()['html5']);
		if ($data['status'] == 'success') {
			$data = $data['data'];
			$output['update'] = ['nodes' => $data];
		}
	} else {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][$rc];
	}
	return $output;
}
/**
 * Function to export a single node.
 *
 * @param   Lab     $lab                Lab
 * @param   int     $id                 Node ID
 * @param   int     $tenant             Tenant ID
 * @return  Array                       Return code (JSend data)
 */
function apiExportLabNode($lab, $id, $tenant)
{
	$cmd = 'sudo /opt/unetlab/wrappers/unl_wrapper';
	$cmd .= ' -a export';
	$cmd .= ' -T ' . $tenant;
	$cmd .= ' -S ' . $lab->getSession();
	$cmd .= ' -D ' . $id;
	$cmd .= ' -F "' . $lab->getPath() . '/' . $lab->getFilename() . '"';
	$cmd .= ' 2>> /opt/unetlab/data/Logs/unl_wrapper.txt';
	secureCmd($cmd);
	exec($cmd, $o, $rc);
	error_log(date('M d H:i:s ') . 'INFO: export configuration ' . $cmd);
	if ($rc == 0) {
		// Config exported
		$output['code'] = 200;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][80058];
	} else {
		// Failed to export
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][$rc];
	}
	return $output;
}

/**
 * Function to export all nodes.
 *
 * @param   Lab     $lab                Lab
 * @param   int     $tenant             Tenant ID
 * @return  Array                       Return code (JSend data)
 */
function apiExportLabNodes($lab, $tenant)
{
	$cmd = 'sudo /opt/unetlab/wrappers/unl_wrapper';
	$cmd .= ' -a export';
	$cmd .= ' -T ' . $tenant;
	$cmd .= ' -S ' . $lab->getSession();
	$cmd .= ' -F "' . $lab->getPath() . '/' . $lab->getFilename() . '"';
	$cmd .= ' 2>> /opt/unetlab/data/Logs/unl_wrapper.txt';
	secureCmd($cmd);
	exec($cmd, $o, $rc);
	error_log(date('M d H:i:s ') . 'INFO: export configuration ' . $cmd);
	if ($rc == 0) {
		// Nodes started
		$output['code'] = 200;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][80057];
	} else {
		// Failed to start
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][$rc];
	}
	return $output;
}

/*
 * Function to get a single lab node.
 *
 * @param   Lab     $lab                Lab
 * @param   int     $id                 Node ID
 * @param   Array   $p                  Parameters
 * @return  Array                       Lab node (JSend data)
 */
function apiEditLabNodeInterfaces($lab, $id, $p)
{
	// Edit node interfaces
	$rc = $lab->connectNode($id, $p);

	if ($rc === 0) {
		$output['code'] = 200;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][60023];
	} else if ($rc === 1) { // EVE_STORE hot link
		$output['code'] = 200;
		$output['status'] = 'success';
		$output['message'] = 'Reload related device to get effect';
	} else {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = isset($GLOBALS['messages'][$rc]) ? $GLOBALS['messages'][$rc] : $rc;
	}
	return $output;
}

/**
 * Function to get a single lab node.
 *
 * @param   Lab     $lab                Lab
 * @param   int     $id                 Node ID
 * @return  Array                       Lab node (JSend data)
 */
function apiGetLabNode($lab, $id, $html5)
{
	// Getting node
	if (isset($lab->getNodes()[$id])) {
		$node = $lab->getNodes()[$id];

		// Printing node
		$output['code'] = 200;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][60025];
		$output['data'] = array(
			'id' => $id,
			'status' => $node->getStatus(),
			'template' => $node->getTemplate(),
			'type' => $node->getNType(),
			'url' => $node->getConsoleUrl($html5),
			'url_2nd' => $node->getSecondConsoleUrl($html5),
			'session' => $node->getSession(),
			'port' => $node->getPort(),
		);

		$options = $node->getOptions();
		foreach ($options as $key => $value) {
			$output['data'][$key] = get($value, '');
		}
	} else {
		// Node not found
		$output['code'] = 404;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][20024];
	}
	return $output;
}

/**
 * Function to get all lab nodes.
 *
 * @param   Lab     $lab                Lab
 * @return  Array                       Lab nodes (JSend data)
 */
function apiGetLabNodes($lab, $html5)
{
	// Getting node(s)
	$nodes = $lab->getNodes();
	// Printing nodes
	$output['code'] = 200;
	$output['status'] = 'success';
	$output['message'] = $GLOBALS['messages'][60026];
	$output['data'] = array();
	if (!empty($nodes)) {
		foreach ($nodes as $node_id => $node) {
			$nodeData = array(
				'id' => $node_id,
				'status' => $node->getStatus(),
				'template' => $node->getTemplate(),
				'type' => $node->getNType(),
				'url' => $node->getConsoleUrl($html5),
				'url_2nd' => $node->getSecondConsoleUrl($html5),
				'port' => $node->getPort(),
				'session' => $node->getSession(),

			);
			$options = $node->getOptions();
			foreach ($options as $key => $value) {
				if ($key == 'config_data' || $key == 'multi_config') continue;
				$nodeData[$key] = get($value, '');
			}

			$nodeData['serials'] = [];
			$nodeData['ethernets'] = [];

			$ethernets = $node->getEthernets();
			foreach ($ethernets as $interface_id => $interface) {
				$nodeData['ethernets'][$interface_id] = [
					'id' => $interface_id,
					'name' => $interface->getName(),
					'network_id' => $interface->getNetworkId(),
					'quality' => (object)$interface->getQuality(),
					'suspend' => $interface->getSuspendStatus(),
					'style' => $interface->getInterfaceStyle(),
				];
			}

			$serials = $node->getSerials();
			foreach ($serials as $interface_id => $interface) {
				$nodeData['serials'][$interface_id] = [
					'id' => $interface_id,
					'name' => $interface->getName(),
					'style' => $interface->getInterfaceStyle(),
					'remote_id' => $interface->getRemoteId(),
					'remote_if' => $interface->getRemoteIf()
				];
			}

			$nodeData['serials'] = (object)$nodeData['serials'];
			$nodeData['ethernets'] = (object)$nodeData['ethernets'];

			$output['data'][$node_id] = $nodeData;
		}
	}

	return $output;
}

/**
 * Function to get all node interfaces.
 *
 * @param   Lab     $lab                Lab
 * @param   int     $id                 Node ID
 * @return  Array                       Node interfaces (JSend data)
 */
function apiGetLabNodeInterfaces($lab, $id)
{
	// Getting node
	if (isset($lab->getNodes()[$id])) {
		$node = $lab->getNodes()[$id];

		// Printing node
		$output['code'] = 200;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][60025];
		$output['data'] = array();
		// Addint node type to properly sort IOL interfaces
		$output['data']['id'] = (int) $id;
		$output['data']['sort'] = $node->getNType();

		// Getting interfaces
		$ethernets = array();
		foreach ($node->getEthernets() as $interface_id => $interface) {
			$ethernets[$interface_id] = array(
				'name' => $interface->getName(),
				'network_id' => $interface->getNetworkId(),
				'type' => 'ethernet',
				'source' => 'node' . $id,
				'source_type' => 'node',
				'source_label' => $interface->getName(),
				'source_quality' => (object)$interface->getQuality(),
				'destination' => 'network' . $interface->getNetworkId(),
				'destination_type' => 'network',
				'destination_label' => '',
				'style' => $interface->getStyle(),
				'linkstyle' => $interface->getLinkstyle(),
				'color' => $interface->getColor(),
				'label' => $interface->getLabel(),
				'linkcfg' => $interface->getLinkcfg(),
				'labelpos' => $interface->getLabelpos(),
				'dstpos' => $interface->getDstpos(),
				'srcpos' => $interface->getSrcpos(),

			);
		}
		$serials = array();
		foreach ($node->getSerials() as $interface_id => $interface) {
			try {
				$remoteId = $interface->getRemoteId();
				$remoteIf = $interface->getRemoteIf();
				$serials[$interface_id] = array(
					'name' => $interface->getName(),
					'remote_id' => $remoteId,
					'remote_if' => $remoteIf,
					'remote_if_name' => $remoteId ? $lab->getNodes()[$remoteId]->getSerials()[$remoteIf]->getName() : '',
				);
			} catch (Exception $e) {
			}
		}

		$output['data']['ethernet'] = (object) $ethernets;
		$output['data']['serial'] = (object) $serials;

		$output['code'] = 200;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][60030];
	} else {
		// Node not found
		$output['code'] = 404;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][20024];
	}
	return $output;
}

function apiGetAllLabNodeInterfaces($lab)
{
	// Getting node
	$nodes = $lab->getNodes();
	$nodeInterface = [];
	foreach ($nodes as $id => $node) {
		$output = apiGetLabNodeInterfaces($lab, $id);
		if ($output['status'] == 'success') {
			$nodeInterface[$id] = $output['data'];
		}
	}
	return $nodeInterface;
}


/**
 * Function to get node template.
 *
 * @param   Array   $p                  Parameters
 * @return  Array                       Node template (JSend data)
 */
function apiGetLabNodeTemplate($template)
{

	if (!is_file(BASE_DIR . '/html/templates/' . $template . '.yml')) {
		throw new ResponseException('Can not found template');
	}

	$p = yaml_parse_file(BASE_DIR . '/html/templates/' . $template . '.yml');
	$p['template'] = $template;
	if(isset($p['qemu_options'])){
		$re = '/\'|"|\\\\"|\\\\\'/m';
		$p['qemu_options'] = preg_replace($re, "'", $p['qemu_options']);
	}

	$params = [];
	$params['type'] = ['value' => $p['type'], 'show' => '0'];
	$params['template'] = ['value' => $p['template'], 'show' => '0'];

	if (is_file('/opt/unetlab/html/templates/device/' . $p['type'] . '.yml')) {
		$deviceP = yaml_parse_file('/opt/unetlab/html/templates/device/' . $p['type'] . '.yml');
		foreach ($deviceP as $key => $value) {
			if (is_array($value)) {
				$params[$key] = $value;
			} else {
				$params[$key] = ['value' => $value];
			}
			if (!isset($params[$key]['value'])) $params[$key]['value'] = '';
		}
	}

	// Image
	if ($p['type'] != 'vpcs') {
		$node_images = listNodeImages($p['type'], $p['template']);
		if (!isset($params['image'])) $params['image'] = [];
		$params['image']['type'] = 'list';
		$params['image']['value'] = '';
		$params['image']['options'] = array();

		if (is_array($node_images)) {
			$params['image']['value'] = end($node_images);
			$params['image']['options'] = $node_images;
		}
	}


	// Qemu Options
	if ($p['type'] == "qemu") {

		$qemu = scandir('/opt');
		$qemuOption = [];
		foreach ($qemu as $version) {
			if (preg_match('/qemu-([\d\.]+)/', $version, $matches)) {
				$qemuOption[$matches[1]] = $matches[1];
			}
		}
		if (is_dir('/opt/qemu')) {
			$qemuDefault = readlink('/opt/qemu');
			$qemuDefault = str_replace('qemu-', '', $qemuDefault);
		}
		$qemuOption[$qemuDefault] = $qemuDefault . "(Default)";

		if (!isset($params['qemu_version'])) $params['qemu_version'] = [];
		$params['qemu_version']['type'] = 'list';
		$params['qemu_version']['value'] = $qemuDefault;
		$params['qemu_version']['options'] = $qemuOption;
	};

	// Icon

	if (!isset($params['icon'])) $params['icon'] = [];
	$params['icon']['type'] = 'list';
	$params['icon']['value'] = '';
	$params['icon']['options'] = listNodeIcons();

	foreach ($p as $key => $value) {
		if (!isset($params[$key])) $params[$key] = [];
		if (is_array($value)) {
			$params[$key] = array_replace($params[$key], $value);
		} else {
			$params[$key] = array_replace($params[$key], ['value' => $value]);
		}

		if (!isset($params[$key]['value'])) $params[$key]['value'] = '';
	}

	// TODO must check lot of parameters
	$output['code'] = 200;
	$output['status'] = 'success';
	$output['message'] = '';
	$output['data'] = array();
	$output['data']['options'] = $params;

	return $output;
}

/**
 * Function to start a single node.
 *
 * @param   Lab     $lab                Lab
 * @param   int     $id                 Node ID
 * @param   int     $tenant             Tenant ID
 * @return  Array                       Return code (JSend data)
 */
function apiStartLabNode($lab, $id, $tenant)
{
	set_time_limit(0);
	$cmd = 'sudo /opt/unetlab/wrappers/unl_wrapper';
	$cmd .= ' -a start';
	$cmd .= ' -T ' . $tenant;
	$cmd .= ' -S ' . $lab->getSession();
	$cmd .= ' -D ' . $id;
	$cmd .= ' -F "' . $lab->getPath() . '/' . $lab->getFilename() . '"';
	$cmd .= ' 2>> /opt/unetlab/data/Logs/unl_wrapper.txt';
	secureCmd($cmd);
	exec($cmd, $o, $rc);
	error_log(date('M d H:i:s ') . 'INFO: starting node ' . $cmd);
	if ($rc == 0) {
		// Nodes started
		$output['code'] = 200;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][80049];
		
	} else {
		// Failed to start
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][$rc];
	}
	return $output;
}

/**
 * Function to start all nodes.
 *
 * @param   Lab     $lab                Lab
 * @param   int     $tenant             Tenant ID
 * @return  Array                       Return code (JSend data)
 */
// function apiStartLabNodes($lab, $tenant, $lab_session)
// {
// 	$cmd = 'sudo /opt/unetlab/wrappers/unl_wrapper';
// 	$cmd .= ' -a start';
// 	$cmd .= ' -T ' . $tenant;
// 	$cmd .= ' -S ' . $lab_session;
// 	$cmd .= ' -F "' . $lab->getPath() . '/' . $lab->getFilename() . '"';
// 	$cmd .= ' 2>> /opt/unetlab/data/Logs/unl_wrapper.txt';
// 	exec($cmd, $o, $rc);
// 	error_log(date('M d H:i:s ') . 'INFO: starting nodes ' . $cmd);
// 	if ($rc == 0) {
// 		// Nodes started
// 		$output['code'] = 200;
// 		$output['status'] = 'success';
// 		$output['message'] = $GLOBALS['messages'][80048];
// 	} else {
// 		// Failed to start
// 		$output['code'] = 400;
// 		$output['status'] = 'fail';
// 		$output['message'] = $GLOBALS['messages'][$rc];
// 	}
// 	return $output;
// }

/**
 * Function to stop a single node.
 *
 * @param   Lab     $lab                Lab
 * @param   int     $id                 Node ID
 * @param   int     $tenant             Tenant ID
 * @return  Array                       Return code (JSend data)
 */

function apiStopLabNode($lab, $id, $tenant)
{
	$cmd = 'sudo /opt/unetlab/wrappers/unl_wrapper';
	$cmd .= ' -a stop';
	$cmd .= ' -T ' . $tenant;
	$cmd .= ' -S ' . $lab->getSession();
	$cmd .= ' -D ' . $id;
	$cmd .= ' -F "' . $lab->getPath() . '/' . $lab->getFilename() . '"';
	$cmd .= ' 2>> /opt/unetlab/data/Logs/unl_wrapper.txt';
	secureCmd($cmd);
	exec($cmd, $o, $rc);
	error_log(date('M d H:i:s ') . 'INFO: stop node ' . $cmd);
	if ($rc == 0) {
		deleteWiresharkByNode(checkDatabase(), $lab, $id);
		$output['code'] = 200;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][80051];
	} else {
		// Failed to stop
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][$rc];
	}
	return $output;
}

// /**
//  * Function to stop all nodes.
//  *
//  * @param   Lab     $lab                Lab
//  * @param   int     $tenant             Tenant ID
//  * @return  Array                       Return code (JSend data)
//  */
// function apiStopLabNodes($lab, $tenant)
// {
// 	$cmd = 'sudo /opt/unetlab/wrappers/unl_wrapper';
// 	$cmd .= ' -a stop';
// 	$cmd .= ' -T ' . $tenant;
// 	$cmd .= ' -S ' . $lab->getSession();
// 	$cmd .= ' -F "' . $lab->getPath() . '/' . $lab->getFilename() . '"';
// 	$cmd .= ' 2>> /opt/unetlab/data/Logs/unl_wrapper.txt';
// 	exec($cmd, $o, $rc);
// 	error_log(date('M d H:i:s ') . 'INFO: stop all nodes ' . $cmd);
// 	if ($rc == 0) {
// 		deleteWiresharkByLab(checkDatabase(), $lab);
// 		$output['code'] = 200;
// 		$output['status'] = 'success';
// 		$output['message'] = $GLOBALS['messages'][80050];
// 	} else {
// 		// Failed to start
// 		$output['code'] = 400;
// 		$output['status'] = 'fail';
// 		$output['message'] = $GLOBALS['messages'][$rc];
// 	}
// 	return $output;
// }

/**
 * Function to wipe a single node.
 *
 * @param   Lab     $lab                Lab
 * @param   int     $id                 Node ID
 * @param   int     $tenant             Tenant ID
 * @return  Array                       Return code (JSend data)
 */
function apiWipeLabNode($lab, $id, $tenant)
{
	$cmd = 'sudo /opt/unetlab/wrappers/unl_wrapper';
	$cmd .= ' -a wipe';
	$cmd .= ' -T ' . $tenant;
	$cmd .= ' -S ' . $lab->getSession();
	$cmd .= ' -D ' . $id;
	$cmd .= ' -F "' . $lab->getPath() . '/' . $lab->getFilename() . '"';
	$cmd .= ' 2>> /opt/unetlab/data/Logs/unl_wrapper.txt';
	secureCmd($cmd);
	exec($cmd, $o, $rc);
	error_log(date('M d H:i:s ') . 'INFO: wiping node ' . $cmd);
	if ($rc == 0) {
		deleteWiresharkByNode(checkDatabase(), $lab, $id);
		$output['code'] = 200;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][80053];
	} else {
		// Failed to start
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][$rc];
	}
	return $output;
}

/**
 * Function to wipe all nodes.
 *
 * @param   Lab     $lab                Lab
 * @param   int     $tenant             Tenant ID
 * @return  Array                       Return code (JSend data)
 */
function apiWipeLabNodes($lab, $tenant)
{
	$cmd = 'sudo /opt/unetlab/wrappers/unl_wrapper';
	$cmd .= ' -a wipe';
	$cmd .= ' -T ' . $tenant;
	$cmd .= ' -S ' . $lab->getSession();
	$cmd .= ' -F "' . $lab->getPath() . '/' . $lab->getFilename() . '"';
	$cmd .= ' 2>> /opt/unetlab/data/Logs/unl_wrapper.txt';
	secureCmd($cmd);
	exec($cmd, $o, $rc);
	error_log(date('M d H:i:s ') . 'INFO: wiping nodes ' . $cmd);
	if ($rc == 0) {
		deleteWiresharkByLab(checkDatabase(), $lab);
		$output['code'] = 200;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][80052];
	} else {
		// Failed to start
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][$rc];
	}
	return $output;
}


/** Update console port for Node */

function apiEditNodePort($lab, $node_id, $port)
{
	$nodes = $lab->getNodes();
	if (!isset($nodes[$node_id])) throw new Exception('Undefine Node');
	if ($port > 40000 || $port < 30000) throw new Exception('Port must be in range 30000 - 40000');
	$db = checkDatabase();
	$query = 'SELECT * FROM ' . NODE_SESSIONS_TABLE . ' WHERE ' . NODE_SESSION_PORT . ' = :port';
	$statement = $db->prepare($query);
	$statement->execute([
		'port' => $port
	]);
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);
	if (isset($result[0])) throw new Exception('Port is already in used');

	$node = $nodes[$node_id];
	$query = 'UPDATE ' . NODE_SESSIONS_TABLE . ' SET ' . NODE_SESSION_PORT . ' = :port WHERE ' . NODE_SESSION_ID . '= :node_session_id';
	$statement = $db->prepare($query);
	$statement->execute([
		'port' => $port,
		'node_session_id' => $node->getSession()
	]);
	if($node->getNType() == 'docker'){
		$log = 'Change Port successfully. Restart or Wipe Node to take effect';
	}else{
		$log = 'Change Port successfully. Restart Node to take effect';
	}

	$node->setPort($port);
	$data = apiGetLabNodes($lab, getUser()['html5']);

	$output['code'] = 200;
	$output['status'] = 'success';
	$output['message'] = $log;
	$output['update'] = $data;
	return $output;
}
