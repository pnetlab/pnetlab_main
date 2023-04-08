<?php
# vim: syntax=php tabstop=4 softtabstop=0 noexpandtab laststatus=1 ruler

/**
 * html/includes/api_status.php
 *
 * Various system status commands for REST APIs.
 *
 * @author Andrea Dainese <andrea.dainese@gmail.com>
 * @copyright 2014-2016 Andrea Dainese
 * @license BSD-3-Clause https://github.com/dainok/unetlab/blob/master/LICENSE
 * @link http://www.unetlab.com/
 * @version 20160719
 */

/*
 * Function to get CPU usage percentage.
 *
 * @return  int                         CPU usage (percentage) or -1 if not valid
 */
function apiGetCPUUsage() {
	// Checking CPU usage
	$cmd = 'top -b -n2 -p1 -d1';
	exec($cmd, $o, $rc);
	if ($rc == 0) {
		return 100 - (int) round(preg_replace('/^.+ni[, ]+([0-9\.]+) id,.+/', '$1', $o[11]));
	} else {
		return -1;
	}
}

/*
 * Function to get disk usage percentage.
 *
 * @return  int                         Disk usage (percentage) or -1 if not valid
 */
function apiGetDiskUsage() {
	// Checking disk usage
	$cmd = 'df -h /';
	exec($cmd, $o, $rc);
	if ($rc == 0) {
		return (int) preg_replace('/^.+ ([0-9]+)% .+/', '$1', $o[1]);
	} else {
		return -1;
	}
}

/*
 * Function to get mem usage percentage.
 *
 * @return  Array                       RAM usage (percentage) as cache and data or -1 if not valid
 */
function apiGetOldMemUsage() {
	// Checking RAM usage
	$cmd = 'free';
	exec($cmd, $o, $rc);
	if ($rc == 0) {
		$total = (int) preg_replace('/^Mem:\ +([0-9\.]+)\ +([0-9\.]+)\ +([0-9\.]+)\ +([0-9\.]+)\ +([0-9\.]+)\ +([0-9\.]+)$/', '$1', $o[1]);
		$used = (int) preg_replace('/^Mem:\ +([0-9\.]+)\ +([0-9\.]+)\ +([0-9\.]+)\ +([0-9\.]+)\ +([0-9\.]+)\ +([0-9\.]+)$/', '$2', $o[1]);
		$cached = (int) preg_replace('/^Mem:\ +([0-9\.]+)\ +([0-9\.]+)\ +([0-9\.]+)\ +([0-9\.]+)\ +([0-9\.]+)\ +([0-9\.]+)$/', '$6', $o[1]);
		return Array(round($cached / $total * 100), round(($used - $cached) / $total * 100));
	} else {
		return Array(-1, -1);
	}
}

function apiGetMemUsage() {
	$data = explode("\n", file_get_contents("/proc/meminfo"));
	array_pop($data) ;
	$meminfo = array();
	foreach ($data as $line) {
		list($key, $val) = explode(":", $line);
		$meminfo[$key] = (int) preg_replace('/^([0-9\.]+)\ +.*$/','$1',trim($val));
	}
	$total=$meminfo["MemTotal"];
	$cached=$meminfo["Cached"];
	$avail=$meminfo["MemAvailable"];
	return Array(round(100 - ($cached / $total * 100)), round(100 - ($avail / $total * 100)));
}

/*
 * Function to running wrapper for IOL, Dynamips and QEMU.
 *
 * @return  Array                       Running IOL/Dynamips/QEMU wrappers or -1 if not valid
 */
function apiGetRunningWrappers() {
	// Checking running wrappers
	$cmd = 'pgrep -f -c -P 1 iol_wrapper';
	exec($cmd, $o_iol, $rc);
	$cmd = 'pgrep -f -c -P 1 dynamips_wrapper';
	exec($cmd, $o_dynamips, $rc);
	$cmd = 'pgrep -f -c -P 1 qemu_wrapper';
	exec($cmd, $o_qemu, $rc);
	$cmd= 'docker -H=tcp://127.0.0.1:4243 ps -q | wc -l';
	exec($cmd, $o_docker, $rc);
	$cmd = 'pgrep -f -c -P 1 vpcs';
	exec($cmd, $o_vpcs, $rc);
	return Array((int) current($o_iol), (int) current($o_dynamips), (int) current($o_qemu), (int) current($o_docker), (int) current($o_vpcs));
}

/*
 * Function to get swap usage percentage.
 *
 * @return  int                         Swap usage (percentage) or -1 if not valid
 */
function apiGetSwapUsage() {
	// Checking swap usage
	$cmd = 'free';
	exec($cmd, $o, $rc);
	if ($rc == 0) {
		$total = (int) preg_replace('/^Swap:\ +([0-9\.]+)\ +([0-9\.]+)\ +([0-9\.]+)$/', '$1', $o[2]);
		$used = (int) preg_replace('/^Swap:\ +([0-9\.]+)\ +([0-9\.]+)\ +([0-9\.]+)$/', '$3', $o[2]);
		return ( $total != 0 ) ? 100 - round($used / $total * 100) : 0 ;
	} else {
		return -1;
	}
}
/*
 * Function to set UKSM status.
 *
 * @return  Bool Success operation
 */

function apiSetUksm($p) {
     if  ( $p['state'] == true ) {
           $cmd = "sudo /opt/unetlab/wrappers/unl_wrapper -a uksmon" ;
           error_log(date('M d H:i:s ').'DEBUG: uksm on' );
     } else {
           $cmd = "sudo /opt/unetlab/wrappers/unl_wrapper -a uksmoff" ;
           error_log(date('M d H:i:s ').'DEBUG: uksm off' );
     }
     exec($cmd, $o, $rc);
     if ($rc == 0 ) {
                $output['code'] = 200;
                $output['status'] = 'success';
                $output['message'] = $GLOBALS['messages'][60065];
     } else {
                $output['code'] = 400;
                $output['status'] = 'fail';
                $output['message'] = $GLOBALS['messages'][60066];
     }
     return $output;
}

/*
 * Function to set KSM status.
 *
 * @return  Bool Success operation
 */

function apiSetKsm($p) {
     if  ( $p['state'] == true ) {
           $cmd = "sudo /opt/unetlab/wrappers/unl_wrapper -a ksmon" ;
           error_log(date('M d H:i:s ').'DEBUG: uksm on' );
     } else {
           $cmd = "sudo /opt/unetlab/wrappers/unl_wrapper -a ksmoff" ;
           error_log(date('M d H:i:s ').'DEBUG: uksm off' );
     }
     exec($cmd, $o, $rc);
     if ($rc == 0 ) {
                $output['code'] = 200;
                $output['status'] = 'success';
                $output['message'] = $GLOBALS['messages'][60065];
     } else {
                $output['code'] = 400;
                $output['status'] = 'fail';
                $output['message'] = $GLOBALS['messages'][60066];
     }
     return $output;
}

/*
 * Function to set cpulimit  status.
 *
 * @return  Bool Success operation
 */

function apiSetCpuLimit($p) {
     if  ( $p['state'] == true ) {
           $cmd = "sudo /opt/unetlab/wrappers/unl_wrapper -a cpulimiton" ;
     } else {
           $cmd = "sudo /opt/unetlab/wrappers/unl_wrapper -a cpulimitoff" ;
     }
     exec($cmd, $o, $rc);
     if ($rc == 0 ) {
                $output['code'] = 200;
                $output['status'] = 'success';
                $output['message'] = $GLOBALS['messages'][60063];
     } else {
                $output['code'] = 400;
                $output['status'] = 'fail';
                $output['message'] = $GLOBALS['messages'][60064];
     }
     return $output;
}
?>
