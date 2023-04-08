<?php
# vim: syntax=php tabstop=4 softtabstop=0 noexpandtab laststatus=1 ruler

/**
 * html/includes/__network.php
 *
 * Class for UNetLab networks.
 *
 * @author Andrea Dainese <andrea.dainese@gmail.com>
 * @copyright 2014-2016 Andrea Dainese
 * @license BSD-3-Clause https://github.com/dainok/unetlab/blob/master/LICENSE
 * @link http://www.unetlab.com/
 * @version 20160719
 * @property type $id Network ID. Mandatory and set during construction phase.
 * @property type $left Left margin for visual position. It's optional.
 * @property type $name Name of the network. It's optional but suggested.
 * @property type $session session ID. Mandatory and set during construction phase.
 * @property type $top Top margin for visual position.
 * @property type $type Type of the network. It's mandatory.
 */

class Network
{
	private $endpoints = [];
	private $id;
	private $left;
	private $name;
	private $top;
	private $type;
	private $visibility;
	private $lab;
	private $count = -1;
	private $icon;
	private $size = '';

	/**
	 * Constructor which creates an Ethernet network.
	 * Parameters:
	 * - left
	 * - name
	 * - top
	 * - type*
	 * *mandatory
	 * 
	 * @param   Array   $p                  Parameters
	 * @param   int     $id                 Network ID
	 * @return  void
	 */
	public function __construct($p, $id, $lab)
	{
		$this->lab = $lab;
		// Mandatory parameters
		if (!isset($p['type'])) {
			// Missing mandatory parameters
			error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][30000]);
			throw new Exception('30000');
			return 30000;
		}

		if (!checkNetworkType($p['type'])) {
			// Type is not valid
			error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][30001]);
			throw new Exception('30001');
			return 30001;
		}


		if (isset($p['left']) && !checkPosition($p['left'])) {
			if (preg_match('/^[0-9]+%$/', $p['left']) && substr($p['left'], 0, -1) >= 0 && substr($p['left'], 0, -1) <= 100) {
				// Converting percentage to absolute using a 800x600 viewport
				$p['left'] = 1024 * substr($p['left'], 0, -1) / 100;
			} else {
				// Left is invalid, ignored
				unset($p['left']);
				error_log(date('M d H:i:s ') . 'WARNING: ' . $GLOBALS['messages'][30003]);
			}
		}

		if (isset($p['name']) && $p['name'] === '') {
			// Name is empty, ignored
			unset($p['name']);
			error_log(date('M d H:i:s ') . 'WARNING: ' . $GLOBALS['messages'][30002]);
		}

		if (isset($p['top']) && !checkPosition($p['top'])) {
			if (preg_match('/^[0-9]+%$/', $p['top']) && substr($p['top'], 0, -1) >= 0 && substr($p['top'], 0, -1) <= 100) {
				// Converting percentage to absolute using a 800x600 viewport
				$p['top'] = 768 * substr($p['top'], 0, -1) / 100;
			} else {
				// Top is invalid, ignored
				unset($p['top']);
				error_log(date('M d H:i:s ') . 'WARNING: ' . $GLOBALS['messages'][30004]);
			}
		}

		if (!isset($p['visibility'])) {
			$p['visibility'] = 0;
		} elseif ((int) $p['visibility'] != 0) {
			$p['visibility'] = 1;
		}

		//pnet need visibility
		if (preg_match('/^pnet/', $p['type'])) {
			$p['visibility'] = 1;
		}

		


		// Now building the network

		$this->id = (int) $id;
		$this->type = $p['type'];
		$this->visibility = $p['visibility'];
		if (isset($p['left'])) $this->left = (int) $p['left'];
		if (isset($p['name'])) $this->name = htmlentities($p['name']);
		if (isset($p['top'])) $this->top = (int) $p['top'];

		if (isset($p['icon'])) $this->icon = $p['icon'];
		if (isset($p['size'])) $this->size = $p['size'];
		if (isset($p['count'])) $this->count = (int)$p['count'];
	
		if(!isset($this->icon) || $this->icon == ''){
			if($this->type == 'bridge'){
				$this->icon = 'lan.png';
			}else{
				$this->icon = 'cloud.png';
			}
		}
	}

	/**
	 * Method to add or replace the network metadata.
	 * Editable attributes:
	 * - left
	 * - name
	 * - top
	 * - type
	 * If an attribute is set and is valid, then it will be used. If an
	 * attribute is not set, then the original is maintained. If in attribute
	 * is set and empty '', then the current one is deleted.
	 *
	 * @param   Array   $p                  Parameters
	 * @return  int                         0 means ok
	 */
	public function edit($p)
	{
		$modified = False;

		if (isset($p['left']) && $p['left'] === '') {
			// Left is empty, unset the current one
			unset($this->left);
			$modified = True;
		} else if (isset($p['left']) && !checkPosition($p['left'])) {
			// Left is not valid, ignored
			error_log(date('M d H:i:s ') . 'WARNING: ' . $GLOBALS['messages'][30003]);
		} else if (isset($p['left'])) {
			$this->left = $p['left'];
			$modified = True;
		}

		if (isset($p['name']) && $p['name'] === '') {
			// Name is empty, unset the current one
			unset($this->name);
			$modified = True;
		} else if (isset($p['name'])) {
			$this->name = htmlentities($p['name']);
			$modified = True;
		}

		if (isset($p['top']) && $p['top'] === '') {
			// Top is empty, unset the current one
			unset($this->top);
			$modified = True;
		} else if (isset($p['top']) && !checkPosition($p['top'])) {
			// Top is not valid, ignored
			error_log(date('M d H:i:s ') . 'WARNING: ' . $GLOBALS['messages'][30004]);
		} else if (isset($p['top'])) {
			$this->top = $p['top'];
			$modified = True;
		}
		if (isset($p['visibility'])) {
			$this->visibility = $p['visibility'];
			$modified = True;
		}

		if (isset($p['type']) && !checkNetworkType($p['type'])) {
			// Type is not valid, ignored
			error_log(date('M d H:i:s ') . 'WARNING: ' . $GLOBALS['messages'][30005]);
		} else if (isset($p['type'])) {
			$this->type = $p['type'];
			$modified = True;
		}

		if (isset($p['icon'])){
			$this->icon = $p['icon'];
			$modified = True;
		}

		if (isset($p['size'])){
			$this->size = $p['size'];
			$modified = True;
		}

		if (isset($p['count'])){
			$this->count = (int)$p['count'];
			$modified = True;
		}
	
		if(!isset($this->icon) || $this->icon == ''){
			if($this->type == 'bridge'){
				$this->icon = 'lan.png';
			}else{
				$this->icon = 'cloud.png';
			}
			$modified = true;
		}

		if ($modified) {
			// At least an attribute is changed
			return 0;
		} else {
			// No attribute has been changed
			error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][30006]);
			return 30006;
		}
	}

	/**
	 * Method to get left offset.
	 *
	 * @return  string                      Left offset
	 */
	public function getLeft()
	{
		if (isset($this->left)) {
			return $this->left;
		} else {
			// By default return a random value between 240 and 560
			return rand(240, 560);
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
			return 'Network ' . $this->id;
		}
	}

	/**
	 * Method to get network type.
	 *
	 * @return  string                      Network type
	 */
	public function getNType()
	{
		return $this->type;
	}

	/**
	 * Method to get top offset.
	 *
	 * @return  string                      Top offset
	 */
	public function getTop()
	{
		if (isset($this->top)) {
			return $this->top;
		} else {
			// By default return a random value between 180 and 420
			return rand(180, 420);
		}
	}

	/**
	 * Method to check if a network is a cloud
	 *
	 * @return  bool                        True if network is a cloud
	 */
	public function isCloud()
	{
		if (in_array($this->type, listClouds())) {
			return True;
		} else {
			return False;
		}
	}

	public function setEndpoint($node){
		$this->endpoints[$node->getId()] = $node;
	}


	public function getEndpoints(){
		return $this->endpoints;
	}


	public function getCount(){
		if($this->count == -1){
			$this->count = 0;
			foreach ($this->lab->getNodes() as $node) {
				foreach ($node->getEthernets() as $interface) {
					if ($interface->getNetworkId() === $this->id) {
						$this->count++;
					}
				}
			}
		}
		return $this->count;
		
	}

	public function getIcon(){
		return $this->icon;
	}

	public function getSize(){
		return $this->size;
	}

	
	/**
	 * Method to get visibility
	 *
	 * @return  0/1 visibility   0 means invisible
	 */
	public function getVisibility()
	{
		return $this->visibility;
	}

	/**
	 * Return the Name of network in system
	 */
	public function getSysName(){
		if ($this->isCloud()) {
			$net_name = $this->getNType();
		} else {
			$net_name = 'vnet' . $this->lab->getSession() . '_' . $this->id;
		}

		return $net_name;
	}


	public function addSysNetwork(){
		$netName = $this->getSysName();
		$p = array(
			'name' => $netName,
			'type' => $this->getNType(),
		);

		error_log(date('M d H:i:s ') . date('M d H:i:s ') . 'INFO: adding network ' . $netName);
		$rc = addNetwork($p);
		return $rc;
	}

}
