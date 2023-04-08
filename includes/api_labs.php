<?php
# vim: syntax=php tabstop=4 softtabstop=0 noexpandtab laststatus=1 ruler

/**
 * html/includes/api_labs.php
 *
 * Labs related functions for REST APIs.
 *
 * @author Andrea Dainese <andrea.dainese@gmail.com>
 * @copyright 2014-2016 Andrea Dainese
 * @license BSD-3-Clause https://github.com/dainok/unetlab/blob/master/LICENSE
 * @link http://www.unetlab.com/
 * @version 20160719
 */

/*
 * Function to add a lab.
 *
 * @param	Array		$p				Parameters
 * @return	Array						Return code (JSend data)
 */
function apiAddLab($p, $tenant, $email = '')
{
	// Check mandatory parameters
	if (!isset($p['path']) || !isset($p['name'])) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][60017];
		return $output;
	}

	// Parent folder must exist
	if (!is_dir(BASE_LAB . $p['path'])) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][60018];
		return $output;
	}

	if ($p['path'] == '/') {
		$lab_file = '/' . $p['name'] . '.unl';
	} else {
		$lab_file = $p['path'] . '/' . $p['name'] . '.unl';
	}

	if (is_file(BASE_LAB . $lab_file)) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][60016];
		return $output;
	}

	$lab = new Lab(BASE_LAB . $lab_file, $tenant, null, $email);

	// Set author/description/version
	$rc = $lab->edit($p);
	if ($rc !== 0) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][$rc];
	}

	// Printing info
	$output['code'] = 200;
	$output['status'] = 'success';
	$output['message'] = $GLOBALS['messages'][60019];
	return $output;
}

/*
 * Function to add a lab.
 *
 * @param	Array		$p				Parameters
 * @return	Array						Return code (JSend data)
 */
function apiCloneLab($p, $tenant, $email = '')
{
	$rc = checkFolder(BASE_LAB . dirname($p['source']));
	if ($rc === 2) {
		// Folder is not valid
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][60009];
		return $output;
	} else if ($rc === 1) {
		// Folder does not exist
		$output['code'] = 404;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][60008];
		return $output;
	}

	if (!is_file(BASE_LAB . $p['source'])) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][60000];
		return $output;
	}

	if (!copy(BASE_LAB . $p['source'], BASE_LAB . dirname($p['source']) . '/' . $p['name'] . '.unl')) {
		// Failed to copy
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][60037];
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][60037]);
		return $output;
	}


	$lab = new Lab(BASE_LAB . dirname($p['source']) . '/' . $p['name'] . '.unl', $tenant, null, $email);


	$rc = $lab->edit($p);
	$lab->setId();
	if ($rc !== 0) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][$rc];
	} else {
		$output['code'] = 200;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][60036];
	}

	return $output;
}

/*
 * Function to delete a lab.
 *
 * @param	string		$lab_id			Lab ID
 * @param	string		$lab_file		Lab file
 * @return	Array						Return code (JSend data)
 */
function apiDeleteLab($lab)
{
	if ($lab->isRunning()) throw new ResponseException('error_lab_running', ['data' => $lab->getName()]);
	unlink($lab->getFile());
	$output['code'] = 200;
	$output['status'] = 'success';
	$output['message'] = $GLOBALS['messages'][60022];
	return $output;
}

/*
 * Function to edit a lab.
 *
 * @param	Lab			$lab			Lab
 * @param	Array		$lab			Parameters
 * @return	Array						Return code (JSend data)
 */
function apiEditLab($lab, $p)
{
	// Set author/description/version
	if (isset($p['name']) && $lab->getName() != $p['name']) {
		checkWorkSpace(substr($lab->getFile(), strlen(BASE_LAB)), checkSharePermission(USER_PER_RENAME_LAB));
		checkPermission(USER_PER_RENAME_LAB);
		if($lab->isRunning()){
			$search = '/' . $lab->getName() . '.';
			$replacement = '/' . $p['name'] . '.';
			replaceLabSessionPath($search, $replacement);
		}
		
	}

	$rc = $lab->edit($p);

	if ($rc !== 0) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][$rc];
	} else {
		$output['code'] = 200;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][60023];
	}
	return $output;
}

/*
 * Function to export labs.
 *
 * @param	Array		$p				Parameters
 * @return	Array						Return code (JSend data)
 */
function apiExportLabs($p)
{
	$export_url = '/Exports/pnetlab_export-' . date('Ymd-His') . '.zip';
	$export_file = '/opt/unetlab/data' . $export_url;
	if (is_file($export_file)) {
		unlink($export_file);
	}

	if (checkFolder(BASE_LAB . $p['path']) !== 0) {
		// Path is not valid
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][80077];
		return $output;
	}

	if (!chdir(BASE_LAB . $p['path'])) {
		// Cannot set CWD
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS[80072];
		return $output;
	}

	foreach ($p as $key => $element) {
		if ($key === 'path') {
			continue;
		}

		// Using "element" relative to "path", adding '/' if missing
		$relement = substr($element, strlen($p['path']));
		if ($relement[0] != '/') {
			$relement = '/' . $relement;
		}

		if (is_file(BASE_LAB . $p['path'] . $relement)) {
			// Adding a file
			$cmd = 'zip ' . $export_file . ' ".' . $relement . '"';
			secureCmd($cmd);
			exec($cmd, $o, $rc);
			if ($rc != 0) {
				$output['code'] = 400;
				$output['status'] = 'fail';
				$output['message'] = $GLOBALS['messages'][80073];
				return $output;
			}
		}

		if (checkFolder(BASE_LAB . $p['path'] . $relement) === 0) {
			// Adding a dir
			$cmd = 'zip -r ' . $export_file . ' ".' . $relement . '"';
			secureCmd($cmd);
			exec($cmd, $o, $rc);
			if ($rc != 0) {
				$output['code'] = 400;
				$output['status'] = 'fail';
				$output['message'] = $GLOBALS['messages'][80074];
				return $output;
			}
		}
	}

	// Now remove UUID from labs
	$cmd = BASE_DIR . '/scripts/remove_uuid.sh "' . $export_file . '"';
	secureCmd($cmd);
	exec($cmd, $o, $rc);
	if ($rc != 0) {
		if (is_file($export_file)) {
			unlink($export_file);
		}
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][$rc];
		return $output;
	}

	$output['code'] = 200;
	$output['status'] = 'success';
	$output['message'] = $GLOBALS['messages'][80075];
	$output['data'] = $export_url;
	return $output;
}

/*
 * Function to get a lab.
 *
 * @param	Lab			$lab			Lab
 * @return	Array						Return code (JSend data)
 */
function apiGetLab($lab)
{
	// Printing info
	$output['code'] = 200;
	$output['status'] = 'success';
	$output['message'] = $GLOBALS['messages'][60020];
	$output['data'] = array(
		'author' => $lab->getAuthor(),
		'description' => $lab->getDescription(),
		'body' => $lab->getBody(),
		'filename' => $lab->getFilename(),
		'id' => $lab->getId(),
		'name' => $lab->getName(),
		'version' => $lab->getVersion(),
		'scripttimeout' => $lab->getScriptTimeout(),
		'countdown' => $lab->getCountdown(),
		'lock' => $lab->isLock(),
		'password' => $lab->getPassword() == '' ? 0 : 1,
		'openable' => $lab->getOpenable(),
		'joinable' => $lab->getJoinable(),
		'editable' => $lab->getEditable(),
		'openable_emails' => $lab->getOpenableEmails(),
		'joinable_emails' => $lab->getJoinableEmails(),
		'editable_emails' => $lab->getEditableEmails(),
		'darkmode' => $lab->getDarkMode(),
		'mode3d' => $lab->get3dMode(),
		'nogrid' => $lab->getNoGrid(),
		'session' => $lab->getSession(),
		'multi_config_active' => $lab->getMulti_config_active(),
	);
	return $output;
}

/*
 * Function to get all lab links (networks and serial endpoints).
 *
 * @param	Lab			$lab			Lab file
 * @return	Array						Return code (JSend data)
 */
function apiGetLabLinks($lab)
{
	$output['data'] = array();

	// Get ethernet links
	$ethernets = array();
	$networks = $lab->getNetworks();
	if (!empty($networks)) {
		foreach ($lab->getNetworks() as $network_id => $network) {
			$ethernets[$network_id] = $network->getName();
		}
	}

	// Get serial links
	$serials = array();
	$nodes = $lab->getNodes();
	if (!empty($nodes)) {
		foreach ($nodes as $node_id => $node) {
			if (!empty($node->getSerials())) {
				$serials[$node_id] = array();
				foreach ($node->getSerials() as $interface_id => $interface) {
					// Print all available serial links
					$serials[$node_id][$interface_id] = $node->getName() . ' ' . $interface->getName();
				}
			}
		}
	}

	// Printing info
	$output['code'] = 200;
	$output['status'] = 'success';
	$output['message'] = $GLOBALS['messages'][60024];
	$output['data']['ethernet'] = $ethernets;
	$output['data']['serial'] = $serials;
	return $output;
}

/*
 * Function to import labs.
 *
 * @param	Array		$p				Parameters
 * @return	Array						Return code (JSend data)
 */
function apiImportLabs($p)
{
	ini_set('max_execution_time', '600');
	ini_set('memory_limit', '1024M');

	$user = getUser();

	if (!isset($p['file']) || empty($p['file'])) {
		// Upload failed
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][80081];
		return $output;
	}

	if (!isset($p['path'])) {
		// Path is not set
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][80076];
		return $output;
	}

	if (checkFolder(BASE_LAB . $p['path']) !== 0) {
		// Path is not valid
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][80077];
		return $output;
	}

	$finfo = new finfo(FILEINFO_MIME);
	if (strpos($finfo->file($p['file']), 'application/zip') !== False) {
		// UNetLab export
		$tmpFolder = '/tmp/import_' . $user['pod'];
		exec('rm -rf ' . $tmpFolder);
		$labFolder = BASE_LAB . $p['path'];

		$cmd = 'unzip -o -d "' . $tmpFolder . '" ' . $p['file'] . ' *.unl';
		secureCmd($cmd);
		exec($cmd, $o, $rc);
		if ($rc != 0) {
			$output['code'] = 400;
			$output['status'] = 'fail';
			$output['message'] = $GLOBALS['messages'][80079];
			return $output;
		}

		$importLabs = scanDirFiles($tmpFolder);
		$errorLabs = [];

		foreach ($importLabs as $importLab) {

			$relativePath = preg_replace('/^' . preg_quote($tmpFolder, '/') . '/', '', $importLab);

			try {
				$labObj = new Lab($importLab, $user['pod'], null, $user['email']);
				$labObj->edit([
					'openable' => 2,
					'joinable' => 2,
					'editable' => 2,
					'openable_emails' => [$user['email']],
					'joinable_emails' => [$user['email']],
					'editable_emails' => [$user['email']],
				]);
			} catch (Exception $th) {
				error_log($th->getMessage());
				$errorLabs[] = $relativePath;
				continue;
			}

			$labFileName = $labFolder . $relativePath;
			$labFileDir = dirname($labFileName);
			if (!is_dir($labFileDir)) mkdir($labFileDir, 0755, true);
			rename($importLab, $labFileName);
		}

		if (count($errorLabs) > 0) throw new Exception('Some Labs can not be imported: ' . implode(', ', $errorLabs));

		$output['code'] = 200;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][80080];
		return $output;
	} else {
		// File is not a Zip
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][80078];
		return $output;
	}
}

/*
 * Function to move a lab inside another folder.
 *
 * @param	Lab			$lab			Lab
 * @param	string		$path			Destination path
 * @return	Array						Return code (JSend data)
 */
function apiMoveLab($lab, $path)
{

	$rc = checkFolder(BASE_LAB . $path);
	if ($rc === 2) {
		// Folder is not valid
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][60009];
		return $output;
	} else if ($rc === 1) {
		// Folder does not exist
		$output['code'] = 404;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][60008];
		return $output;
	}

	if (is_file(BASE_LAB . $path . '/' . $lab->getFilename())) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][60016];
		return $output;
	}

	if (rename($lab->getPath() . '/' . $lab->getFilename(), BASE_LAB . $path . '/' . $lab->getFilename())) {

		$search = str_replace([BASE_LAB, '//'], ['', '/'], $lab->getPath() . '/' . $lab->getFilename());
		$replacement = str_replace('//', '/', $path . '/' . $lab->getFilename());
		replaceLabSessionPath($search, $replacement);

		$output['code'] = 200;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][60035];
	} else {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][60034];
		error_log(date('M d H:i:s ') . 'ERROR: ' . $GLOBALS['messages'][60034]);
	}
	return $output;
}

/*
 * Function to Lock  a lab 
 *
 * @param       Lab                     $lab                    Lab
 * @return      Array                                           Return code (JSend data)
 */

function apiLockLab($lab, $pass)
{
	$rc = $lab->lockLab($pass);
	if ($rc !== 0) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][$rc];
	} else {
		$output['code'] = 200;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][60023];
	}
	return $output;
}

/*
 * Function to Unlock  a lab
 *
 * @param       Lab                     $lab                    Lab
 * @return      Array                                           Return code (JSend data)
 */

function apiUnlockLab($lab, $pass, $clearPass)
{
	$rc = $lab->unlockLab($pass, $clearPass);
	if ($rc !== 0) {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][$rc];
	} else {
		$output['code'] = 200;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][60023];
	}
	return $output;
}
