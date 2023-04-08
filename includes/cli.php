<?php
# vim: syntax=php tabstop=4 softtabstop=0 noexpandtab laststatus=1 ruler

/**
 * html/includes/cli.php
 *
 * Various functions for UNetLab CLI handler.
 *
 * @author Andrea Dainese <andrea.dainese@gmail.com>
 * @copyright 2014-2016 Andrea Dainese
 * @license BSD-3-Clause https://github.com/dainok/unetlab/blob/master/LICENSE
 * @link http://www.unetlab.com/
 * @version 20160719
 */

/**
 * Function to create a bridge
 *
 * @param   string  $s                  Bridge name
 * @return  int                         0 means ok
 */
function addBridge($s)
{

	$s['name'] = secureCmd($s['name']);

	if (!isBridge($s['name']) || !isInterface($s['name'])) {
		// Bridge already present
		error_log(date('M d H:i:s ') . 'INFO: Add network bridge - bridge present ' . $s['name']);
		$cmd = 'brctl addbr ' . $s['name'] . ' 2>&1';
		error_log(date('M d H:i:s ') . 'INFO: create bridge  ' . $cmd);
		exec($cmd, $o, $rc);
		if ($rc != 0) {
			// Failed to add the bridge
			error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80026]);
			error_log(date('M d H:i:s ') . implode("\n", $o));
			return 80026;
		}

		$cmd = 'sysctl -w net.ipv6.conf.' . $s['name'] . '.disable_ipv6=1';
		error_log(date('M d H:i:s ') . 'INFO: ' . $cmd);
		exec($cmd, $o, $rc);
		if ($rc != 0) {
			// Failed to disable IPV6
			error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80089]);
			error_log(date('M d H:i:s ') . implode("\n", $o));
			return 80089;
		}
	}

	$cmd = 'ip link set dev ' . $s['name'] . ' up 2>&1';
	exec($cmd, $o, $rc);
	if ($rc != 0) {
		// Failed to activate it
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80027]);
		error_log(date('M d H:i:s ') . implode("\n", $o));
		return 80027;
	}

	if (!preg_match('/^pnet[\d\w]+$/', $s['name'])) {
		// Forward all frames on non-cloud bridges
		$cmd = 'sudo echo 65535 > /sys/class/net/' . $s['name'] . '/bridge/group_fwd_mask 2>&1';
		
		exec($cmd, $o, $rc);
		if ($rc != 0) {
			// Failed to configure forward mask
			error_log(date('M d H:i:s ') . 'ERROR: ' . $cmd . " --- " . $GLOBALS['messages'][80028]);
			error_log(date('M d H:i:s ') . implode("\n", $o));
			return 80028;
		}

		// Disable multicast_snooping
		$cmd = 'sudo echo 0 > /sys/devices/virtual/net/' . $s['name'] . '/bridge/multicast_snooping 2>&1';
		exec($cmd, $o, $rc);
		if ($rc != 0) {
			// Failed to configure multicast_snooping
			error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80071]);
			error_log(date('M d H:i:s ') . implode("\n", $o));
			return 80071;
		}
	}

	if ($s['count'] == 2) {

		$cmd = 'brctl setageing ' . $s['name'] . ' 0 2>&1';
		exec($cmd, $o, $rc);
		if ($rc != 0) {
			error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80055]);
			error_log(date('M d H:i:s ') . implode("\n", $o));
			return 80055;
		}
		
		$cmd = 'sudo echo 2 > /sys/class/net/' . $s['name'] . '/bridge/multicast_router  2>&1';
		exec($cmd, $o, $rc);
		if ($rc != 0) {
			error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80055]);
			error_log(date('M d H:i:s ') . implode("\n", $o));
			return 80055;
		}
	}

	return 0;
}

/**
 * Function to stop a node.
 *
 * @param   Array   $p                  Parameters
 * @return  int                         0 means ok
 */
function addNetwork($p)
{
	if (!isset($p['name']) || !isset($p['type'])) {
		// Missing mandatory parameters
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80021]);
		return 80021;
	}

	switch ($p['type']) {
		default:
			if (in_array($p['type'], listClouds())) {
				// Cloud already exists
			} else if (preg_match('/^pnet[\d\w]+$/', $p['type'])) {
				// Cloud does not exist
				error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80056]);
				return 80056;
			} else {
				// Should not be here
				error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80020]);
				return 80020;
			}
			break;
		case 'bridge':
			error_log(date('M d H:i:s ') . 'INFO: Add network bridge ' . $p['name']);
			if (isOvs($p['name'])) {
				// OVS exists -> delete it and add bridge
				$rc = delOvs($p['name']);
				if ($rc != 0) {
					return $rc;
				}
			} 
			// OVS deleted, create the bridge
			return addBridge($p);
			break;
		case 'ovs':
			if (!isInterface($p['name'])) {
				// Interface does not exist -> create OVS
				return addOvs($p['name']);
			} else if (isOvs($p['name'])) {
				// OVS already present
				return 0;
			} else if (isBridge($p['name'])) {
				// Bridge exists -> delete it and add OVS
				$rc = delBridge($p['name']);
				if ($rc == 0) {
					// Bridge deleted, create the OVS
					return addOvs($p['name']);
				} else {
					// Failed to delete Bridge
					return $rc;
				}
			} else {
				// Non bridge/OVS interface exist -> cannot create
				error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80022]);
				return 80022;
			}
			break;
	}
	return 0;
}

/*
 * Function to create an OVS
 *
 * @param   string  $s                  OVS name
 * @return  int                         0 means ok
 */
function addOvs($s)
{
	$s = secureCmd($s);
	$cmd = 'ovs-vsctl add-br ' . $s . ' 2>&1';
	exec($cmd, $o, $rc);
	if ($rc != 0) {
		// Failed to add the OVS
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80023]);
		error_log(date('M d H:i:s ') . implode("\n", $o));
		return 80023;
	}
	// ADD BPDU CDP option
	$cmd = "ovs-vsctl set bridge " . $s . " other-config:forward-bpdu=true";
	exec($cmd, $o, $rc);
	if ($rc == 0) {
		return 0;
	} else {
		// Failed to add  OVS OPTION
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80023]);
		error_log(date('M d H:i:s ') . implode("\n", $o));
		return 80023;
	}
}

/**
 * Function to create a TAP interface
 *
 * @param   string  $s                  Network name
 * @return  int                         0 means ok
 */
function addTap($s, $u)
{
	$s = secureCmd($s);
	$u = secureCmd($u);
	// TODO if already exist should fail?
	$cmd = 'sudo tunctl -u ' . $u . ' -g root -t ' . $s . ' 2>&1';
	error_log(date('M d H:i:s ') . 'INFO: ' . $cmd);
	exec($cmd, $o, $rc);
	if ($rc != 0) {
		// Failed to add the TAP interface
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80032]);
		error_log(date('M d H:i:s ') . implode("\n", $o));
		return 80032;
	}

	$cmd = 'sudo sysctl -w net.ipv6.conf.' . $s . '.disable_ipv6=1';
	error_log(date('M d H:i:s ') . 'INFO: ' . $cmd);
	exec($cmd, $o, $rc);
	if ($rc != 0) {
		// Failed to disable IPV6 
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80089]);
		error_log(date('M d H:i:s ') . implode("\n", $o));
		return 80089;
	}

	$cmd = 'sudo ip link set dev ' . $s . ' up 2>&1';
	exec($cmd, $o, $rc);
	if ($rc != 0) {
		// Failed to activate the TAP interface
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80033]);
		error_log(date('M d H:i:s ') . implode("\n", $o));
		return 80033;
	}

	$cmd = 'sudo ip link set dev ' . $s . ' mtu 9000';
	exec($cmd, $o, $rc);
	if ($rc != 0) {
		// Failed to activate the TAP interface
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80085]);
		error_log(date('M d H:i:s ') . implode("\n", $o));
		return 80085;
	}

	return 0;
}

/**
 * Function to check if a tenant has a valid username.
 *
 * @param   int     $i                  Tenant ID
 * @return  bool                        True if valid
 */
function checkUsername($i)
{
	$i = secureCmd($i);
	if ((int) $i < 0) {
		// Tenand ID is not valid
		return False;
	} else {
		// Just to be sure
		$i = (int) $i;
	}

	if (!is_dir('/opt/unetlab/users')) {
		$cmd = 'mkdir /opt/unetlab/users > /dev/null 2>&1';
		exec($cmd, $o, $rc);
		$cmd = '/bin/chown -R root:unl /opt/unetlab/users > /dev/null 2>&1';
		exec($cmd, $o, $rc);
		$cmd = '/bin/chmod -R 2775 /opt/unetlab/users > /dev/null 2>&1';
		exec($cmd, $o, $rc);
	}

	$path = '/opt/unetlab/users/' . $i;
	$uid = 32768 + $i;

	$cmd = 'id unl' . $i . ' 2>&1';
	exec($cmd, $o, $rc);
	if ($rc != 0) {
		// Need to add the user
		$cmd = 'sudo /usr/sbin/useradd -c "Unified Networking Lab TID=' . $i . '" -d ' . $path . ' -g unl -M -s /bin/bash -u ' . $uid . ' unl' . $i . ' 2>&1';
		error_log(date('M d H:i:s ') . 'ERROR: ' . $cmd);
		exec($cmd, $o, $rc);
		if ($rc != 0) {
			// Failed to add the username
			error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80009]);
			error_log(date('M d H:i:s ') . implode("\n", $o));
			return False;
		}
	}

	// Now check if the home directory exists
	if (!is_dir($path) && !mkdir($path, 2755, true)) {
		// Failed to create the home directory
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80010]);
		return False;
	}

	// Be sure of the setgid bit
	if ($rc != 0) {
		// Failed to set the setgid bit
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80011]);
		error_log(date('M d H:i:s ') . implode("\n", $o));
		return False;
	}

	// Set permissions
	if (!chown($path, 'unl' . $i)) {
		// Failed to set owner and/or group
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80012]);
		return False;
	}

	// Last, link the profile
	if (!file_exists($path . '/.profile') && !symlink('/opt/unetlab/wrappers/unl_profile', $path . '/.profile')) {
		// Failed to link the profile
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80013]);
		return False;
	}

	return True;
}

/**
 * Function to connect an interface (TAP) to a network (Bridge/OVS)
 *
 * @param   string  $n                  Network name
 * @param   string  $p                  Interface name
 * @return  int                         0 means ok
 */
function connectInterface($n, $p)
{
	$n = secureCmd($n);
	$p = secureCmd($p);
	if (isBridge($n)) {
		$cmd = 'sudo brctl addif ' . $n . ' ' . $p . ' 2>&1';
		error_log(date('M d H:i:s ') . $cmd);
		exec($cmd, $o, $rc);
		if ($rc == 0) {
			return 0;
		} else {
			// Failed to add interface to Bridge
			error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80030]);
			error_log(date('M d H:i:s ') . implode("\n", $o));
			return 80030;
		}
	} else if (isOvs($n)) {
		$cmd = 'sudo ovs-vsctl add-port ' . $n . ' ' . $p . ' 2>&1';
		exec($cmd, $o, $rc);
		if ($rc == 0) {
			return 0;
		} else {
			// Failed to add interface to OVS
			error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80031]);
			error_log(date('M d H:i:s ') . implode("\n", $o));
			return 80031;
		}
	} else {
		// Network not found
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80029]);
		return 80029;
	}
}


function disconnectInterface($n, $p)
{
	$n = secureCmd($n);
	$p = secureCmd($p);
	if (isBridge($n)) {
		$cmd = 'sudo brctl delif ' . $n . ' ' . $p . ' 2>&1';
		error_log(date('M d H:i:s ') . $cmd);
		exec($cmd, $o, $rc);
		
		if ($rc == 0) {
			return 0;
		} else {
			// Failed to add interface to Bridge
			error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80030]);
			error_log(date('M d H:i:s ') . implode("\n", $o));
			return 80030;
		}
	} else if (isOvs($n)) {
		$cmd = 'sudo ovs-vsctl del-port ' . $n . ' ' . $p . ' 2>&1';
		exec($cmd, $o, $rc);
		if ($rc == 0) {
			return 0;
		} else {
			// Failed to add interface to OVS
			error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80031]);
			error_log(date('M d H:i:s ') . implode("\n", $o));
			return 80031;
		}
	} else {
		// Network not found
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80029]);
		return 80029;
	}
}

/**
 * Function to delete a bridge
 *
 * @param   string  $s                  Bridge name
 * @return  int                         0 means ok
 */
function delBridge($s)
{
	$s = secureCmd($s);
	// Need to deactivate it
	$cmd = 'sudo ip link set dev ' . $s . ' down 2>&1';
	exec($cmd, $o, $rc);

	$cmd = 'sudo brctl delbr ' . $s . ' 2>&1';
	exec($cmd, $o, $rc);
	if ($rc == 0) {
		return 0;
	} else {
		// Failed to delete the OVS
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80025]);
		error_log(date('M d H:i:s ') . implode("\n", $o));
		return 80025;
	}
}

/**
 * Function to delete an OVS
 *
 * @param   string  $s                  OVS name
 * @return  int                         0 means ok
 */
function delOvs($s)
{
	$s = secureCmd($s);
	$cmd = 'sudo ovs-vsctl del-br ' . $s . ' 2>&1';
	exec($cmd, $o, $rc);
	if ($rc == 0) {
		return 0;
	} else {
		// Failed to delete the OVS
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80024]);
		error_log(date('M d H:i:s ') . implode("\n", $o));
		return 80024;
	}
}

/**
 * Function to delete a TAP interface
 *
 * @param   string  $s                  Interface name
 * @return  int                         0 means ok
 */
function delTap($s)
{
	$s = secureCmd($s);
	if (isInterface($s)) {
		// Remove interface from OVS switches
		$cmd = 'sudo ip link set dev ' . $s . ' down 2>&1';
		exec($cmd, $o, $rc);
		$cmd = 'sudo ip link delete ' . $s . ' 2>&1';
		exec($cmd, $o, $rc);
		$cmd = 'sudo ovs-vsctl del-port ' . $s . ' 2>&1';
		exec($cmd, $o, $rc);

		// Delete TAP (so it's removed from bridges too)
		$cmd = 'sudo tunctl -d ' . $s . ' 2>&1';
		error_log($cmd);
		exec($cmd, $o, $rc);
		
		if (isInterface($s)) {
			// Failed to delete the TAP interface
			error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80034]);
			error_log(date('M d H:i:s ') . implode("\n", $o));
			return 80034;
		} else {
			return 0;
		}
	} else {
		// Interface does not exist
		return 0;
	}
}

/**
 * Function to push startup-config to a file
 *
 * @param   string  $config_data        The startup-config
 * @param   string  $file_path          File with full path where config is stored
 * @return  bool                        true if config dumped
 */
function dumpConfig($config_data, $file_path)
{
	$fp = fopen($file_path, 'w');
	if (!isset($fp)) {
		// Cannot open file
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80068]);
		return False;
	}

	if (!fwrite($fp, $config_data)) {
		// Cannot write file
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][80069]);
		return False;
	}

	return True;
}

/**
 * Function to export a node running-config.
 *
 * @param   int     $node_id            Node ID
 * @param   Node    $n                  Node
 * @param   Lab     $lab                Lab
 * @return  int                         0 means ok
 */
function export($n, $lab)
{
	
	$result = $n->export();
	if($result != 0) return $result;

	$lab->save();
	
	return 0;
}

/**
 * Function to check if a bridge exists
 *
 * @param   string  $s                  Bridge name
 * @return  bool                        True if exists
 */
function isBridge($s)
{
	$s = secureCmd($s);
	$cmd = 'brctl show ' . $s . ' 2>&1';
	exec($cmd, $o, $rc);
	if (preg_match('/8000/', $o[1])) {
		// "brctl show" on a ovs bridge or on a non-existent bridge return 0 -> check for 8000
		return True;
	} else {
		return False;
	}
}

/**
 * Function to check if a interface exists
 *
 * @param   string  $s                  Interface name
 * @return  bool                        True if exists
 */
function isInterface($s)
{
	$s = secureCmd($s);
	$cmd = 'sudo ip link show ' . $s . ' 2>&1';
	exec($cmd, $o, $rc);
	if ($rc == 0) {
		return True;
	} else {
		return False;
	}
}

function isInterfaceUp($s)
{
	$s = secureCmd($s);
	$cmd = 'sudo ip link show ' . $s . ' | grep UP';
	exec($cmd, $o, $rc);
	if(count($o) > 0) return true;
	return false;
}

/**
 * Function to check if an OVS exists
 *
 * @param   string  $s                  OVS name
 * @return  bool                        True if exists
 */
function isOvs($s)
{
	$s = secureCmd($s);
	$cmd = 'ovs-vsctl br-exists ' . $s . ' 2>&1';
	exec($cmd, $o, $rc);
	if ($rc == 0) {
		return True;
	} else {
		return False;
	}
}

/**
 * Function to check if a node is running.
 *
 * @param   int     $p                  Port
 * @return  bool                        true if running
 */
function isRunning($p)
{
	$p = secureCmd($p);
	// If node is running, the console port is used
	$cmd = 'fuser -n tcp ' . $p . ' 2>&1';
	exec($cmd, $o, $rc);
	if ($rc == 0) {
		return True;
	} else {
		return False;
	}
}

/**
 * Function to check if a TAP interface exists
 *
 * @param   string  $s                  Interface name
 * @return  bool                        True if exists
 */
function isTap($s)
{
	$s = secureCmd($s);
	if (is_dir('/sys/class/net/' . $s)) {
		// TODO can be bridge or OVS
		return True;
	} else {
		return False;
	}
}


/**
 * Function to start a node.
 *
 * @param   Node    $n                  Node
 * @param   Int     $id                 Node ID
 * @param   Int     $t                  Tenant ID
 * @param   Array   $nets               Array of networks
 * @param   int     $scripttimeout      Config Script Timeout
 * @return  int                         0 means ok
 */
function start($lab, $id)
{
	
	$n = $lab->getNodes()[$id];
	$t = $lab->getHost();
	
	if($t === null) return 1;
	
	if ($n->getStatus() !== 0) {
		return 0;
	}
	
	return $n->start();

}

/**
 * Function to stop a node.
 *
 * @param   Node    $n                  Node
 * @return  int                         0 means ok
 */
function stop($n)
{
	$n->stop();
}


function wipe($n)
{
	$n->wipe();
}

/**
 * Function to print how to use the unl_wrapper
 *
 * @return  string                      usage output
 */
function usage()
{
	global $argv;
	$output = '';
	$output .= "Usage: " . $argv[0] . " -a <action> <options>\n";
	$output .= "-a <s>     Action can be:\n";
	$output .= "           - delete: delete a lab file even if it's not valid\n";
	$output .= "                     requires -T, -F\n";
	$output .= "           - export: export a runnign-config to a file\n";
	$output .= "                     requires -T, -F, -D is optional\n";
	$output .= "           - fixpermissions: fix file/dir permissions\n";
	$output .= "           - platform: print the hardware platform\n";
	$output .= "           - start: start one or all nodes\n";
	$output .= "                     requires -T, -F, -D is optional\n";
	$output .= "           - stop: stop one or all nodes\n";
	$output .= "                     requires -T, -F, -D is optional\n";
	$output .= "           - wipe: wipe one or all nodes\n";
	$output .= "                     requires -T, -F, -D is optional\n";
	$output .= "Options:\n";
	$output .= "-F <n>     Lab file\n";
	$output .= "-T <n>     Tenant ID\n";
	$output .= "-D <n>     Device ID (if not used, all devices will be impacted)\n";
	$output .= "-S <n>     Lab Session\n";
	print($output);
}
