<?php

/**
 * 
 * @author LIN 
 * @copyright pnetlab.com
 * @link https://www.pnetlab.com/
 * 
 */

class Interfc
{
	private $id;
	private $name;
	private $networks = [];

	private $network_id;
	private $remote_id;
	private $remote_if;
	private $type; // serial or ethernet
	private $socket_file; // socket file for serial
	private $flag = '';

	private $style; // border style
	private $linkstyle; // link style
	private $color; //link color
	private $label; // link label
	private $linkcfg; // link configuration
	private $srcpos;
	private $dstpos;
	private $labelpos;
	private $width;
	private $fontsize;
	private $device;

	private $if_session; // session data

	public function __construct($device, $p, $id)
	{
		// Mandatory parameters
		if (!isset($p['type'])) {
			// Missing mandatory parameters
			error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][10000]);
			throw new Exception('10000');
			return 10000;
		}

		if (!checkInterfcType($p['type'])) {
			// Type is not valid
			error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][10001]);
			throw new Exception('10001');
			return 10001;
		}


		// Now building the interface
		$this->id = (int) $id;
		$this->type = $p['type'];
		$this->device = $device;
		$this->edit($p);
	}

	/**
	 * Method to add or replace the interface metadata.
	 * Editable attributes:
	 * - left
	 * - name
	 * - top
	 * If an attribute is set and is valid, then it will be used. If an
	 * attribute is not set, then the original is maintained. If in attribute
	 * is set and empty '', then the current one is deleted.
	 *
	 * @param   Array   $p                  Parameters
	 * @return  int                         0 means ok
	 */
	public function edit($p)
	{

		if (isset($p['networks'])) {
			$this->networks = $p['networks'];
		}

		$this->setInterfaceStyle($p);

		if (isset($p['name']) && $p['name'] === '') {
			$this->name = '';
			throw new Exception('No interface Name');
		} else if (isset($p['name'])) {
			$this->name = htmlentities($p['name']);
		}

		if ($this->type == 'ethernet') {
			if (isset($p['remote_id']) || isset($p['remote_if'])) {
				unset($p['remote_id']);
				unset($p['remote_if']);
				error_log(date('M d H:i:s ') . 'WARNING: ' . $GLOBALS['messages'][10004]);
			}

			if (isset($p['network_id']) && $p['network_id'] === '') {
				// Remote network is empty, unset the current one
				unset($this->network_id);
			} else if (isset($p['network_id']) && (int) $p['network_id'] <= 0) {
				throw new Exception('Network ID is not valid');
			} else if (isset($p['network_id'])) {
				$this->network_id = (int) $p['network_id'];
			}
		}

		if ($this->type == 'serial') {
			if (isset($p['network_id'])) {
				unset($p['network_id']);
				error_log(date('M d H:i:s ') . 'WARNING: ' . $GLOBALS['messages'][10005]);
			}

			if (isset($p['remote_id']) && $p['remote_id'] === '') {
				// Remote node ID is empty, unset the current one
				unset($this->remote_id);
				unset($this->remote_if);
			} else {

				if (isset($p['remote_id']) && (int) $p['remote_id'] <= 0) {
					// Remote ID is not valid
					throw new Exception('Remote ID is not valid');
				} else if (isset($p['remote_id'])) {
					$this->remote_id = (int) $p['remote_id'];
				}

				if (isset($p['remote_if']) && (int) $p['remote_if'] < 0) {
					// Remote IF is not valid
					throw new Exception('Remote IF is not valid');
				} else if (isset($p['remote_if'])) {
					$this->remote_if = (int) $p['remote_if'];
				}

				if (isset($p['socket_file'])) $this->socket_file = $p['socket_file'];
			}
		}

		if (isset($p['flag'])) $this->flag = $p['flag'];

		return 0;
	}


	public function addIfSession($labSessionId, $nodeSessionId, $ifSessions)
	{

		if (isset($ifSessions[$nodeSessionId . '_' . $this->id])) {
			$this->if_session = $ifSessions[$nodeSessionId . '_' . $this->id];
			return;
		}

		$ifModel = loadModel('if_sessions');
		$this->if_session = [
			IF_SESSION_LAB => $labSessionId,
			IF_SESSION_NODE => $nodeSessionId,
			IF_SESSION_IFID => $this->id,
			IF_SESSION_TYPE => $this->type,
		];
		$result = $ifModel->insert($this->if_session);
		return $result;
	}

	/**
	 * Method to get network name.
	 *
	 * @return  string                      ID
	 */
	public function getId()
	{
		if (isset($this->id)) {
			return $this->id;
		} else {
			// By default return an empty string
			return '';
		}
	}

	/**
	 * Method to get network name.
	 *
	 * @return  string                      Network name
	 */
	public function getName()
	{
		if (isset($this->name)) {
			return $this->name;
		} else {
			// By default return an empty string
			return '';
		}
	}

	/**
	 * Method to get remote network ID.
	 * 
	 * @return	string                      Remote network ID or 0 if not set or not "ethernet" type
	 */
	public function getNetworkId()
	{
		if ($this->type == 'ethernet' && isset($this->network_id)) {
			return $this->network_id;
		} else {
			return 0;
		}
	}

	/**
	 * Method to get interface type.
	 * 
	 * @return	string                      Interface type
	 */
	public function getNType()
	{
		return $this->type;
	}

	/**
	 * Method to get remote node ID.
	 * 
	 * @return	int                         Remote node ID or 0 if not connected or not "serial" type
	 */
	public function getRemoteId()
	{
		if ($this->type == 'serial' && isset($this->remote_id)) {
			return $this->remote_id;
		} else {
			return 0;
		}
	}

	/**
	 * Method to get remote interface ID.
	 * 
	 * @return	int                         Remote interface ID or 0 if not connected or not "serial" type
	 */
	public function getRemoteIf()
	{
		if ($this->type == 'serial' && isset($this->remote_if)) {
			return $this->remote_if;
		} else {
			return 0;
		}
	}

	public function getStyle()
	{
		return $this->style;
	}

	public function getLinkstyle()
	{
		return $this->linkstyle;
	}

	public function getColor()
	{
		return $this->color;
	}

	public function getLabel()
	{
		return $this->label;
	}

	public function getLinkcfg()
	{
		return $this->linkcfg;
	}

	public function getLabelpos()
	{
		return $this->labelpos;
	}

	public function getSrcpos()
	{
		return $this->srcpos;
	}

	public function getDstpos()
	{
		return $this->dstpos;
	}


	public function getSocketFile()
	{
		return $this->socket_file;
	}

	public function getFlag()
	{
		return $this->flag;
	}


	/** Functions for interface style */
	public function setInterfaceStyle($p)
	{
		if (isset($p['style'])) $this->style = $p['style'];
		if (isset($p['linkstyle'])) $this->linkstyle = $p['linkstyle'];
		if (isset($p['color'])) $this->color = $p['color'];
		if (isset($p['label'])) $this->label = $p['label'];
		if (isset($p['linkcfg'])) $this->linkcfg = $p['linkcfg'];
		if (isset($p['labelpos'])) $this->labelpos = $p['labelpos'];
		if (isset($p['srcpos'])) $this->srcpos = $p['srcpos'];
		if (isset($p['dstpos'])) $this->dstpos = $p['dstpos'];
		if (isset($p['width'])) $this->width = $p['width'];
		if (isset($p['fontsize'])) $this->fontsize = $p['fontsize'];
	}

	public function getInterfaceStyle()
	{
		return [
			'style' => get($this->style, ''),
			'linkstyle' => get($this->linkstyle, ''),
			'color' => get($this->color, ''),
			'label' => get($this->label, ''),
			'linkcfg' => get($this->linkcfg, ''),
			'labelpos' => get($this->labelpos, ''),
			'srcpos' => get($this->srcpos, ''),
			'dstpos' => get($this->dstpos, ''),
			'width' => get($this->width, ''),
			'fontsize' => get($this->fontsize, ''),
		];
	}


	/** Functions for interface quality */
	/**
	 * @param Quality data
	 * @return Update quality data to interface session in database. Deploy configuration to system
	 * Is called when user set quality for interface
	 */
	public function setQuality($p)
	{
		$dataArray = [];
		if (isset($p['delay'])) $dataArray['delay'] = $p['delay'];
		if (isset($p['jitter'])) $dataArray['jitter'] = $p['jitter'];
		if (isset($p['bandwidth'])) $dataArray['bandwidth'] = $p['bandwidth'];
		if (isset($p['loss'])) $dataArray['loss'] = $p['loss'];
		$data = json_encode($dataArray);

		$ifModel = loadModel('if_sessions');
		if (isset($this->if_session[IF_SESSION_NODE]) && isset($this->if_session[IF_SESSION_IFID])) {
			$result = $ifModel->update([
				IF_SESSION_QUALITY => $data
			], [
				[IF_SESSION_NODE, '=', $this->if_session[IF_SESSION_NODE]],
				[IF_SESSION_IFID, '=', $this->if_session[IF_SESSION_IFID]]
			]);

			if ($result) {
				$this->if_session[IF_SESSION_QUALITY] = $data;
			}
		}

		$this->applyQuality();
	}

	/** 
	 * Remote quality data from interface session in database
	 * Is called when user unlink a interface
	 */
	public function removeQuality()
	{
		$ifModel = loadModel('if_sessions');
		if (isset($this->if_session[IF_SESSION_NODE]) && isset($this->if_session[IF_SESSION_IFID])) {
			$result = $ifModel->update([
				IF_SESSION_QUALITY => null
			], [
				[IF_SESSION_NODE, '=', $this->if_session[IF_SESSION_NODE]],
				[IF_SESSION_IFID, '=', $this->if_session[IF_SESSION_IFID]]
			]);

			if ($result) {
				$this->if_session[IF_SESSION_QUALITY] = null;
				return true;
			}
		}
	}

	/** 
	 * @return Quality configuration of interface
	 */
	public function getQuality()
	{
		if (isset($this->if_session[IF_SESSION_QUALITY])) {
			$quality = json_decode($this->if_session[IF_SESSION_QUALITY], true);
			if (!$quality) $quality = [];

			return $quality;
		}
		return [];
	}

	/**
	 * Apply quality configuration to system
	 * Is called when user set quality to interface and node is started
	 */
	public function applyQuality()
	{

		if ($this->type == 'serial') return 0;
		$vunl = 'vunl' . $this->if_session[IF_SESSION_NODE] . '_' . $this->id;
		if (!isInterface($vunl)) return 0;

		$p = $this->getQuality();
		$delay = '';
		if (isset($p['delay']) && $p['delay'] != '') {
			$delay = ' delay ' . $p['delay'] . 'ms';
			if (isset($p['jitter']) && $p['jitter'] != '') $delay .= ' ' . $p['jitter'] . 'ms';
		}

		$loss = '';
		if (isset($p['loss']) && $p['loss'] != '') $loss = ' loss ' . $p['loss'] . '%';

		$bandwidth = '';
		if (isset($p['bandwidth']) && $p['bandwidth'] != '') $bandwidth = ' rate ' . $p['bandwidth'] . 'Kbit';

		if ($delay == '' && $loss == '' && $bandwidth == '') {
			$this->unApplyQuality();
			return 0;
		}

		$cmd = secureCmd('sudo tc qdisc replace dev ' . $vunl . ' root netem' . $bandwidth . $delay . $loss) . ' 2>&1';
		error_log(date('M d H:i:s ') . $cmd);
		
		exec($cmd, $o, $rc);

		if ($rc != 0) {
			// Failed to set delay and jitter on interface
			error_log(date('M d H:i:s ') . 'ERROR: set quality interface fail: ' . $vunl);
			error_log(date('M d H:i:s ') . implode("\n", $o));
			return 'set quality interface fail: ' . $vunl;
		}

		return 0;
	}


	/**
	 * Function to unset quality of interface
	 */
	public function unApplyQuality()
	{
		if ($this->type == 'serial') return 0;
		$vunl = 'vunl' . $this->if_session[IF_SESSION_NODE] . '_' . $this->id;
		$cmd = 'sudo tc qdisc del dev ' . $vunl . ' root';
		secureCmd($cmd);
		exec($cmd, $o, $rc);
		if ($rc != 0) {
			// Failed to set delay and jitter on interface
			error_log(date('M d H:i:s ') . 'ERROR: unset quality interface fail: ' . $vunl);
			error_log(date('M d H:i:s ') . implode("\n", $o));
			return 'unset quality interface fail: ' . $vunl;
		}
		return 0;
	}

	/** =================== */


	/** Functions for interface suspend */
	/**
	 * @param int Status: 0 is normal 1 is suppend
	 * 
	 */
	public function setSuspendStatus($status)
	{
		$ifModel = loadModel('if_sessions');
		if (isset($this->if_session[IF_SESSION_NODE]) && isset($this->if_session[IF_SESSION_IFID])) {
			$result = $ifModel->update([
				IF_SESSION_SUSPEND => $status ? '1' : '0'
			], [
				[IF_SESSION_NODE, '=', $this->if_session[IF_SESSION_NODE]],
				[IF_SESSION_IFID, '=', $this->if_session[IF_SESSION_IFID]]
			]);

			if ($result) {
				$this->if_session[IF_SESSION_SUSPEND] = $status;
			}
		}

		$this->applySuspendStatus();
	}

	/** 
	 * Remote suspend data from interface session in database
	 * Is called when user unlink a interface
	 */
	public function removeSuspendStatus()
	{
		$ifModel = loadModel('if_sessions');
		if (isset($this->if_session[IF_SESSION_NODE]) && isset($this->if_session[IF_SESSION_IFID])) {
			$result = $ifModel->update([
				IF_SESSION_SUSPEND => null
			], [
				[IF_SESSION_NODE, '=', $this->if_session[IF_SESSION_NODE]],
				[IF_SESSION_IFID, '=', $this->if_session[IF_SESSION_IFID]]
			]);

			if ($result) {
				$this->if_session[IF_SESSION_QUALITY] = null;
				return true;
			}
		}
	}

	/** 
	 * @return int configuration of interface
	 */
	public function getSuspendStatus()
	{
		return get($this->if_session[IF_SESSION_SUSPEND], 0);
	}

	/**
	 * Apply suspend status configuration to system
	 * Is called when user set suspend status to interface and node is started
	 */
	public function applySuspendStatus()
	{
		$suspendStatus = $this->getSuspendStatus();
		if ($this->type == 'serial'){
			if ($suspendStatus == 1) {
				return $this->setLinkState('down');
			} else {
				return $this->unApplySuspendStatus();
			}
		}else{
			$vunl = $this->getSysName();
			if (!isInterface($vunl)) return 0;
			if ($suspendStatus == 1) {
				return $this->unplug();
			} else {
				return $this->unApplySuspendStatus();
			}

		}

		return 0;
	}


	/**
	 * Function to unset suspend status of interface
	 */
	public function unApplySuspendStatus()
	{
		if ($this->type == 'serial') return $this->setLinkState('up');
		return $this->plug();
	}



	/** Function for hot Link */
	public function plug()
	{

		if ($this->type == 'serial') return 0;
		if (isset($this->networks[$this->network_id])) {
			$netName = $this->networks[$this->network_id]->getSysName();
		} else {
			return 0;
		}

		$vunl = $this->getSysName();

		$rc = connectInterface($netName, $vunl);

		$this->setLinkState('up');

		return $rc;
	}

	public function unplug()
	{

		if ($this->type == 'serial') return 0;

		if (isset($this->networks[$this->network_id])) {

			$netName = $this->networks[$this->network_id]->getSysName();
		} else {
			return 0;
		}

		$vunl = $this->getSysName();


		if (!isInterface($vunl)) return 0;

		$rc = disconnectInterface($netName, $vunl);

		$this->setLinkState('down');

		return $rc;
	}

	public function setLinkState($status, $ifIndex = null)
	{

		if ($this->device->getNType() == 'qemu' && $this->device->getStatus() > 0) {
			$vunl = $this->getSysName();
			$monSocket = $this->device->getRunningPath() . '/monitor.sock';
			$cmd = "echo 'info network' | sudo nc -U " . $monSocket . " -q 0 | grep " . $vunl . " | sed 's/.*\(net[0-9]\+\)\:.*/\\1/g'";
			error_log(date('M d H:i:s ') . $cmd);
			exec($cmd, $netIndex, $rc);
			if (isset($netIndex[0])) {

				$cmd = "echo 'set_link " . $netIndex[0] . " " . ($status == 'up' ? 'on' : 'off') . "' | sudo nc -U " . $monSocket . " -q 0";
				error_log(date('M d H:i:s ') . $cmd);
				exec($cmd, $netIndex, $rc);
			}

			return;
		}

		if ($this->device->getNType() == 'iol' && $this->device->getStatus() > 0 && $this->device->isKeepAlive()) {

			// if ($ifIndex === null) {
			// 	$ifIndex = $this->device->getEthernetIndex($this->id);
			// }

			// if ($ifIndex === null) return;

			$cmd = 'id -u ' . 'unl' . $this->device->getSession() . ' 2>&1';
			exec($cmd, $o, $rc);
			$uid = $o[0];

			$cmd = "sudo perl " . $this->device->getRunningPath() . '/keepalive.pl' . " -i " . $this->device->getIolId() . " -p " . $this->getId() . ' -n ' . $this->device->getSession() . '_' . $this->getId() . ' > ' . $this->device->getRunningPath() . '/keepalive.log 2>&1 &';
			if ($status == 'up') {
				$wrapper = "sudo php /opt/unetlab/html/store/app/Console/Commands/wrapper 32768 " . $uid . " '" . $cmd . "'";
				error_log(date('M d H:i:s ') . $wrapper);
				exec($wrapper, $netIndex, $rc);
			} else {

				$cmd = 'ps -aux | grep keepalive | grep ' . $this->device->getSession() . '_' . $this->getId() . ' | grep -v "ps -aux" | tr -s " "| cut -d " " -f 2';
				$o = [];
				exec($cmd, $o, $rc);
				foreach ($o as $pid) {
					exec('sudo kill -9 ' . $pid);
					error_log('sudo kill -9 ' . $pid);
				}
			}

			return;
		}

		if ($this->device->getNType() == 'docker' && $this->device->getStatus() > 0) {
			$vunl = $this->getSysName();
			if ($status == 'up') {
				$cmd = 'sudo ip link set ' . $vunl . ' up';
			} else {
				$cmd = 'sudo ip link set ' . $vunl . ' down';
			}
			error_log(date('M d H:i:s ') . $cmd);
			exec($cmd, $netIndex, $rc);
			return;
		}
	}


	public function getSysName()
	{
		if ($this->type == 'serial') return null;
		return 'vunl' . $this->if_session[IF_SESSION_NODE] . '_' . $this->id;
	}
}
