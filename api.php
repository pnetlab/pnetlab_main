<?php


require_once('/opt/unetlab/html/includes/init.php');
require_once(BASE_DIR . '/html/includes/Slim/Slim.php');
require_once(BASE_DIR . '/html/includes/Slim-Extras/DateTimeFileWriter.php');
require_once(BASE_DIR . '/html/includes/api_authentication.php');
require_once(BASE_DIR . '/html/includes/api_configs.php');
require_once(BASE_DIR . '/html/includes/api_folders.php');
require_once(BASE_DIR . '/html/includes/api_labs.php');
require_once(BASE_DIR . '/html/includes/api_networks.php');
require_once(BASE_DIR . '/html/includes/api_nodes.php');
require_once(BASE_DIR . '/html/includes/api_pictures.php');
require_once(BASE_DIR . '/html/includes/api_status.php');
require_once(BASE_DIR . '/html/includes/api_textobjects.php');
require_once(BASE_DIR . '/html/includes/api_topology.php');
require_once(BASE_DIR . '/html/includes/api_uusers.php');
\Slim\Slim::registerAutoloader();


$app = new \Slim\Slim(array(
	'mode' => 'production',
	'debug' => True,					// Change to False for production
	'log.level' => \Slim\Log::WARN,		// Change to WARN for production, DEBUG to develop
	'log.enabled' => True,
	'log.writer' => new \Slim\LogWriter(fopen('/opt/unetlab/data/Logs/api.txt', 'a'))
));

$app->hook('slim.after.router', function () use ($app) {
	// Log all requests and responses
	$request = $app->request;
	$response = $app->response;

	$app->log->debug('Request path: ' . $request->getPathInfo());
	$app->log->debug('Response status: ' . $response->getStatus());
});

$app->response->headers->set('Content-Type', 'application/json');
$app->response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
$app->response->headers->set('Cache-Control', 'post-check=0, pre-check=0');
$app->response->headers->set('Pragma', 'no-cache');

$app->notFound(function () use ($app) {
	$output['code'] = 404;
	$output['status'] = 'fail';
	$output['message'] = $GLOBALS['messages']['60038'];
	$app->halt($output['code'], json_encode($output));
});


$db = checkDatabase();

// Define output for unprivileged requests
$forbidden = array(
	'code' => 401,
	'status' => 'forbidden',
	'message' => $GLOBALS['messages']['90032']
);

$app->get('/api/auth/logout', function () use ($app) {
	// Logout (DELETE request does not work with cookies)
	$cookie = $app->getCookie('token');
	$app->deleteCookie('token');
	$output = apiLogout($cookie);
	$app->response->setStatus($output['code']);
	$app->response->setBody(json_encode($output));
});

$app->get('/api/auth', function () use ($app) {
	$indent = new \indentify();
	list($user, $tenant, $output) = $indent->authorization($app->getCookie('token'));

	$variables = $app->request()->get();
	$lang = get($variables['lang'], '');
	$langData = loadLanguage($lang);

	if ($user === False) {
		// Set 401 not 412 for this page only -> used to refresh after a logout
		$output['code'] = 401;
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}

	if (!isset($user['folder']) || $user['folder'] == '') {
		$user['folder'] = '/';
	}

	if (checkFolder(BASE_LAB . $user['folder']) !== 0) {
		// User has an invalid last viewed folder
		$user['folder'] = '/';
	}

	try {
		checkWorkSpace($user['folder']);
	} catch (Exception $e) {
		$user['folder'] = getWorkspace();
	}

	$user['lang'] = $langData;

	$output['code'] = 200;
	$output['status'] = 'success';
	$output['message'] = $GLOBALS['messages']['90002'];
	$output['data'] = $user;

	$app->response->setStatus($output['code']);
	$app->response->setBody(json_encode($output));
});


/***************************************************************************
 * List Objects
 **************************************************************************/
// Node templates
$app->get('/api/list/templates/(:template)', function ($template = '') use ($app) {
	try {
		$indent = new \indentify();
		list($user, $tenant, $output) = $indent->authorization($app->getCookie('token'));
		if ($user === False) {
			$app->response->setStatus($output['code']);
			$app->response->setBody(json_encode($output));
			return;
		}

		if (!isset($template) || $template == '') {
			$output['data'] = getTemplates();
			$output['code'] = 200;
			$output['status'] = 'success';
			$output['message'] = $GLOBALS['messages']['60003'];
		}else{
			$output = apiGetLabNodeTemplate($template);
		}
		
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
	} catch (ResponseException $e) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $e->getMessage();
		$output['error_code'] = $e->getCode();
		$output['data'] = $e->getData();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	} catch (Exception $e){
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = get($GLOBALS['messages'][$e->getMessage()], $e->getMessage());
		$output['error_code'] = $e->getCode();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}
});

// Network types
$app->get('/api/list/networks', function () use ($app) {
	$indent = new \indentify();
	list($user, $tenant, $output) = $indent->authorization($app->getCookie('token'));
	if ($user === False) {
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}

	$output['code'] = 200;
	$output['status'] = 'success';
	$output['message'] = $GLOBALS['messages']['60002'];
	$output['data'] = listNetworkTypes();

	$app->response->setStatus($output['code']);
	$app->response->setBody(json_encode($output));
});

/***************************************************************************
 * Folders
 **************************************************************************/
// Get folder content
$app->get('/api/folders', function () use ($app) {
	try {
		$indent = new \indentify();
		list($user, $tenant, $output) = $indent->authorization($app->getCookie('token'));
		if ($user === False) {
			$app->response->setStatus($output['code']);
			$app->response->setBody(json_encode($output));
			return;
		}

		updateOnlineTime($tenant);

		$variables = $app->request()->get();
		$path = get($variables['path'], '');

		checkWorkSpace($path, true);

		$output = apiGetFolders($path);
		updateUserFolder($user['pod'], $path);

		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	} catch (ResponseException $e) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $e->getMessage();
		$output['error_code'] = $e->getCode();
		$output['data'] = $e->getData();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	} catch (Exception $e){
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = get($GLOBALS['messages'][$e->getMessage()], $e->getMessage());
		$output['error_code'] = $e->getCode();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}
});


$app->post('/api/folders/(:action)', function ($action) use ($app) {
	try {

		$indent = new \indentify();
		list($user, $tenant, $output) = $indent->authorization($app->getCookie('token'));
		if ($user === False) {
			$app->response->setStatus($output['code']);
			$app->response->setBody(json_encode($output));
			return;
		}

		updateOnlineTime($tenant);
		$variables = json_decode($app->request()->getBody(), true);
		$output = ['code' => 200, 'status' => 'success', 'message' => ''];

		switch ($action) {
			case 'add':
				$path = get($variables['path'], '');
				checkWorkSpace($path, checkSharePermission(USER_PER_ADD_FOLDER));
				checkPermission(USER_PER_ADD_FOLDER);
				$name = get($variables['name'], null);
				if ($name == null) throw new Exception('Name is not defined');
				$output = apiAddFolder($name, $path);
				break;
			case 'edit':
				$path = get($variables['path'], null);
				if ($path == null) throw new Exception('Path is not defined');
				checkWorkSpace($path, checkSharePermission(USER_PER_EDIT_FOLDER));
				checkPermission(USER_PER_EDIT_FOLDER);
				$new_path = get($variables['new_path'], null);
				if ($new_path == null) throw new Exception('New Path is not defined');
				$output = apiEditFolder($path, $new_path);
				break;
			case 'delete':
				$path = get($variables['path'], null);
				if ($path == null) throw new Exception('Path is not defined');
				checkWorkSpace($path, checkSharePermission(USER_PER_DEL_FOLDER));
				checkPermission(USER_PER_DEL_FOLDER);
				$output = apiDeleteFolder($path);
				break;
		}

		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	} catch (ResponseException $e) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $e->getMessage();
		$output['error_code'] = $e->getCode();
		$output['data'] = $e->getData();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	} catch (Exception $e){
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = get($GLOBALS['messages'][$e->getMessage()], $e->getMessage());
		$output['error_code'] = $e->getCode();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}
});



/***************************************************************************
 * Labs
 **************************************************************************/

// Add new lab
$app->post('/api/labs', function () use ($app) {
	$indent = new \indentify();
	list($user, $tenant, $output) = $indent->authorization($app->getCookie('token'));
	if ($user === False) {
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}

	try {

		$event = json_decode($app->request()->getBody());
		$p = json_decode(json_encode($event), True);;

		if (isset($p['source'])) {
			checkWorkSpace(dirname($p['source']), checkSharePermission(USER_PER_CLONE_LAB));
			checkPermission(USER_PER_CLONE_LAB);
			$output = apiCloneLab($p, $tenant, $user['email']);
		} else {
			checkWorkSpace($p['path'], checkSharePermission(USER_PER_ADD_LAB));
			checkPermission(USER_PER_ADD_LAB);
			$output = apiAddLab($p, $tenant, $user['email']);
		}

		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
	} catch (ResponseException $e) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $e->getMessage();
		$output['error_code'] = $e->getCode();
		$output['data'] = $e->getData();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	} catch (Exception $e){
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = get($GLOBALS['messages'][$e->getMessage()], $e->getMessage());
		$output['error_code'] = $e->getCode();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}
});

$app->delete('/api/labs', function () use ($app) {
	$indent = new \indentify();
	list($user, $tenant, $output) = $indent->authorization($app->getCookie('token'));
	if ($user === False) {
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}
	try {
		$variables = json_decode($app->request()->getBody(), true);
		$lab_path = get($variables['path'], '');
		checkWorkSpace($lab_path, checkSharePermission(USER_PER_DEL_LAB));
		checkPermission(USER_PER_DEL_LAB);
		$output = ['code' => 200];
		try {
			$lab = new Lab(BASE_LAB . $lab_path, $tenant);
		} catch (Exception $e) {
			if (is_file(BASE_LAB . $lab_path)) {
				unlink(BASE_LAB . $lab_path);
				$output['status'] = 'success';
				$output['message'] = $e->getMessage();
			} else {
				throw new Exception('Lab File is not founded');
			}
		}
		if (isset($lab)) $output = apiDeleteLab($lab);
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	} catch (ResponseException $e) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $e->getMessage();
		$output['error_code'] = $e->getCode();
		$output['data'] = $e->getData();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	} catch (Exception $e){
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = get($GLOBALS['messages'][$e->getMessage()], $e->getMessage());
		$output['error_code'] = $e->getCode();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}
});


$app->post('/api/labs/(:action)', function ($action) use ($app) {
	$indent = new \indentify();
	list($user, $tenant, $output) = $indent->authorization($app->getCookie('token'));
	if ($user === False) {
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}

	updateOnlineTime($tenant);

	try {
		$variables = json_decode($app->request()->getBody(), true);
		$lab_path = get($variables['path'], '');
		checkWorkSpace($lab_path, true);
		$lab = new Lab(BASE_LAB . $lab_path, $tenant);
		$output = ['code' => 200];

		switch ($action) {

			case 'preview':
				$networks = [];
				$nodes = [];
				$textObjects = [];
				$labinfo = [];
				$lines = [];

				$output = apiGetLab($lab);
				if ($output['status'] == 'success') {
					$labinfo = $output['data'];
				}
				$output = apiGetLabNodes($lab, $user['html5']);
				if ($output['status'] == 'success') {
					$nodes = $output['data'];
				}
				$output = apiGetLabTextObjects($lab, null);
				if ($output['status'] == 'success') {
					$textObjects = $output['data'];
				}
				$output = apiGetLabNetworks($lab);
				if ($output['status'] == 'success') {
					$networks = $output['data'];
				}

				$lines = $lab->getLineObjects();

				$output['data'] = [
					'networks' => $networks,
					'nodes' => $nodes,
					'textObjects' => $textObjects,
					'labinfo' => $labinfo,
					'lines' => $lines

				];

				break;

			case 'get':
				$output = apiGetLab($lab);
				break;

			case 'edit':
				checkLabPermission($lab, USER_PER_EDIT_LAB);
				if (isset($variables['data']))
					$output = apiEditLab($lab, $variables['data']);
				break;

			case 'move':
				$moveSharedable = checkSharePermission(USER_PER_MOVE_LAB);
				checkWorkSpace($lab_path, $moveSharedable);
				checkPermission(USER_PER_MOVE_LAB);
				if (isset($variables['new_path'])) {
					checkWorkSpace($variables['new_path'], $moveSharedable);
					$output = apiMoveLab($lab, $variables['new_path']);
				}
				break;
		}

		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	} catch (ResponseException $e) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $e->getMessage();
		$output['error_code'] = $e->getCode();
		$output['data'] = $e->getData();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	} catch (Exception $e){
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = get($GLOBALS['messages'][$e->getMessage()], $e->getMessage());
		$output['error_code'] = $e->getCode();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}
});


$app->post('/api/labs/session/factory/(:action)', function ($action) use ($app) {

	$indent = new \indentify();
	list($user, $tenant, $output) = $indent->authorization($app->getCookie('token'));
	if ($user === False) {
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}

	updateOnlineTime($tenant);

	$variables = json_decode($app->request()->getBody(), true);
	$output = ['code' => 200];


	try {
		switch ($action) {
			case 'create':
				$path = get($variables['path'], '');
				checkWorkSpace($path, checkSharePermission(USER_PER_OPEN_LAB));
				checkLimit($tenant);
				$lab = new Lab(BASE_LAB . $path, $tenant);
				checkLabPermission($lab, USER_PER_OPEN_LAB);
				$result = addLabSession($lab->getId(), $tenant, $path);
				if (!$result['result']) throw new Exception($result['message']);
				$output['message'] = get($result['data'], 'success');
				break;
			case 'join':
				$lab_session = get($variables['lab_session'], '');
				$labsession = getLabFromSession($lab_session);
				if (!$labsession) throw new Exception('NO_LAB_SESSION');
				$lab = new Lab(BASE_LAB . $labsession['lab_session_path'], $tenant, $lab_session);
				checkWorkSpace($labsession['lab_session_path'], checkSharePermission(USER_PER_JOIN_LAB));
				checkLabPermission($lab, USER_PER_JOIN_LAB);
				$result = joinLabSession($tenant, $lab_session);
				if (!$result['result']) throw new Exception($result['message']);
				$output['message'] = get($result['data'], 'success');
				break;

			case 'leave':
				$lab_session = get($user['lab'], '');
				$labsession = getLabFromSession($lab_session);
				if (!$labsession) throw new Exception('NO_LAB_SESSION');
				$lab = new Lab(BASE_LAB . $labsession['lab_session_path'], $tenant, $lab_session);
				$result = leaveLabSession($tenant, $lab);
				if (!$result['result']) throw new Exception($result['message']);
				$output['message'] = get($result['data'], 'success');
				break;

			case 'destroy':
				$lab_session = get($variables['lab_session'], '');
				$labsession = getLabFromSession($lab_session);
				if (!$labsession) throw new Exception('NO_LAB_SESSION');
				checkDestroy($lab_session);
				try {
					$lab = new Lab(BASE_LAB . $labsession['lab_session_path'], $tenant, $lab_session);
					$result = destroyLabSession($lab);
				} catch (Exception $th) {
					$result = destroyBrokenLabSession($lab_session);
				}

				if (!$result['result']) throw new Exception($result['message']);
				$output['message'] = get($result['data'], 'success');
				break;

			case 'stopNodes':
				$lab_session = get($variables['lab_session'], '');
				$labsession = getLabFromSession($lab_session);
				if (!$labsession) throw new Exception('NO_LAB_SESSION');
				checkStopNodes($lab_session);
				
				$lab = new Lab(BASE_LAB . $labsession['lab_session_path'], $tenant, $lab_session);
				$result = stopLabSession($lab);
				
				if (!$result['result']) throw new Exception($result['message']);
				$output['message'] = get($result['data'], 'success');
				break;
		}

		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	} catch (ResponseException $e) {
		
	   $output['code'] = 400;
	   $output['status'] = 'fail';
	   $output['message'] = $e->getMessage();
	   $output['error_code'] = $e->getCode();
	   $output['data'] = $e->getData();
	   $app->response->setStatus($output['code']);
	   $app->response->setBody(json_encode($output));
	   return;
   } catch (Exception $e){
	   
	   $output['code'] = 400;
	   $output['status'] = 'fail';
	   $output['message'] = get($GLOBALS['messages'][$e->getMessage()], $e->getMessage());
	   $output['error_code'] = $e->getCode();
	   $app->response->setStatus($output['code']);
	   $app->response->setBody(json_encode($output));
	   return;
   }
});

$app->get('/api/labs/session/(:object)', function ($object) use ($app, $db) {
	$indent = new \indentify();
	list($user, $tenant, $output) = $indent->authorization($app->getCookie('token'));

	if ($user === False) {
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}
	updateOnlineTime($tenant);
	$variables = $app->request()->get();
	$session = get($user['lab'], '');

	try {
		$labsession = getLabFromSession($session);
		if (!$labsession) throw new Exception('NO_LAB_SESSION');
		lockSession($session);
		$lab = new Lab(BASE_LAB . $labsession['lab_session_path'], $tenant, $session);

		$output = ['code' => 200, 'status' => 'success', 'message' => ''];

		switch ($object) {
			case 'info':
				$output = apiGetLab($lab);
				break;
			case 'topology':
				$networks = [];
				$nodes = [];
				$textObjects = [];
				$labinfo = [];
				$lines = [];

				$output = apiGetLab($lab);
				if ($output['status'] == 'success') {
					$labinfo = $output['data'];
				}
				$output = apiGetLabNodes($lab, $user['html5']);
				if ($output['status'] == 'success') {
					$nodes = $output['data'];
				}
				$output = apiGetLabTextObjects($lab, null);
				if ($output['status'] == 'success') {
					$textObjects = $output['data'];
				}
				$output = apiGetLabNetworks($lab);
				if ($output['status'] == 'success') {
					$networks = $output['data'];
				}

				$lines = $lab->getLineObjects();

				$output['data'] = [
					'networks' => $networks,
					'nodes' => $nodes,
					'textObjects' => $textObjects,
					'labinfo' => $labinfo,
					'lines' => $lines

				];
				break;
			case 'html':
				$Parsedown = new Parsedown();
				$output['status'] = 'success';
				$output['message'] = $GLOBALS['messages']['60054'];
				$output['data'] = $Parsedown->text($lab->getBody());
				break;
			case 'configs':
				if (isset($variables['id'])) {
					$output = apiGetLabConfig($lab, $variables['id']);
				} else {
					$output = apiGetLabConfigs($lab);
				}
				break;
			case 'networks':
				if (isset($variables['id'])) {
					$output = apiGetLabNetwork($lab, $variables['id']);
				} else {
					$output = apiGetLabNetworks($lab);
				}
				break;
			case 'textobjects':
				if (isset($variables['id'])) {
					$output = apiGetLabTextObject($lab, $variables['id']);
				} else {
					$output = apiGetLabTextObjects($lab, null);
				}
				break;

			case 'pictures':
				if (isset($variables['id'])) {
					$output = apiGetLabPicture($lab, $variables['id']);
				} else {
					$output = apiGetLabPictures($lab);
				}
				break;

			case 'picturemapped':
				$id = $variables['id'];
				$output = apiGetLabPictureMapped($lab, $id, $user['html5']);
				break;

			case 'picturedata':
				$id = $variables['id'];
				$height = get($variables['height'], 0);
				$width = get($variables['width'], 0);
				$output = apiGetLabPictureData($lab, $id, $width, $height);
				ob_clean();
				$app->response->headers->set('Content-Type', $output['encoding']);
				$app->response->setBody(trim($output['data']));
				unlockSession($session);
				return;

			case 'links':
				$output = apiGetLabLinks($lab);
				break;

			case 'nodes':
				if (isset($variables['id'])) {
					$output = apiGetLabNode($lab, $variables['id'], $user['html5']);
				} else {
					$output = apiGetLabNodes($lab, $user['html5']);
				}
				break;

			case 'interfaces':
				$node_id = get($variables['node_id'], null);
				$output = apiGetLabNodeInterfaces($lab, $node_id);
				break;

			case 'networkints':
				$p = $variables;
				$network_id = get($p['network_id'], '');
				if ($network_id != '') $network = $lab->getNetworks()[$network_id];
				$ints = [];
				if (isset($network)) {
					foreach ($lab->getNodes() as $node_id => $node) {
						foreach ($node->getInterfaces() as $interface_id => $interface) {
							if ($interface->getNetworkId() == $network_id) {
								$ints[] = [
									'node_id' => $node_id,
									'node' => $node->getName(),
									'id' => $interface_id,
									'name' => $interface->getName(),
									'quality' => (object)$interface->getQuality()
								];
							}
						}
					}
				}
				$output['message'] = $ints;
				break;


			case 'interface':
				$p = $variables;
				$nodeId = get($p['node_id'], '');
				if ($nodeId === '') throw new Exception('No node defined');
				$interfaceId = get($p['interface_id'], '');
				if ($interfaceId === '') throw new Exception('No interface defined');
				$node = $lab->getNodes()[$nodeId];
				if (!$node) throw new Exception('Undefine node');
				$interface = $node->getInterfaces()[$interfaceId];
				if (!$interface) throw new Exception('Undefine Interface');
				$output['message'] = [
					'node_id' => $nodeId,
					'node' => $node->getName(),
					'id' => $interfaceId,
					'name' => $interface->getName(),
					'quality' => (object)$interface->getQuality()
				];
				break;

			case 'links':
				$output = apiGetLabLinks($lab);
				break;

			case 'line':
				$lines = $lab->getLineObjects();
				$output['message'] = $lines;
				break;

			case 'workbook':
				$name = get($variables['name'], null);
				$content = get($variables['content'], 1);
				$output['message'] = $lab->getWorkbook($name, $content);
				break;

			case 'wireshark':
				$query = 'SELECT * FROM wiresharks WHERE ws_tenant=:ws_tenant AND ws_lab=:ws_lab';
				$statement = $db->prepare($query);
				$statement->execute([
					'ws_tenant' => $tenant,
					'ws_lab' => $lab->getSession(),
				]);

				$result = $statement->fetchAll(PDO::FETCH_ASSOC);
				$output['message'] = $result;
				break;

			case 'multi_cfg_list':
				$nodes = $lab->getNodes();
				$cfg_list = [];
				foreach ($nodes as $node) {
					$nodecfg = array_keys($node->getMulti_config());
					$cfg_list = array_merge($cfg_list, $nodecfg);
				}
				$cfg_list = array_unique($cfg_list);

				$output['code'] = 200;
				$output['status'] = 'success';
				$output['data'] = $cfg_list;
				break;

			case 'multi_cfg_detail':

				$p = $variables;
				$name = get($p['name'], '');
				$nodes = $lab->getNodes();
				$cfg_list = [];
				if ($name == '') {
					foreach ($nodes as $node) {
						$cfg_list[$node->getId()] = $node->getConfigData();
					}
				} else {
					foreach ($nodes as $node) {
						$cfg_list[$node->getId()] = $node->getMultiCfg($name);
					}
				}


				$output['code'] = 200;
				$output['status'] = 'success';
				$output['data'] = $cfg_list;

				break;

			case 'console_guac_link':
				// get console link for node using html console

				$p = $variables;
				$nodeId = get($p['node_id'], '');
				$index = get($p['index'], 1);
				if ($nodeId === '') throw new Exception('No node defined');
				$node = $lab->getNodes()[$nodeId];
				if (!$node) throw new Exception('Undefine node');

				$link = $node->getGuacConsoleLink($index);
			
				$output['code'] = 200;
				$output['status'] = 'success';
				$output['data'] = $link ;

				break;
			
		}

		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		unlockSession($session);
		return;
	} catch (ResponseException $e) {
	 	unlockSession($session);
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $e->getMessage();
		$output['error_code'] = $e->getCode();
		$output['data'] = $e->getData();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	} catch (Exception $e){
		unlockSession($session);
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = get($GLOBALS['messages'][$e->getMessage()], $e->getMessage());
		$output['error_code'] = $e->getCode();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}
});

$app->post('/api/nodestatus', function () use ($app) {
	try {

		$indent = new \indentify();
		list($user, $tenant, $output) = $indent->authorization($app->getCookie('token'));
		if ($user === False) {
			$app->response->setStatus($output['code']);
			$app->response->setBody(json_encode($output));
			return;
		}

		$output = ['code' => 200, 'status' => 'success', 'message' => ''];
		$output['data'] = getNodesStatus(null);
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	} catch (ResponseException $e) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $e->getMessage();
		$output['error_code'] = $e->getCode();
		$output['data'] = $e->getData();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}catch (Exception $e) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = get($GLOBALS['messages'][$e->getMessage()], $e->getMessage());
		$output['error_code'] = $e->getCode();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}
});

$app->post('/api/labs/session/nodestatus', function () use ($app) {
	try {

		$indent = new \indentify();
		list($user, $tenant, $output) = $indent->authorization($app->getCookie('token'));
		if ($user === False) {
			$app->response->setStatus($output['code']);
			$app->response->setBody(json_encode($output));
			return;
		}

		$output = ['code' => 200, 'status' => 'success', 'message' => ''];
		$session = get($user['lab'], '');
		if ($session == '') throw new Exception('NO_LAB_SESSION');

		$output['data'] = getNodesStatus($session);
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));

		return;
	} catch (ResponseException $e) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $e->getMessage();
		$output['error_code'] = $e->getCode();
		$output['data'] = $e->getData();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}catch (Exception $e) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = get($GLOBALS['messages'][$e->getMessage()], $e->getMessage());
		$output['error_code'] = $e->getCode();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}
});

$app->post('/api/labs/session/(:object)/(:action)', function ($object, $action) use ($app) {
	$indent = new \indentify();
	list($user, $tenant, $output) = $indent->authorization($app->getCookie('token'));
	if ($user === False) {
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}
	updateOnlineTime($tenant);
	$variables = json_decode($app->request()->getBody(), true);
	$labFile = '';
	$session = get($user['lab'], '');

	try {
		$labsession = getLabFromSession($session);
		if (!$labsession) throw new Exception('NO_LAB_SESSION');
		$labFile = BASE_LAB . $labsession['lab_session_path'];
		lockFile($labFile);
		lockSession($session);
		$lab = new Lab($labFile, $tenant, $session);

		$output = ['code' => 200, 'status' => 'success', 'message' => ''];

		switch ($object) {

			case 'lab':
				if ($action == 'lock') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					if ($lab->isLock()) throw new Exception('Lab is already locked');
					$password = get($variables['password'], null);
					$output = apiLockLab($lab, $password);
				} else if ($action == 'unlock') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					$password = get($variables['password'], '');
					if ($password == '') throw new Exception('Please fill Password to unLock Lab');
					$clearPass = get($variables['clear'], false);
					$output = apiUnlockLab($lab, $password, $clearPass);
				}

				$data = apiGetLab($lab);
				if ($data['status'] == 'success') {
					$data = $data['data'];
					$output['update'] = ['labinfo' => $data];
				}

				break;

			case 'nodes':
				if ($action == 'start') {
                    checkLimit($labsession[LAB_SESSION_POD]);
                    checkRunningNodeLimit($labsession[LAB_SESSION_POD]);
					$node_id = get($variables['id'], null);
					$output = apiStartLabNode($lab, $node_id, $tenant, $session);
					
				} else if ($action == 'stop') {
					$node_id = get($variables['id'], null);
					$output = apiStopLabNode($lab, $node_id, $tenant);
				} else if ($action == 'add') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
                    checkLimit($labsession[LAB_SESSION_POD]);
                   
					if (isset($variables['count'])) unset($variables['count']);
					$output = apiAddLabNode($lab, $variables, false);
				} else if ($action == 'edit') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);

					if (isset($variables['id'])) {
						$output = apiEditLabNode($lab, $variables);
					} else if (isset($variables['data'])) {
						$output = apiEditLabNodes($lab, $variables['data']);
					} else {
						throw new Exception('No data');
					}
				} else if ($action == 'delete') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					$node_id = get($variables['id'], null);
					if ($node_id === null) throw new Exception('Node ID undefined');
					$output = apiDeleteLabNode($lab, $node_id, $tenant);
				} else if ($action == 'export') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					if (isset($variables['id'])) {
						$output = apiExportLabNode($lab, $variables['id'], $tenant);
					} else {
						$output = apiExportLabNodes($lab, $tenant);
					}
				} else if ($action == 'wipe') {
					if (isset($variables['id'])) {
						$output = apiWipeLabNode($lab, $variables['id'], $tenant);
					} else {
						$output = apiWipeLabNodes($lab, $tenant);
					}
				} else if ($action == 'unlock') {
					if (isset($variables['id'])) {
						$nodes = $lab->getNodes();
						if (!isset($nodes[$variables['id']])) throw new Exception('Undefine node');
						$node = $nodes[$variables['id']];
						$node->unlock();
					}
				} else if ($action == 'port') {
                    checkLabPermission($lab, USER_PER_EDIT_LAB);
                    if (isset($variables['id']) && isset($variables['port'])) {
                        $output = apiEditNodePort($lab, $variables['id'], $variables['port']);
                    }else {
						throw new Exception('No data');
					}
                }

				break;

			case 'networks':
				if ($action == 'edit') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					if (isset($variables['id'])) {
						$output = apiEditLabNetwork($lab, $variables);
					} else if (isset($variables['data'])) {
						$output = apiEditLabNetworks($lab, $variables['data']);
					} else {
						throw new Exception('No data');
					}
				} else if ($action == 'add') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					$output = apiAddLabNetwork($lab, $variables, false);
				} else if ($action == 'delete') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					if (isset($variables['id'])) {
						$output = apiDeleteLabNetwork($lab, $variables['id']);
					}
				} else if ($action == 'p2p') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					$networkParams['visibility'] = 0;
					$networkParams['type'] = 'bridge';
					$networkParams['postfix'] = 0;
					$networkParams['top'] = 0;
					$networkParams['left'] = 0;
					$networkParams['name'] = `Net-` . get($variables['name']);
					$networkParams['count'] = 2;
					$result = apiAddLabNetwork($lab, $networkParams, false);
					if ($result['status'] == 'success') {
						$network_id = $result['data']['id'];
					} else {
						throw new Exception('Can not create network');
					}

					$output['message'] = 'Create connection successfully';
					$src_id = $variables['src_id'];
					$src_if = $variables['src_if'];
					if (isset($src_id) && isset($src_if)) {
						$hostlink = $lab->connectNode($src_id, [$src_if => $network_id]);
						if ($hostlink == 1) $output['message'] = 'Reload related device to get effect';
					}
					$dest_id = $variables['dest_id'];
					$dest_if = $variables['dest_if'];
					if (isset($dest_id) && isset($dest_if)) {
						$hostlink = $lab->connectNode($dest_id, [$dest_if => $network_id]);
						if ($hostlink == 1) $output['message'] = 'Reload related device to get effect';
					}
				}


				$output['update'] = [];
				$data = apiGetLabNetworks($lab);
				if ($data['status'] == 'success') {
					$data = $data['data'];
					$output['update']['networks'] = $data;
				}
				$data = apiGetLabNodes($lab, $user['html5']);
				if ($data['status'] == 'success') {
					$data = $data['data'];
					$output['update']['nodes'] = $data;
				}
				break;


			case 'configs':
				if ($action == 'edit') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					if (isset($variables['id'])) {
						$output = apiEditLabConfig($lab, $variables);
					}
				}
				break;

			case 'interfaces':

				$updateStyle = function ($p) use ($lab) {

					$network_id = get($p['network_id'], '');
					if ($network_id != '') $network = $lab->getNetworks()[$network_id];

					if (isset($network)) {
						foreach ($lab->getNodes() as $node_id => $node) {
							foreach ($node->getInterfaces() as $interface_id => $interface) {
								if ($interface->getNetworkId() == $network_id) {
									$interface->setInterfaceStyle($p);
								}
							}
						}
					} else {
						$nodeId = get($p['node_id'], '');
						if ($nodeId === '') throw new Exception('No node defined');
						$interfaceId = get($p['interface_id'], '');
						if ($interfaceId === '') throw new Exception('No interface defined');
						$nodes = $lab->getNodes();
						if (!isset($nodes[$nodeId])) throw new Exception('Undefine node');
						$node = $nodes[$nodeId];
						$interfaces = $node->getInterfaces();
						if (!isset($interfaces[$interfaceId])) throw new Exception('Undefine Interface');
						$interface = $node->getInterfaces()[$interfaceId];
						$interface->setInterfaceStyle($p);

						$remoteId = $interface->getRemoteId();

						if (isset($nodes[$remoteId])) {
							$rmnode = $nodes[$remoteId];
							$rminterfaces = $rmnode->getInterfaces();
							$remoteIf = $interface->getRemoteIf();
							if (isset($rminterfaces[$remoteIf])) {
								$rminterface = $rminterfaces[$remoteIf];
								$rminterface->setInterfaceStyle($p);
							}
						}
					}
				};

				if ($action == 'edit') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					if (isset($variables['node_id']) && isset($variables['data'])) {
						$output = apiEditLabNodeInterfaces($lab, $variables['node_id'], $variables['data']);
					}
				} else if ($action == 'style') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					$p = $variables;
					$updateStyle($p);
					$lab->save();
				} else if ($action == 'styles') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					$p = $variables['data'];

					foreach ($p as $param) {
						$updateStyle($param);
					}

					$lab->save();
				} else if ($action == 'setquality') {
					$p = $variables;
					$nodeId = get($p['node_id'], '');
					if ($nodeId === '') throw new Exception('No node defined');
					$interfaceId = get($p['interface_id'], '');
					if ($interfaceId === '') throw new Exception('No interface defined');
					$nodes = $lab->getNodes();
					if (!isset($nodes[$nodeId])) throw new Exception('Undefine node');
					$node = $nodes[$nodeId];
					$interfaces = $node->getInterfaces();
					if (!isset($interfaces[$interfaceId])) throw new Exception('Undefine Interface');
					$interface = $interfaces[$interfaceId];
					$interface->setQuality($p);
			
				} else if ($action == 'setSuspend') {
					$p = $variables;
					$nodeId = get($p['node_id'], '');
					if ($nodeId === '') throw new Exception('No node defined');
					$interfaceId = get($p['interface_id'], '');
					if ($interfaceId === '') throw new Exception('No interface defined');
					$nodes = $lab->getNodes();
					if (!isset($nodes[$nodeId])) throw new Exception('Undefine node');
					$node = $nodes[$nodeId];
					$interfaces = $node->getInterfaces();
					if (!isset($interfaces[$interfaceId])) throw new Exception('Undefine Interface');
					$interface = $interfaces[$interfaceId];
					$interface->setSuspendStatus(get($p['status'], '0'));
				}

				$data = apiGetLabNodes($lab, $user['html5']);
				if ($data['status'] == 'success') {
					$data = $data['data'];
					$output['update'] = ['nodes' => $data];
				}

				break;

			case 'textobjects':
				if ($action == 'edit') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					if (isset($variables['id'])) {
						$output = apiEditLabTextObject($lab, $variables);
					} else if (isset($variables['data'])) {
						$output = apiEditLabTextObjects($lab, $variables['data']);
					} else {
						throw new Exception('No data');
					}
				} else if ($action == 'add') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					$output = apiAddLabTextObject($lab, $variables, false);
				} else if ($action == 'delete') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					if (isset($variables['id'])) {
						$output = apiDeleteLabTextObject($lab, $variables['id']);
					}
				}


				$data = apiGetLabTextObjects($lab);
				if ($data['status'] == 'success') {
					$data = $data['data'];
					$output['update'] = ['textobjects' => $data];
				}


				break;

			case 'pictures':
				if ($action == 'edit') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					if (isset($variables['id'])) {
						$output = apiEditLabPicture($lab, $variables);
					}
				} else if ($action == 'add') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					$p = $_POST;
					if (!empty($_FILES)) {
						foreach ($_FILES as $file) {
							if (file_exists($file['tmp_name'])) {
								$fp = fopen($file['tmp_name'], 'r');
								$size = filesize($file['tmp_name']);
								if ($fp !== False) {
									$finfo = new finfo(FILEINFO_MIME);
									$p['data'] = fread($fp, $size);
									$p['type'] = $finfo->buffer($p['data'], FILEINFO_MIME_TYPE);
								}
							}
						}
					}

					$output = apiAddLabPicture($lab, $p);
				} else if ($action == 'delete') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					if (isset($variables['id'])) {
						$output = apiDeleteLabPicture($lab, $variables['id']);
					}
				}
				break;

			case 'line':
				$p = $variables;
				if ($action == 'add') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					if (!isset($p['data'])) throw new Exception('No line data');
					$lineData = $p['data'];
					$id = $lineData['id'];
					$lines = $lab->getLineObjects();
					$lines[$id] = $lineData;
					$rc = $lab->setLineObjects($lines);
					if ($rc !== 0) throw new Exception($rc);
				} else if ($action == 'edit') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					if (!isset($p['data'])) throw new Exception('No line data');
					$lineData = $p['data'];
					$id = $lineData['id'];
					$lines = $lab->getLineObjects();
					if (!isset($lines[$id])) throw new Exception('Line not found');
					foreach ($lineData as $key => $value) {
						$lines[$id][$key] = $value;
					}
					$rc = $lab->setLineObjects($lines);
					if ($rc !== 0) throw new Exception($rc);
				} else if ($action == 'delete') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					if (!isset($p['id'])) throw new Exception('No line data');
					$lines = $lab->getLineObjects();
					unset($lines[$p['id']]);
					$rc = $lab->setLineObjects($lines);
					if ($rc !== 0) throw new Exception($rc);
				} else if ($action == 'position') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					$lines = $lab->getLineObjects();
					if (!isset($p['data'])) throw new Exception('No data');
					foreach ($p['data'] as $position) {
						if (isset($lines[$position['id']])) {
							if (isset($position['x1'])) $lines[$position['id']]['x1'] = $position['x1'];
							if (isset($position['x2'])) $lines[$position['id']]['x2'] = $position['x2'];
							if (isset($position['y1'])) $lines[$position['id']]['y1'] = $position['y1'];
							if (isset($position['y2'])) $lines[$position['id']]['y2'] = $position['y2'];
						}
					}

					$rc = $lab->setLineObjects($lines);
					if ($rc !== 0) throw new Exception($rc);
				}

				$output['update'] = ['lines' => $lab->getLineObjects()];

				break;



			case 'workbook':
				$p = $variables;
				if ($action == 'add') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					$name = get($p['name'], null);
					$type = get($p['type'], null);

					if ($type != 'pdf' && $type != 'html') {
						throw new Exception('Unvalid workbook type');
					}
					if ($name == '') {
						throw new Exception('Unvalid workbook name');
					}

					$lab->addWorkbook($name, $type);
				} else if ($action == 'delete') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					$name = get($p['name'], null);

					if ($name == '') {
						throw new Exception('Unvalid workbook name');
					}
					$lab->delWorkbook($name);
				} else if ($action == 'edit') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					$name = get($p['name'], null);
					$new_name = get($p['new_name'], null);

					if ($name == '') {
						throw new Exception('Unvalid workbook name');
					}

					if (!preg_match('/^[A-Za-z0-9\s\_]+$/', $new_name)) {
						throw new Exception('Unvalid workbook name');
					}

					$lab->editWorkbook($name, $new_name);
				} else if ($action == 'order') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);

					$src_name = get($p['src_name'], null);
					$dest_name = get($p['dest_name'], null);

					if (!preg_match('/^[A-Za-z0-9\s\_]+$/', $src_name)) {
						throw new Exception('Unvalid workbook name');
					}

					if (!preg_match('/^[A-Za-z0-9\s\_]+$/', $dest_name)) {
						throw new Exception('Unvalid workbook name');
					}

					$lab->changeOrder($src_name, $dest_name);
				} else if ($action == 'update') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);

					$content = get($p['content'], null);
					if (!isset($content)) throw new Exception('No content');
					$name = get($p['name'], null);
					if ($name == '') throw new Exception('Unvalid workbook name');

					$menu = get($p['menu'], []);
					$menu = array_map(function ($item) {
						return (object) $item;
					}, $menu);

					$lab->updateContent($name, $content, $menu);
				}

				break;

			case 'wireshark':
				$p = $variables;
				if ($action == 'add') {
					$interface_id = get($p['interface_id'], '');
					$node_id = get($p['node_id'], '');
					addWireshark($lab, $node_id, $interface_id);
				} else if ($action == 'capture') {
					$interface_id = get($p['interface_id'], '');
					$node_id = get($p['node_id'], '');
					$checkExistLog = exec('sudo docker images pnetlab/pnet-wireshark:latest | grep pnetlab/pnet-wireshark');
					if ($checkExistLog == '') throw new Exception('You have not installed Wireshark for the HTML Console. Go to the Devices tab and get the Wireshark node then try to capture again.');
					$output = addWiresharkSystem($lab, $node_id, $interface_id);
				} else if ($action == 'delete') {
					$interface_id = get($p['interface_id'], '');
					$node_id = get($p['node_id'], '');
					if ($interface_id === '' || $node_id === '') throw new Exception('Missing data');

					deleteWireshark($lab, $node_id, $interface_id);
				}
				break;

			case 'multi_cfg':
				if ($action == 'add') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					$name = get($variables['name'], '');
					if ($name == '') throw new Exception('Unvalid Name');
					$nodes = $lab->getNodes();
					foreach ($nodes as $node_id => $node) {
						$node->addMultiCfg($node->getConfigData(), $name);
					}
					$lab->save();
					$output['message'] = "Add Start-up Config successfully.";
					// }
				} else if ($action == 'active') {
					$name = get($variables['name'], '');
					$lab->setMulti_config_active($name);
					$lab->save();
					$output['message'] = "Set Start-up Config successfully. Wiped all Nodes for effecting";

					$data = apiGetLab($lab);
					if ($data['status'] == 'success') {
						$data = $data['data'];
						$output['update'] = ['labinfo' => $data];
					}
				} else if ($action == 'delete') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					$name = get($variables['name'], '');
					if ($name == '') throw new Exception('Unvalid Name');

					$active_cfg = $lab->getMulti_config_active();

					if ($name == $active_cfg) {
						$output['status'] = 'fail';
						$output['message'] = "ERROR! " . $name . " is using as Start-up Config of this lab. Please change to another Start-up Config first";
					} else {
						$nodes = $lab->getNodes();
						foreach ($nodes as $node) {
							$node->delMultiCfg($name);
						}
						$lab->save();
						$output['status'] = 'success';
						$output['message'] = "Delete successfully";
					}
				} else if ($action == 'rename') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					$new_name = get($variables['new_name'], '');
					$old_name = get($variables['old_name'], '');
					if ($new_name == '' || $old_name == '')  throw new Exception('Unvalid Name');

					$nodes = $lab->getNodes();
					foreach ($nodes as $node) {
						$node->renameMultiCfg($old_name, $new_name);
					}

					$active_cfg = $lab->getMulti_config_active();
					if ($old_name == $active_cfg) {
						$lab->setMulti_config_active($new_name);
					}

					$lab->save();
					$output['code'] = 200;
					$output['status'] = 'success';
					$output['message'] = "Edit successfully";
				} else if ($action == 'edit') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					$name = get($variables['name'], '');
					$config = get($variables['config'], '');

					$nodeId = get($variables['node_id'], '');
					if ($nodeId === '') throw new Exception('No node defined');

					$nodes = $lab->getNodes();
					if (!isset($nodes[$nodeId])) throw new Exception('Undefine node');
					$node = $nodes[$nodeId];

					if ($name == '') {
						$node->setConfigData($config);
					} else {
						$node->editMultiCfg($config, $name);
					}

					$lab->save();
					$output['message'] = "Import Start-up Config successfully";
				} else if ($action == 'import') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					$name = $variables['import_name'];
					$configs = $variables['import_config'];
					if ($name == '') throw new Exception('Unvalid Name');

					$nodes = $lab->getNodes();
					foreach ($nodes as $node) {
						$nodeId = $node->getId();
						if (isset($configs[$nodeId])) {
							$node->addMultiCfg($configs[$nodeId], $name);
						} else {
							$node->addMultiCfg('', $name);
						}
					}
					$lab->save();
					$output['message'] = "Import Start-up Config successfully";
				} else if ($action == 'export') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					$name = $variables['export_name'];
					$nodes = $lab->getNodes();
					$configs = [];
					if ($name == '') {
						foreach ($nodes as $node) {
							$nodeId = $node->getId();
							$configs[$nodeId] = $node->getConfigData();
						}
					} else {
						foreach ($nodes as $node) {
							$nodeId = $node->getId();
							$configs[$nodeId] = $node->getMultiCfg($name);
						}
					}


					$output['code'] = 200;
					$output['status'] = 'success';
					$output['message'] = $configs;
				}

				break;

			case 'background':
				if ($action == 'edit') {
					checkLabPermission($lab, USER_PER_EDIT_LAB);
					checkLockLab($lab);
					$darkmode = get($variables['darkmode'], 0);
					$mode3d = get($variables['mode3d'], 0);
					$nogrid = get($variables['nogrid'], 0);
					$lab->setBackground($darkmode, $mode3d, $nogrid);
				}
				break;
		}
        
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		unlockFile($labFile);
		unLockSession($session);
		return;
	} catch (ResponseException $e) {
		unlockFile($labFile);
		unLockSession($session);
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $e->getMessage();
		$output['error_code'] = $e->getCode();
		$output['data'] = $e->getData();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}catch (Exception $e) {
		unlockFile($labFile);
		unLockSession($session);
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = get($GLOBALS['messages'][$e->getMessage()], $e->getMessage());
		$output['error_code'] = $e->getCode();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}
});

// Export labs
$app->post('/api/export', function () use ($app) {
	$indent = new \indentify();
	list($user, $tenant, $output) = $indent->authorization($app->getCookie('token'));
	if ($user === False) {
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}
	try {
		checkPermission(USER_PER_EXPORT_LAB);
		$event = json_decode($app->request()->getBody());
		$p = json_decode(json_encode($event), True);;

		$output = apiExportLabs($p);
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
	} catch (ResponseException $e) {
		
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $e->getMessage();
		$output['error_code'] = $e->getCode();
		$output['data'] = $e->getData();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}catch (Exception $e) {
		
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = get($GLOBALS['messages'][$e->getMessage()], $e->getMessage());
		$output['error_code'] = $e->getCode();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}
});

// Import labs
$app->post('/api/import', function () use ($app) {
	$indent = new \indentify();
	list($user, $tenant, $output) = $indent->authorization($app->getCookie('token'));
	if ($user === False) {
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}

	try {

		checkPermission(USER_PER_IMPORT_LAB);
		$p = $_POST;
		if (!empty($_FILES)) {
			foreach ($_FILES as $file) {
				$p['name'] = $file['name'];
				$p['file'] = $file['tmp_name'];
				$p['error'] = $file['name'];
			}
		}
		$output = apiImportLabs($p);
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));

	} catch (ResponseException $e) {
		
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $e->getMessage();
		$output['error_code'] = $e->getCode();
		$output['data'] = $e->getData();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}catch (Exception $e) {
		
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = get($GLOBALS['messages'][$e->getMessage()], $e->getMessage());
		$output['error_code'] = $e->getCode();
		$app->response->setStatus($output['code']);
		$app->response->setBody(json_encode($output));
		return;
	}
});

$app->get('/api/icons', function () use ($app) {
	$arr = listNodeIcons();
	$app->response->setStatus(200);
	$app->response->setBody(json_encode($arr));
});

$app->get('/api/workbook/pdf/(:name)',
	function ($name = '') use ($app) {
		if (session_status() == PHP_SESSION_NONE) session_start();
		if (isset($_SESSION[$name])) {
			$app->response->headers->set('Content-Type', 'application/pdf');
			$app->response->setBody($_SESSION[$name]);
		}
		return;
	}
);


/***************************************************************************
 * Run
 **************************************************************************/
$app->run();
