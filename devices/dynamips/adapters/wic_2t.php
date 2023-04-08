<?php

use Slim\Middleware\Flash;

/**
 * 
 * @author LIN 
 * @copyright pnetlab.com
 * @link https://www.pnetlab.com/
 * 
 */

class wic_2t extends adapter
{

    function __construct($device, $slot, $subSlot)
    {
        parent::__construct($device, $slot, $subSlot);
        $this->name = 'WIC-2T';
        $this->flag = '-p ' . $slot . ':' . 16 * (int) $subSlot . ':' . $this->name;
    }

    public function createSerials()

    {
        
        for ($p = 0; $p <= 1; $p++) {

            if(!isset($this->device->serialIndex)) $this->device->serialIndex = 0;
            $index = $this->device->serialIndex; $this->device->serialIndex ++;

            $interfaceId = $this->slot * 16 + $this->subSlot * 16 + $p;
            if (!isset($this->serials[$interfaceId])) {
                $socket = '/tmp/dynamips/' . $this->device->getSession() . '_' . $interfaceId;
                try {
                    $this->serials[$interfaceId] = new Interfc( $this->device, array('name' => 's' . $this->slot . '/' .$index, 'type' => 'serial', 'socket_file' => $socket), $interfaceId);
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
        for ($p = 0; $p <= 1; $p++) {
            $interfaceId = $this->slot * 16 + $this->subSlot * 16 + $p;
            if (isset($this->serials[$interfaceId])) {
                try {
                    $interface = $this->serials[$interfaceId];
                    $remote_id = $interface->getRemoteId();
                    $remote_if = $interface->getRemoteIf();
                    if ($remote_id > 0) {
                        $remote_node = $this->device->getNode($remote_id);
                        $remoteSerial = $remote_node->getSerials()[$remote_if];
                        $flag .= ' -s ' . $this->slot . ':' . (16 * $this->subSlot + $p) . ':unix:' . $interface->getSocketFile() . ':' . $remoteSerial->getSocketFile();
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
