function mainController($scope, $http, $location, $window, $uibModal, $log, $rootScope, FileUploader, focus) {

	$scope.lang = window.lang;
	$rootScope.openLaba = false;
	console.log('Current user position: ' + $rootScope.folder)
	$scope.path = ($rootScope.folder === undefined || $rootScope.folder == '') ? '/' : $rootScope.folder;
	$scope.newElementName = '';
	$scope.newElementToggle = false;
	$scope.fileSelected = false;
	$scope.allCheckedFlag = false;
	$scope.blockButtons = false;
	$scope.blockButtonsClass = '';
	$scope.fileManagerItem = [];
	$scope.checkboxArray = [];
	$scope.shared = [];
	$scope.fileOrder = 'umtime';

	ModalCtrl($scope, $uibModal, $log);

	$scope.falseForSelAll = function () {
		$scope.allCheckedFlag = false;
	}
	$scope.toggleOrder = function () {
		if ($scope.fileOrder == 'umtime')
			$scope.fileOrder = 'file'
		else
			$scope.fileOrder = 'umtime'
	}

	$scope.currentPosition = function () {
		var tempArray = $scope.path.split('/');
		var tempPathArray = []
		tempArray[0] = 'root';
		tempPathArray[0] = "/";
		if (tempArray[1] === "") { tempArray.splice(1, 1); }
		else {
			for (i = 1; i < tempArray.length; i++) {
				tempVal = '/' + tempArray[i];
				tempPathArray[i] = (i - 1 === 0) ? tempVal : tempPathArray[i - 1] + tempVal;
			}
		}
		$scope.splitPath = tempArray;
		$scope.splitPathArray = tempPathArray;

	}

	//Drawing files tree ///START
	$scope.fileMngDraw = function (path, callback = null, isShared=null) {
		
		$http.get('/api/folders', { params: { path: path } }).then(
			function successCallback(response) {
				$scope.checkboxArray = [];
				$scope.fileManagerItem = [];
				$scope.rootDir = response.data.data;
				$scope.path = path;
				console.log($scope.rootDir);
				if(isShared !== null) $scope.isShared = isShared;
				if(!$scope.isShared) $scope.currentPosition();
				if(callback) callback();
			},
			function errorCallback(response) {
				console.log(response);
				error_handle(response)
			}
		);
	}
	
	//Drawing files tree ///END
	
	$scope.fileMngDraw($rootScope.userfolder); 
	
	
	//Get information about lab ///START
	$scope.getLabInfo = function (file, name) {
		previewLab(file);
		$scope.fullPathToFile = file;
	}
	//Get information about lab ///END
	
	//Toggle view for input file/folder creations ///START
	$scope.elementToggleFun = function (thatCreate) {
		$scope.hideAllEdit()
		if (!$scope.newElementToggle) { $scope.newElementToggle = true; focus('foCreate'); $scope.thatCreate = thatCreate; return; }
		if ($scope.thatCreate == thatCreate && $scope.newElementToggle) { $scope.newElementToggle = false; }
		if (!$scope.newElementToggle) $scope.thatCreate = '';
		$scope.thatCreate = thatCreate;
	}
	//Toggle view for input file/folder creations ///END

	//Create NEW Element Folder OR Lab //START

	$scope.addNewFolder = function () {
		var newFolder = 'New Folder';
		var index = 1;
		while ($scope.rootDir.folders.find(item => {
			var folderName = item.name;
			return folderName == newFolder;
		}) !== undefined) {
			newFolder = 'New Folder ' + index;
			index++;
		}
		App.loading(true);
		$http({
			method: 'POST',
			url: '/api/folders/add',
			data: { "path": $scope.path, "name": newFolder }
		})
			.then(
				function successCallback(response) {
					App.loading(false);
					$scope.fileMngDraw($scope.path, function(){
						setTimeout(function(){
							$scope.openRename($scope.fileManagerItem['Fo_' + newFolder])
						})
						focus('Fo_' + newFolder);
						
					});
				},
				function errorCallback(response) {
					App.loading(false);
					console.log(response);
					error_handle(response);
				}
			);

	}

	$scope.addNewLab = function (path) {
		addLab(path);
	}


	$scope.cloneElement = function (elementName, event) {
		d = new Date();
		console.log('clone requested for ' + $scope.path + '/' + elementName.value + ' ' + d.getTime());
		form_data = {};
		form_data['name'] = elementName.value.slice(0, -4) + '_' + d.getTime();
		form_data['source'] = $scope.path + '/' + elementName.value;
		$http({
			method: 'POST',
			url: '/api/labs',
			data: form_data
		})
			.then(
				function successcallback(response) {
					$scope.fileMngDraw($scope.path);
					previewLab($scope.path + '/' + form_data['name'] + '.unl');
				},
				function errorcallback(response) {
					console.log(response)
					error_handle(response)
				}
			);


		event.stopPropagation();
	}


	$scope.deleteElement = function (elementName, thatis, hide) {
		$scope.hideAllEdit()
		var tempVal = (hide === undefined) ? false : true;
		//Delete folder//START
		if (thatis == 'Folder') {
			if (tempVal) if (!confirm(lang('Are you sure you want to delete this folder') + ': ' + elementName)) return;
			console.log('deleting folder ' + elementName)
			$http({
				method: 'POST',
				url: '/api/folders/delete',
				data: { path: elementName }
			})
				.then(
					function successCallback(response) {
						//console.log(response)
						$scope.fileMngDraw($scope.path);
					},
					function errorCallback(response) {
						//console.log(response)
						console.log("Unknown Error. Why did API doesn't respond?");
						error_handle(response);
					}
				);
		}

		if (thatis == 'File') {
			if (tempVal) if (!confirm(lang('Are you sure you want to delete this lab') + ': ' + elementName)) return;
			console.log('delete file')
			console.log(elementName)
			if (delLab) delLab(elementName, function(){
				$scope.fileSelected = false;
				$scope.fileMngDraw($scope.path);
				if(previewLab) previewLab('');
			});
		}

	}

	$scope.deleteALLElement = function () {
		var folderArray = [];
		var lastFolder = '';
		var lastFile = '';
		var fileArray = [];
		for (var key in $scope.checkboxArray) {
			//console.log($scope.fileManagerItem[key]);
			if ($scope.checkboxArray[key].checked) {
				var itemType = ($scope.checkboxArray[key].type == 'Folder') ? 'Fo_' : 'Fi_';
				if (itemType == 'Fo_') {
					folderArray[key.replace(itemType, '')] = $scope.path
				}
				if (itemType == 'Fi_') {
					fileArray[key.replace(itemType, '')] = $scope.path
				}
			}
		}
		if (objectLength(folderArray) == 0 && objectLength(fileArray) == 0) { toastr["warning"](lang("Please select items to delete"), "Warning"); return; }
		var folderCount = 1;
		var fileCount = 1;
		var tempAllNames = '';
		if (objectLength(folderArray) > 0)
			for (var foldername in folderArray) {
				if (folderCount !== objectLength(folderArray) || objectLength(fileArray) != 0) { commaChar = ','; } else commaChar = '';
				tempAllNames += ' ' + foldername + commaChar;
				folderCount++
			}
		commaChar = '';
		if (objectLength(fileArray) > 0)
			for (var filename in fileArray) {
				if (fileCount !== objectLength(fileArray)) commaChar = ','; else commaChar = '';
				tempAllNames += ' ' + filename + commaChar;
				fileCount++
			}
		console.log(tempAllNames)
		if (confirm(lang('Are you sure you want to delete this item') + ': ' + tempAllNames + '?')) {
			for (var foldername in folderArray) {
				if (folderArray[foldername] != '/') fullpath = folderArray[foldername] + '/' + foldername
				else fullpath = '/' + foldername
				$scope.deleteElement(fullpath, 'Folder')
			}

			for (var filename in fileArray) {
				filename = ($scope.path === '/') ? $scope.path + filename : $scope.path + '/' + filename;
				$scope.deleteElement(filename, 'File')
			}
		} else return;
	}
	//Delete ALL selected elements //END
	//////////////////////////////////////////
	//Select all elements //START
	$scope.selectAll = function () {
		if (!$scope.allCheckedFlag) {
			for (var key in $scope.checkboxArray) {
				//console.log($scope.fileManagerItem[key]);
				$scope.checkboxArray[key].checked = ($scope.checkboxArray[key].name != '..') ? true : false;
			}
			$scope.allCheckedFlag = true;
			return;
		}
		console.log($scope.allCheckedFlag);
		if ($scope.allCheckedFlag) {
			$scope.hideAllEdit()
			for (var key in $scope.checkboxArray) {
				$scope.checkboxArray[key].checked = false;
			}
			$scope.allCheckedFlag = false;
		}
	}
	//Select all elements //END
	///////////////////////////////////////////
	//Select element by clicking on <td> //START
	$scope.selectElbyTD = function (item) {
		//console.log(item)
		if (item.name == '..') return;
		var itemType = (item.type == 'Folder') ? 'Fo_' : 'Fi_';
		//console.log(itemType+item.name)
		//console.log($scope.checkboxArray[itemType+item.name])
		$scope.checkboxArray[itemType + item.name].checked = !$scope.checkboxArray[itemType + item.name].checked;
		$scope.falseForSelAll();
		$scope.hideAllEdit();
	}
	//Select element by clicking on <td> //END

	//Edit element //START
	/////
	$scope.editElementShow = function () {
		console.log($scope.checkboxArray);
		var trueCheckbox = 0;
		var tempArray = [];
		for (var key in $scope.checkboxArray) {
			console.log($scope.checkboxArray[key].checked)
			if ($scope.checkboxArray[key].checked === true) {
				tempArray['type'] = $scope.checkboxArray[key].type;
				tempArray['name'] = key;
				trueCheckbox++
			}
		}
		if (trueCheckbox == 0) { toastr["warning"](lang("Please select item to rename"), "Warning"); return; }
		if (trueCheckbox > 1) { toastr["warning"](lang("You can rename only 1 item"), "Warning"); return; }
		var itemType = (tempArray['type'] == 'Folder') ? 'Fo_' : 'Fi_';
		console.log(tempArray['name'])
		console.log($scope.fileManagerItem[tempArray['name']])
		$scope.openRename($scope.fileManagerItem[tempArray['name']])
	}
	$scope.hideAllEdit = function () {
		for (var key in $scope.fileManagerItem) {
			//console.log($scope.fileManagerItem[key]);
			$scope.fileManagerItem[key].visibleEdit = false;
			$scope.fileManagerItem[key].value = $scope.fileManagerItem[key].oldvalue;
			$scope.allCheckedFlag = false;
		}
	}
	$scope.uncheck_all = function () {
		$(".folder_check").prop("checked", false).trigger("change").trigger("unchecked");
	}

	$scope.openRename = function (item, $event) {
		if ($event != undefined) $event.stopPropagation();
		$scope.hideAllEdit()
		console.log(item)
		var itemType = (item.type == 'Folder') ? 'Fo_' : 'Fi_';
		if (itemType == 'Fi_') {
			$scope.fileManagerItem[itemType + item.oldvalue].value = $scope.fileManagerItem[itemType + item.oldvalue].value.replace(/.unl$/, "");
		}
		focus(itemType + $scope.fileManagerItem[itemType + item.oldvalue].oldvalue);
		$scope.fileManagerItem[itemType + item.oldvalue].visibleEdit = true;
	}

	$scope.editElementApply = function (item) {
		var tempPath = ($scope.path === '/') ? $scope.path : $scope.path + '/';
		var itemType = (item.type == 'Folder') ? 'Fo_' : 'Fi_';
		console.log($scope.fileManagerItem[itemType + item.oldvalue])
		var tempVal = $scope.fileManagerItem[itemType + item.oldvalue].value;
		tempVal = tempVal.replace(/[\',#,$,\",\\,/,%,\*,\,,\.,!,\(,\[,\],\),\},\{]/g, '')
		
		$scope.blockButtons = true;
		$scope.blockButtonsClass = 'm-progress';
		$scope.fileManagerItem[itemType + item.oldvalue].value = tempVal;
		if ($scope.fileManagerItem[itemType + item.oldvalue].value === $scope.fileManagerItem[itemType + item.oldvalue].oldvalue) {
			$scope.hideAllEdit(); $scope.blockButtons = false;
			$scope.blockButtonsClass = '';
			return;
		}
		if ($scope.fileManagerItem[itemType + item.oldvalue].value === $scope.fileManagerItem[itemType + item.oldvalue].oldvalue.replace(/.unl$/, "")) {
			$scope.hideAllEdit(); $scope.blockButtons = false;
			$scope.blockButtonsClass = '';
			$scope.hideAllEdit();
			return;
		}
		if (itemType == 'Fo_') {
			$scope.blockButtons = true;
			$scope.blockButtonsClass = 'm-progress';
			console.log('Rename folder:' + $scope.fileManagerItem[itemType + item.oldvalue].oldvalue + ' to ' + $scope.fileManagerItem[itemType + item.oldvalue].value)
			$http({
				method: 'POST',
				url: '/api/folders/edit',
				data: {
					new_path: tempPath + $scope.fileManagerItem[itemType + item.oldvalue].value,
					path: tempPath + $scope.fileManagerItem[itemType + item.oldvalue].oldvalue
				}
			})
				.then(
					function successCallback(response) {
						//console.log(response)
						console.log('Rename successfull')
						$scope.blockButtons = false;
						$scope.blockButtonsClass = '';
						$scope.fileMngDraw($scope.path);
					},
					function errorCallback(response) {
						console.log(response)
						$scope.blockButtons = false;
						$scope.blockButtonsClass = '';
						console.log('Rename Error' + response.data.message)
						error_handle(response)
					}
				);
		} else if (itemType == 'Fi_') {
			console.log('Rename file:' + $scope.fileManagerItem[itemType + item.oldvalue].oldvalue.replace(/.unl$/, "") + ' to ' + $scope.fileManagerItem[itemType + item.oldvalue].value)

			$http({
				method: 'POST',
				url: '/api/labs/edit',
				data: {
					path: tempPath + $scope.fileManagerItem[itemType + item.oldvalue].oldvalue,
					data: { "name": $scope.fileManagerItem[itemType + item.oldvalue].value }
				}
			})
				.then(
					function successCallback(response) {
						console.log('Rename successfull')
						$scope.blockButtons = false;
						$scope.blockButtonsClass = '';
						$scope.fileMngDraw($scope.path);
						if ($scope.fileSelected && $scope.selectedLab == $scope.fileManagerItem[itemType + item.oldvalue].oldvalue) {
							$scope.labInfo.name = $scope.fileManagerItem[itemType + item.oldvalue].value
						}
					},
					function errorCallback(response) {
						console.log(response)
						$scope.blockButtons = false;
						$scope.blockButtonsClass = '';
						error_handle(response);
					}
				);
		}
	}

	$scope.exportFiles = function () {
		

		var fileExportArray = {};
		var tempPath = ($scope.path === '/') ? $scope.path : $scope.path + '/';
		var index = 0;
		for (var key in $scope.checkboxArray) {
			
			if ($scope.checkboxArray[key].checked) {
				var itemType = ($scope.checkboxArray[key].type == 'Folder') ? 'Fo_' : 'Fi_';
				if (itemType == 'Fo_') {
					fileExportArray['"' + index + '"'] = tempPath + key.replace(itemType, '')
					index++
				}
				if (itemType == 'Fi_') {
					fileExportArray['"' + index + '"'] = tempPath + key.replace(itemType, '')
					index++
				}
			}
		}
		if (objectLength(fileExportArray) == 0) { toastr["warning"](lang("Please select items to export"), "Warning"); return; }
		fileExportArray['path'] = $scope.path;
		App.loading(true);
		$http({
			method: 'POST',
			url: '/api/export',
			data: fileExportArray
		})
			.then(
				function successCallback(response) {
					App.loading(false);
					
					console.log(response.data.data)
					var a = document.createElement('a');
					a.href = response.data.data;
					a.target = '_blank';
					a.download = response.data.data
					document.body.appendChild(a);
					a.click();
				},
				function errorCallback(response) {
					App.loading(false);
					console.log(response)
					console.log("Unknown Error. Why did API doesn't respond?");
					error_handle(response);
					//$location.path("/login");
				}
			);
	}
	//Export lab //END
	//////////////////////////////////////////
	///Import lab //START
	var uploader = $scope.uploader = new FileUploader({
		url: '/api/import',
		//autoUpload : true,
		//removeAfterUpload : true
	});

	$scope.testFun = function () {
		console.log(uploader.queue)
	}

	$scope.selectOneFileUplad = function () {
		$('#oneFileUploadInput').click();
	}

	$scope.fileNameChanged = function () {
		//console.log('here')
		console.log(uploader.queue)
		//console.log($scope.uploader)
		uploader.onBeforeUploadItem = function (item) {
			//console.info('onBeforeUploadItem', item);
			item.formData.push({ 'path': $scope.path });
		};
		uploader.onSuccessItem = function (fileItem, response, status, headers) {
			//console.info('onSuccessItem', fileItem, response, status, headers);
			$scope.fileMngDraw($scope.path)
		};
		uploader.onCompleteItem = function (fileItem, response, status, headers) {
			$scope.fileMngDraw($scope.path)
			//console.info('onCompleteItem', fileItem, response, status, headers);
		};
		uploader.onErrorItem = function (fileItem, response, status, headers) {
			//console.info('onErrorItem', fileItem, response, status, headers);
			if (status === 400) toastr["error"](response.message, "Error");
		};
	}
	///Import lab //END
	//////////////////////////////////////////
	///Move to function ///START
	$scope.moveto = function () {
		$scope.folderArrayToMove = [];
		$scope.fileArrayToMove = [];
		var fo = 0;
		var fi = 0;
		for (var key in $scope.checkboxArray) {
			
			if ($scope.checkboxArray[key].checked) {
				var itemType = ($scope.checkboxArray[key].type == 'Folder') ? 'Fo_' : 'Fi_';
				if (itemType == 'Fo_') {
					$scope.folderArrayToMove[fo] = key.replace(itemType, '')
					fo++
				}
				if (itemType == 'Fi_') {
					$scope.fileArrayToMove[fi] = key.replace(itemType, '')
					fi++
				}
			}
		}
		if (objectLength($scope.folderArrayToMove) == 0 && objectLength($scope.fileArrayToMove) == 0) { toastr["warning"](lang("Please select items to move"), "Warning"); return; }
		$scope.pathBeforeMove = $scope.path;
		$scope.openModal('moveto');
	}


	$scope.getSharedFolders = function () {
		$http({
			method: 'POST',
			url: '/store/public/admin/system/getShareFolder',
		})
			.then(
				function successCallback(response) {
					response = response['data']
					if(response['result']){
						var shared = response['data']['ctrl_shared'];
						$scope.shared = shared.map(function(item){return item.replace('/opt/unetlab/labs', '')});
					}else{
						console.log(response);
					}
				},
				function errorCallback(response) {
					console.log(response);
				}
			);
	}
	$scope.getSharedFolders();

	$scope.isOffline = function(){
		if(window.isOffline) return window.isOffline();
	}
	$scope.isAdmin = function(){
		if(window.isAdmin) return window.isAdmin();
	}
	
};


function objectLength(object) {
	return Object.keys(object).length;
}	
