<?php
# vim: syntax=php tabstop=4 softtabstop=0 noexpandtab laststatus=1

/**
 * html/includes/api_pictures.php
 *
 * Pictures related functions for REST APIs.
 *
 * @author Andrea Dainese <andrea.dainese@gmail.com>
 * @copyright 2014-2016 Andrea Dainese
 * @license BSD-3-Clause https://github.com/dainok/unetlab/blob/master/LICENSE
 * @link http://www.unetlab.com/
 * @version 20160719
 */

/**
 * Function to add a picture to a lab.
 *
 * @param   Lab     $lab                Lab
 * @param   Array   $p                  Parameters
 * @return  Array                       Return code (JSend data)
 */
function apiAddLabPicture($lab, $p) {
	// Adding the picture
	$rc = $lab -> addPicture($p);
	if ($rc === 0) {
		$output['code'] = 201;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][60023];
	} else {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][$rc];
    }
	return $output;
}

/**
 * Function to delete a lab picture.
 *
 * @param   Lab     $lab                Lab
 * @param   int     $id                 Picture ID
 * @return  Array                       Return code (JSend data)
 */
function apiDeleteLabPicture($lab, $id) {
	// Deleting the picture
	$rc = $lab -> deletePicture($id);

	if ($rc === 0) {
		$output['code'] = 200;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][60023];
	} else {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][$rc];
	}
	return $output;
}

/**
 * Function to edit a lab picture.
 *
 * @param   Lab     $lab                Lab
 * @param   Array   $p                  Parameters
 * @return  Array                       Return code (JSend data)
 */
function apiEditLabPicture($lab, $p) {
    // Edit picture
	$rc = $lab -> editPicture($p);

	if ($rc === 0) {
		$output['code'] = 201;
		$output['status'] = 'success';
		$output['message'] = $GLOBALS['messages'][60023];
	} else {
		$output['code'] = 400;
		$output['status'] = 'fail';
		$output['message'] = $GLOBALS['messages'][$rc];
	}
	return $output;
}

/**
 * Function to get a single lab picture.
 *
 * @param   Lab     $lab                Lab
 * @param   int     $id                 Picture ID
 * @return  Array                       Lab picture (JSend data)
 */
function apiGetLabPicture($lab, $id) {
	// Getting picture
	if (isset($lab -> getPictures()[$id])) {
		
		$picture = $lab -> getPictures()[$id];
		
		// Printing picture
		$output['code'] = 200;
		$output['status'] = 'success';
		$output['message'] = 'Picture loaded';
		$output['data'] = Array(
			'height' => $picture -> getHeight(),
			'id' => $id,
			'name' => $picture -> getName(),
			'type' => $picture -> getNType(),
			'width' => $picture -> getWidth(),
			'map' => $picture -> getMap()
		);
	} else {
		$output['code'] = 404;
		$output['status'] = 'fail';
		$output['message'] = 'Picture "'.$id.'" not found on lab.';
	}
	return $output;
}

/**
 * Function to get a single lab picture.
 *
 * @param   Lab     $lab                Lab
 * @param   int     $id                 Picture ID
 * @return  Array                       Lab picture (JSend data)
 */
function apiGetLabPictureMapped($lab, $id,$html5) {
        // Getting picture
        if (isset($lab -> getPictures()[$id])) {
                $picture = $lab -> getPictureMapped($id,$html5);
                //$picture = $lab -> getPictures()[$id];
                // Printing picture
                $output['code'] = 200;
                $output['status'] = 'success';
                $output['message'] = 'Picture loaded';
                $output['data'] = Array(
                        'height' => $picture -> getHeight(),
                        'id' => $id,
                        'name' => $picture -> getName(),
                        'type' => $picture -> getNType(),
                        'width' => $picture -> getWidth(),
                        'map' => $picture -> getMap()
                );
        } else {
                $output['code'] = 404;
                $output['status'] = 'fail';
                $output['message'] = 'Picture "'.$id.'" not found on lab.';
        }
        return $output;
}


/**
 * Function to get all lab pictures.
 *
 * @param   Lab     $lab                Lab
 * @return  Array                       Lab pictures (JSend data)
 */
function apiGetLabPictures($lab) {
	// Getting pictures
	$pictures = $lab -> getPictures();

	// Printing pictures
	$output['code'] = 200;
	$output['status'] = 'success';
	$output['message'] = $GLOBALS['messages'][60028];
	$output['data'] = Array();
	if (!empty($pictures)) {
		foreach ($pictures as $picture_id => $picture) {
			$output['data'][$picture_id] = Array(
				'height' => $picture -> getHeight(),
				'id' => $picture_id,
				'name' => $picture -> getName(),
				'type' => $picture -> getNType(),
				'width' => $picture -> getWidth(),
				//'map' => $picture -> getMap(),
			);
		}
	}
    
    return $output;
}

/**
 * Function to get a single lab picture binary data. Picture can be resized
 * if width/height is less than real ones. Aspect ratio is always guaranteed.
 *
 * @param   Lab     $lab                Lab
 * @param   int     $id                 Picture ID
 * @param   int     $height             Height of the resized picture
 * @param   int     $width              Width of the resized picture
 * @return  Array                       Lab picture (JSend data)
 */
function apiGetLabPictureData($lab, $id, $width, $height) {
	$output['code'] = 200;
	$output['encoding'] = 'image/png';
	
	if (isset($lab -> getPictures()[$id])) {
		$output['data'] = resizeImage($lab -> getPictures()[$id] -> getData(), $width, $height);
		$output['encoding'] = $lab -> getPictures()[$id]->getNType();
	} else {
		// Generate an error image
		$draw = new ImagickDraw();
		$draw -> setFillColor('black');
		$draw -> setFontSize(30);
		$pixel = new ImagickPixel('white');
		$img = new Imagick();
		$img -> newImage(800, 75, $pixel);
		$img -> setImageFormat('png');
		$img -> annotateImage($draw, 10, 45, 0, 'ERROR: '.$GLOBALS['messages'][60029]);
		$output['data'] = resizeImage($img -> getImageBlob(), $width, $height);
	}
	
	return $output;
}
?>
