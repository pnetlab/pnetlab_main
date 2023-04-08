<?php
# vim: syntax=php tabstop=4 softtabstop=0 noexpandtab laststatus=1 ruler

/**
 * html/includes/api_authentication.php
 *
 * Users related functions for REST APIs.
 *
 * @author Andrea Dainese <andrea.dainese@gmail.com>
 * @copyright 2014-2016 Andrea Dainese
 * @license BSD-3-Clause https://github.com/dainok/unetlab/blob/master/LICENSE
 * @link http://www.unetlab.com/
 * @version 20160719
 */


/*
 * Function to logout a user.
 *
 * @param	PDO			$db				PDO object for database connection
 * @param	String		$cookie			Session cookie
 * @return	bool						True if valid
 */
function apiLogout($cookie)
{
	$db = checkDatabase();
	$query = 'UPDATE users SET cookie = NULL, session = NULL WHERE cookie = :cookie;';
	$statement = $db->prepare($query);
	$statement->bindParam(':cookie', $cookie, PDO::PARAM_STR);
	$statement->execute();
	//$result = $statement -> fetch();

	$output['code'] = 200;
	$output['status'] = 'success';
	$output['message'] = $GLOBALS['messages'][90019];
	return $output;
}

/*
 * Function to check authorization
 *
 * @param	PDO			$db				PDO object for database connection
 * @param	String		$cookie			Session cookie
 * @return	Array						Username, role, tenant if logged in; JSend data if not authorized
 */

