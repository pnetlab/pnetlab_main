<?php

// Include custom configuration
if (file_exists('includes/config.php')) {
	require_once('includes/config.php');
}
// Preview Code UIlegacy
$UIlegacy = 1 ;

if (!defined('DATABASE')) define('DATABASE', '/opt/unetlab/data/database.sdb');
if (!defined('FORCE_VM')) define('FORCE_VM', 'auto');
if (!defined('MODE')) define('MODE', 'multi-user');
if (!defined('SESSION')) define('SESSION', '3600');
if (!defined('THEME')) define('THEME', 'default');
if (!defined('TIMEOUT')) define('TIMEOUT', 25);
if (!defined('TIMEZONE')) define('TIMEZONE', 'Europe/Rome');
if (!defined('TEMPLATE_DISABLED')) define('TEMPLATE_DISABLED', '.missing');

if (!isset($node_templates)) {
	$node_templates = array();
	$templateFiles = scandir('/opt/unetlab/html/templates');
	foreach($templateFiles as $file){
		if(preg_match('/(.+)\.yml/', $file, $match)){
			$node_templates[$match[1]] = $match[1];
		}
	}			
}

// Define parameters

define('VERSION', 'PNET');
define('BASE_DIR', '/opt/unetlab');
define('BASE_LAB', BASE_DIR.'/labs');
define('BASE_TMP', BASE_DIR.'/tmp');
define('BASE_THEME', '/themes/'.THEME);

// Setting timezone
date_default_timezone_set(TIMEZONE);

require_once(BASE_DIR.'/html/store/app/Constants/Admin/user_roles_cst.php');
require_once(BASE_DIR.'/html/store/app/Constants/Admin/user_permission_cst.php');
require_once(BASE_DIR.'/html/store/app/Constants/Admin/users_cst.php');
require_once(BASE_DIR.'/html/store/app/Constants/Admin/lab_sessions_cst.php');
require_once(BASE_DIR.'/html/store/app/Constants/Admin/node_sessions_cst.php');
require_once(BASE_DIR.'/html/store/app/Constants/Admin/if_sessions_cst.php');
require_once(BASE_DIR.'/html/store/app/Constants/Control/control_cst.php');
require_once(BASE_DIR. '/html/includes/models/model_basic.php');

// Include classes and functions

require_once(BASE_DIR.'/html/includes/__lab.php');
require_once(BASE_DIR.'/html/includes/__network.php');
require_once(BASE_DIR.'/html/includes/__node.php');
require_once(BASE_DIR.'/html/includes/__textobject.php');
require_once(BASE_DIR.'/html/includes/__picture.php');
require_once(BASE_DIR.'/html/includes/functions.php');
require_once(BASE_DIR.'/html/includes/messages_en.php');
require_once(BASE_DIR.'/html/includes/Parsedown.php');
require_once(BASE_DIR.'/html/includes/exceptions/response.php');

require_once(BASE_DIR.'/html/devices/interfc.php');
require_once(BASE_DIR.'/html/devices/device.php');
require_once(BASE_DIR.'/html/devices/functions.php');

require_once(BASE_DIR.'/html/includes/cli.php');


?>
