<?php

use Slim\Middleware\Flash;

/**
 * 
 * @author LIN 
 * @copyright pnetlab.com
 * @link https://www.pnetlab.com/
 * 
 */

class nm_4t extends adapter
{

    function __construct($device, $slot, $subSlot)
    {
        parent::__construct($device, $slot, $subSlot);
        $this->name = 'NM-4T';
        $this->flag = '-p ' . $slot . ':'. $this->name;
    }

    public function createSerials()

    {
        
        for ($p = 0; $p <= 3; $p++) {

            $interfaceId = $this->slot * 16 + $this->subSlot * 16 + $p;
            if (!isset($this->serials[$interfaceId])) {
                $socket = '/tmp/dynamips/' . $this->device->getSession() . '_' . $interfaceId;
                try {
                    $this->serials[$interfaceId] = new Interfc( $this->device, array('name' => 's' . $this->slot . '/' .$p, 'type' => 'serial', 'socket_file' => $socket), $interfaceId);
                } catch (Exception $e) {
                    error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][40020]);
                    error_log(date('M d H:i:s ') . (string) $e);
                    return false;
                }
            }
        }
    }

    public function getFlag()
    {
        $flag = $this->flag;
        for ($p = 0; $p <= 3; $p++) {
            $interfaceId = $this->slot * 16 + $this->subSlot * 16 + $p;
            if (isset($this->serials[$interfaceId])) {
                try {
                    $interface = $this->serials[$interfaceId];
                    $remote_id = $interface->getRemoteId();
                    $remote_if = $interface->getRemoteIf();
                    if ($remote_id > 0) {
                        $remote_node = $this->device->getNode($remote_id);
                        $remoteSerial = $remote_node->getSerials()[$remote_if];
                        $flag .= ' -s ' . $this->slot . ':' . $p . ':unix:' . $interface->getSocketFile() . ':' . $remoteSerial->getSocketFile();
                    }
                } catch (Exception $th) {
                    error_log('ERROR: Can not connect interface ' + $interfaceId + ' To ' + $remote_id + ':' + $remote_if);
                    continue;
                }
            }
        }
        return $flag;
    }
}
