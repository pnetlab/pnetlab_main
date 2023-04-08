<?php

function checkFolder($s)
{
	if (preg_match('/^\/[\/A-Za-z0-9_\\s-]*$/', $s) && is_dir($s)) {
		return 0;
	} else if (preg_match('/^\/[\/A-Za-z0-9_\\s-]*$/', $s)) {
		return 1;
	} else {
		return 2;
	}
}

/**
 * Function to check if a string is valid as interface_type.
 *
 * @param	string	$s					Parameter
 * @return	bool						True if valid
 */
function checkInterfcType($s)
{
	if (in_array($s, array('ethernet', 'serial'))) {
		return True;
	} else {
		return False;
	}
}

/**
 * Function to check if a string is valid as lab_filename.
 *
 * @param	string	$s					String to check
 * @return	bool						True if valid
 */
function checkLabFilename($s)
{
	if (preg_match('/^[A-Za-z0-9_\\s-]+\.unl$/', $s)) {
		return True;
	} else {
		return False;
	}
}

/**
 * Function to check if a string is valid as lab_name.
 *
 * @param	string	$s					String to check
 * @return	bool						True if valid
 */
function checkLabName($s)
{
	if (preg_match('/^[A-Za-z0-9_\\s-]+$/', $s)) {
		return True;
	} else {
		return False;
	}
}

/**
 * Function to check if a string is valid as lab_path.
 *
 * @param	string	$s					String to check
 * @return	bool						True if valid
 */
function checkLabPath($s)
{
	if (preg_match('/^\/[\/A-Za-z0-9_\\s-]*$/', $s)) {
		return True;
	} else {
		return False;
	}
}

/**
 * Function to check if a string is valid as network_type.
 *
 * @param	string	$s					Parameter
 * @return	bool						True if valid
 */
function checkNetworkType($s)
{
	if (in_array($s, listNetworkTypes())) {
		return True;
	} else {
		return False;
	}
}


/**
 * Function to check if a string is valid as a picture_type. Currently only
 * PNG and JPEG images are supported.
 *
 * @param	string	$s					String to check
 * @return	bool						True if valid
 */
function checkPictureType($s)
{
	if (in_array($s, array('image/png', 'image/jpeg'))) {
		return True;
	} else {
		return False;
	}
}

/**
 * Function to check if a string is valid as a position.
 *
 * @param	string	$s					String to check
 * @return	bool						True if valid
 */
function checkPosition($s)
{
	if (preg_match('/^[0-9]+$/', $s) && $s >= 0) {
		return True;
	} else {
		return False;
	}
}
/**
 * Function to check if a string is valid as UUID.
 *
 * @param	string	$s					String to check
 * @return	bool						True if valid
 */
function checkUuid($s)
{
	if (preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/', $s)) {
		return True;
	} else {
		return False;
	}
}

/**
 * Function to generate a v4 UUID.
 *
 * @return	string						The generated UUID
 */
function genUuid()
{
	return sprintf(
		'%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
		// 32 bits for "time_low"
		mt_rand(0, 0xffff),
		mt_rand(0, 0xffff),

		// 16 bits for "time_mid"
		mt_rand(0, 0xffff),

		// 16 bits for "time_hi_and_version",
		// four most significant bits holds version number 4
		mt_rand(0, 0x0fff) | 0x4000,

		// 16 bits, 8 bits for "clk_seq_hi_res",
		// 8 bits for "clk_seq_low",
		// two most significant bits holds zero and one for variant DCE1.1
		mt_rand(0, 0x3fff) | 0x8000,

		// 48 bits for "node"
		mt_rand(0, 0xffff),
		mt_rand(0, 0xffff),
		mt_rand(0, 0xffff)
	);
}


/**
 * Function to check if mac address format is valid
 *
 * @return   int (Bool)   
 */

function IsValidMac($mac)
{
	return (preg_match('/([a-fA-F0-9]{2}[:]?){6}/', $mac) == 1);
}
/** 
 * Function to Increment mac address
 *
 * @return string  Next Mac
 */

function incMac($mac, $n)
{
	$nmac = substr("000000000000" . dechex(hexdec(str_replace(":", '', $mac)) + $n), -12);
	$fmac = trim((preg_replace('/../', '$0:', $nmac)), ":");
	return $fmac;
}

/**
 * Function to check if UNetLab is running as a VM.
 *
 * @return	bool						True is is a VM
 */
function isVirtual()
{

	$cmd = 'sudo /opt/unetlab/wrappers/unl_wrapper -a platform';
	exec($cmd, $o, $rc);
	$o = implode('', $o);
	switch ($o) {
		default:
			return False;
		case 'VMware Virtual Platform':
			return True;
		case 'VirtualBox':
			return True;
		case 'KVM':
			// QEMU (KVM)
			return True;
		case 'Bochs':
			// QEMU (emulated)
			return True;
		case 'Virtual Machine':
			// Microsoft VirtualPC
			return True;
		case 'Xen':
			// HVM domU
			return True;
		case (preg_match('/vmx.*/', $o) ? true : false):
			// vmx and ept present -> kvm accel available
			return False;
	}
}

/**
 * Function to list all available cloud interfaces (pnet*).
 *
 * @return	Array						The list of pnet interfaces
 */
function listClouds()
{
	$results = array();
	foreach (scandir('/sys/devices/virtual/net') as $interface) {
		if (preg_match('/^pnet[\d\w]+$/', $interface)) {
			$results[$interface] = $interface;
		}
	}
	return $results;
}

/**
 * Function to list all available network types.
 *
 * @return	Array						The list of network types
 */
function listNetworkTypes()
{
	$results = array();
	$results['bridge'] = 'bridge';
	$results['ovs'] = 'ovs';

	// Listing pnet interfaces
	foreach (scandir('/sys/devices/virtual/net') as $interface) {
		if (preg_match('/^pnet[\d\w]+$/', $interface)) {
			$results[$interface] = $interface;
		}
	}

	return $results;
}

/**
 * Function to list all available icons.
 *
 * @return	Array						The list of icons
 */
function listNodeIcons()
{
	$results = array();
	foreach (scandir(BASE_DIR . '/html/images/icons') as $filename) {
		if (is_file(BASE_DIR . '/html/images/icons/' . $filename) && preg_match('/^.+\.[png$\|jpg$]/', $filename)) {
			$patterns[0] = '/^(.+)\.\(png$\|jpg$\)/';  // remove extension
			$replacements[0] = '$1';
			$name = preg_replace($patterns, $replacements, $filename);
			$results[$filename] = $name;
		}
	}
	return $results;
}

/**
 * Function to list all available images.
 *
 * @param   string  $t                  Type of image
 * @param   string  $p                  Template of image
 * @return  Array                       The list of images
 */
function listNodeImages($t, $p)
{
	$results = array();

	switch ($t) {
		default:
			break;
		case 'iol':
			foreach (scandir(BASE_DIR . '/addons/iol/bin') as $name => $filename) {

				if ($p == 'iol') {
					if (preg_match('/^.+\.bin$/', $filename)) {
						$results[$filename] = $filename;
					}
				} else {
					if (preg_match('/^' . $p . '.*\.bin$/', $filename)) {
						$results[$filename] = $filename;
					}
				}
			}
			break;
		case 'qemu':
			foreach (scandir(BASE_DIR . '/addons/qemu') as $dir) {
				if (is_dir(BASE_DIR . '/addons/qemu/' . $dir) && preg_match('/^' . $p . '-.+$/', $dir)) {
					$results[$dir] = $dir;
				}
			}
			break;
		case 'dynamips':
			foreach (scandir(BASE_DIR . '/addons/dynamips') as $filename) {
				if (is_file(BASE_DIR . '/addons/dynamips/' . $filename) && preg_match('/^' . $p . '-.+\.(image|bin)$/', $filename)) {
					$results[$filename] = $filename;
				}
			}
			break;
		case 'docker':
			$cmd = 'docker -H=tcp://127.0.0.1:4243 images | sed \'s/^\([^[:space:]]\+\)[[:space:]]\+\([^[:space:]]\+\).\+/\1:\2/g\'';
			exec($cmd, $o, $rc);
			if (!empty($o) && sizeof($o) > 1) {
				unset($o[0]);	// Removing header
				foreach ($o as $image) {
					if ($p == 'docker') {
						$results[$image] = $image;
					} else {
						if (strpos($image, $p) !== false) {
							$results[$image] = $image;
						}
					}
				}
			}
			break;
		case 'vpcs':
			$results[] = "";
			break;
	}
	return $results;
}

/**
 * Function to scale an image maintaining the aspect ratio.
 *
 * @param   string  $image              The image
 * @param   int     $width              New width
 * @param   int     $height             New height
 * @return  string                      The resized image
 */
function resizeImage($image, $width, $height)
{
	$img = new Imagick();
	$img->readimageblob($image);
	$img->setImageFormat('png');
	$original_width = $img->getImageWidth();
	$original_height = $img->getImageHeight();

	if ($width > 0 && $height == 0) {
		// Use width to scale
		if ($width < $original_width) {
			$new_width = $width;
			$new_height = $original_height / $original_width * $width;
			$new_height > 0 ? $new_height : $new_height = 1; // Must be 1 at least
			$img->resizeImage($new_width, $new_height, Imagick::FILTER_LANCZOS, 1);
			return $img->getImageBlob();
		}
	} else if ($width == 0 && $height > 0) {
		// Use height to scale
		if ($height < $original_height) {
			$new_width = $original_width / $original_height * $height;
			$new_width > 0 ? $new_width : $new_width = 1; // Must be 1 at least
			$new_height = $height;
			$img->resizeImage($new_width, $new_height, Imagick::FILTER_LANCZOS, 1);
			return $img->getImageBlob();
		}
	} else if ($width > 0 && $height > 0) {
		// No need to keep aspect ratio
		$img->resizeImage($width, $height, Imagick::FILTER_LANCZOS, 1);
		return $img->getImageBlob();
	} else {
		// No need to resize, return the original image
		return $image;
	}
}


function EthFormat2val($s)
{
	// check if format exist
	$format = array();
	$format['prefix'] = 'e';
	$format['slotstart'] = 9999;
	$format['first'] = 0;
	$format['mod'] = 9999;
	$format['sep'] = 9999;
	preg_match('/(.*)\{(.*)\}(.*)\{(.*)\}/', $s, $m);
	if (!isset($m[4])) {
		preg_match('/(.*)\{(.*)\}/', $s, $m);
	}
	if (isset($m[1])) $format['prefix'] = $m[1];
	if (!isset($m[3]) || !isset($m[4])) {
		preg_match('/(\d+)/', $m[2], $n);
		if (isset($n[1])) $format['first'] = $n[1];
	} else {
		$format['slotstart'] = intval($m[2]);
		preg_match('/(\d+)\-(\d+)/', $m[4], $n);
		if (isset($n[1]) && isset($n[2])) {
			$format['first'] = intval($n[1]);
			$format['mod'] = intval($n[2]);
			$format['sep'] = $m[3];
		}
	}
	return $format;
}

function isExitConfigScript($templ)
{
	$p = yaml_parse_file(BASE_DIR . '/html/templates/' . $templ . '.yml');
	if (isset($p['config_script']) && $p['config_script'] != '') {
		return true;
	} else {
		return false;
	}
}

function getConfigScript($templ)
{
	$p = yaml_parse_file(BASE_DIR . '/html/templates/' . $templ . '.yml');
	if (isset($p['config_script']) && $p['config_script'] != '') {
		return $p['config_script'];
	} else {
		return '';
	}
}


