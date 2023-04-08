<?php
# vim: syntax=php tabstop=4 softtabstop=0 noexpandtab laststatus=1

/**
 * html/includes/api_topology.php
 *
 * Topology related functions for REST APIs.
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
 * @return  Array                       Return code (JSend data)
 */
// function apiGetLabTopology($lab)
// {
// 	// Printing topology
// 	$output['code'] = '200';
// 	$output['status'] = 'success';
// 	$output['message'] = 'Topology loaded';
// 	$output['data'] = array();
// 	foreach ($lab->getNodes() as $node_id => $node) {
// 		foreach ($node->getEthernets() as $interface) {
// 			$link = null;
// 			if ($interface->getNetworkId() != '' && isset($lab->getNetworks()[$interface->getNetworkId()])) {
// 				// Interface is connected
// 				switch ($lab->getNetworks()[$interface->getNetworkId()]->getCount()) {
// 					default:
// 						// More than two connected nodes
// 						$link = array(
// 							'type' => 'ethernet',
// 							'source' => 'node' . $node_id,
// 							'source_type' => 'node',
// 							'source_label' => $interface->getName(),
// 							'source_quality' => (object)$interface->getQuality(),
// 							'destination' => 'network' . $interface->getNetworkId(),
// 							'destination_type' => 'network',
// 							'destination_label' => ''
// 						);
// 						break;
// 					case 0:
// 						// Network not used
// 						break;
// 					case 1:
// 						// Only one connected node
// 						$link = array(
// 							'type' => 'ethernet',
// 							'source' => 'node' . $node_id,
// 							'source_type' => 'node',
// 							'source_label' => $interface->getName(),
// 							'source_quality' => (object)$interface->getQuality(),
// 							'destination' => 'network' . $interface->getNetworkId(),
// 							'destination_type' => 'network',
// 							'destination_label' => ''
// 						);
// 						break;
// 					case 2:
// 						// P2P Link
// 						if ($lab->getNetworks()[$interface->getNetworkId()]->isCloud() || $lab->getNetworks()[$interface->getNetworkId()]->getVisibility() == 1) {
// 							// Cloud are never printed as P2P link or Visibility is on
// 							$link = array(
// 								'type' => 'ethernet',
// 								'source' => 'node' . $node_id,
// 								'source_type' => 'node',
// 								'source_label' => $interface->getName(),
// 								'source_quality' => (object)$interface->getQuality(),
// 								'destination' => 'network' . $interface->getNetworkId(),
// 								'destination_type' => 'network',
// 								'destination_label' => ''
// 							);
// 						} else {
// 							foreach ($lab->getNodes() as $remote_node_id => $remote_node) {
// 								foreach ($remote_node->getEthernets() as $remote_interface) {
// 									if ($interface->getNetworkId() == $remote_interface->getNetworkId()) {
// 										// To avoid duplicates, only print if source node_id > destination node_id
// 										if ($node_id > $remote_node_id) {
// 											$link = array(
// 												'type' => 'ethernet',
// 												'source' => 'node' . $node_id,
// 												'source_type' => 'node',
// 												'source_label' => $interface->getName(),
// 												'source_quality' => (object)$interface->getQuality(),
// 												'destination' => 'node' . $remote_node_id,
// 												'destination_type' => 'node',
// 												'destination_label' => $remote_interface->getName(),
// 												'destination_quality' => (object)$remote_interface->getQuality(),
// 												'network_id' => $interface->getNetworkId()
// 											);
// 										}
// 										break;
// 									}
// 								}
// 							}
// 						}
// 						break;
// 				}
// 			}
// 			/** EVE_STORE Link */
// 			if ($link) {
// 				$link['style'] = $interface->getStyle();
// 				$link['linkstyle'] = $interface->getLinkstyle();
// 				$link['color'] = $interface->getColor();
// 				$link['label'] = $interface->getLabel();
// 				$link['linkcfg'] = $interface->getLinkcfg();
// 				$link['labelpos'] = $interface->getLabelpos();
// 				$link['dstpos'] = $interface->getDstpos();
// 				$link['srcpos'] = $interface->getSrcpos();

// 				$output['data'][] = $link;
// 			}
// 			/** ================ */
// 		}
// 		foreach ($node->getSerials() as $interface) {
// 			$link = null;
// 			if ($interface->getRemoteID() != '' && $node_id > $interface->getRemoteId()) {
// 				try {
// 					$link = array(
// 						'type' => 'serial',
// 						'source' => 'node' . $node_id,
// 						'source_type' => 'node',
// 						'source_label' => $interface->getName(),
// 						'destination' => 'node' . $interface->getRemoteID(),
// 						'destination_type' => 'node',
// 						'destination_label' => $lab->getNodes()[$interface->getRemoteID()]->getSerials()[$interface->getRemoteIf()]->getName(),
// 						'network_id' => $interface->getNetworkId()
// 					);
// 				} catch (Exception $e) {
// 				}
// 			}
// 			/** EVE_STORE Link */
// 			if ($link) {
// 				$link['style'] = $interface->getStyle();
// 				$link['linkstyle'] = $interface->getLinkstyle();
// 				$link['color'] = $interface->getColor();
// 				$link['label'] = $interface->getLabel();
// 				$link['linkcfg'] = $interface->getLinkcfg();
// 				$link['labelpos'] = $interface->getLabelpos();
// 				$link['dstpos'] = $interface->getDstpos();
// 				$link['srcpos'] = $interface->getSrcpos();

// 				$output['data'][] = $link;
// 			}
// 			/** ================ */
// 		}
// 	}

// 	return $output;
// }
// function apiGetLabTopologyPreview($lab)
// {
// 	// Printing topology
// 	$output['code'] = '200';
// 	$output['status'] = 'success';
// 	$output['message'] = 'Topology loaded';
// 	$output['data'] = array();
// 	foreach ($lab->getNodes() as $node_id => $node) {
// 		foreach ($node['ethernets'] as $interface) {
// 			$link = null;
// 			if ($interface['id'] != '' && isset($lab->getNetworks()[$interface['network_id']])) {
// 				// Interface is connected
// 				switch ($lab->getNetworks()[$interface['network_id']]['count']) {
// 					default:
// 						// More than two connected nodes
// 						$link = array(
// 							'type' => 'ethernet',
// 							'source' => 'node' . $node_id,
// 							'source_type' => 'node',
// 							'source_label' => $interface['label'],
// 							'destination' => 'network' . $interface['network_id'],
// 							'destination_type' => 'network',
// 							'destination_label' => ''
// 						);
// 						break;
// 					case 0:
// 						// Network not used
// 						break;
// 					case 1:
// 						// Only one connected node
// 						$link = array(
// 							'type' => 'ethernet',
// 							'source' => 'node' . $node_id,
// 							'source_type' => 'node',
// 							'source_label' => $interface['label'],
// 							'destination' => 'network' . $interface['network_id'],
// 							'destination_type' => 'network',
// 							'destination_label' => ''
// 						);
// 						break;
// 					case 2:
// 						// P2P Link
// 						if ($lab->getNetworks()[$interface['network_id']]['isCloud'] || $lab->getNetworks()[$interface['network_id']]['visibility'] == 1) {
// 							// Cloud are never printed as P2P link or Visibility is on
// 							$link = array(
// 								'type' => 'ethernet',
// 								'source' => 'node' . $node_id,
// 								'source_type' => 'node',
// 								'source_label' => $interface['label'],
// 								'destination' => 'network' . $interface['network_id'],
// 								'destination_type' => 'network',
// 								'destination_label' => ''
// 							);
// 						} else {
// 							foreach ($lab->getNodes() as $remote_node_id => $remote_node) {
// 								foreach ($remote_node['ethernets'] as $remote_interface) {
// 									if ($interface['network_id'] == $remote_interface['network_id']) {
// 										// To avoid duplicates, only print if source node_id > destination node_id
// 										if ($node_id > $remote_node_id) {
// 											$link = array(
// 												'type' => 'ethernet',
// 												'source' => 'node' . $node_id,
// 												'source_type' => 'node',
// 												'source_label' => $interface['label'],
// 												'destination' => 'node' . $remote_node_id,
// 												'destination_type' => 'node',
// 												'destination_label' => $remote_interface['label'],
// 												'network_id' => $interface['network_id']
// 											);
// 										}
// 										break;
// 									}
// 								}
// 							}
// 						}
// 						break;
// 				}
// 			}
// 			/** EVE_STORE Link */
// 			if ($link) {
// 				$link['style'] = $interface['style'];
// 				$link['linkstyle'] = $interface['linkstyle'];
// 				$link['color'] = $interface['color'];
// 				$link['label'] = $interface['label'];
// 				$link['linkcfg'] = $interface['linkcfg'];

// 				$output['data'][] = $link;
// 			}
// 			/** ================ */
// 		}
// 		foreach ($node['serials'] as $interface) {
// 			$link = null;
// 			if ($interface['remote_id'] != '' && $node_id > $interface['remote_id']) {
// 				try {
// 					$link = array(
// 						'type' => 'serial',
// 						'source' => 'node' . $node_id,
// 						'source_type' => 'node',
// 						'source_label' => $interface['label'],
// 						'destination' => 'node' . $interface['remote_id'],
// 						'destination_type' => 'node',
// 						'destination_label' => $lab->getNodes()[$interface['remote_id']]['serials'][$interface['remote_if']]['label'],
// 						'network_id' => $interface['network_id'],
// 					);
// 				} catch (Exception $e) {
// 				}
// 			}
// 			/** EVE_STORE Link */
// 			if ($link) {
// 				$link['style'] = $interface['style'];
// 				$link['linkstyle'] = $interface['linkstyle'];
// 				$link['color'] = $interface['color'];
// 				$link['label'] = $interface['label'];
// 				$link['linkcfg'] = $interface['linkcfg'];
// 				$output['data'][] = $link;
// 			}
// 			/** ================ */
// 		}
// 	}

// 	return $output;
// }
