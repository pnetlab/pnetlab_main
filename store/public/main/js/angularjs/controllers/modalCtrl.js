function ModalCtrl($scope, $uibModal, $log) {

    //$scope.items = ['item1', 'item2', 'item3'];
    $scope.modalActions = {
        'moveto': { 'path': '/store/public/main/pages/modals/moveto.html', 'controller': 'MoveToModalCtrl' },
    };

    $scope.animationsEnabled = true;

    $scope.openModal = function (action, edituser, size) {
        $scope.edituser = (edituser === undefined) ? '' : edituser;
        var pathToModal = (action === undefined) ? 'default' : action;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: $scope.modalActions[pathToModal]['path'],
            controller: $scope.modalActions[pathToModal]['controller'],
            windowTopClass: 'show',
            size: size,
            scope: $scope,
            backdrop: (size == 'megalg') ? false : true,
            resolve: {
                data: function () {
                    switch (action) {
                        case 'moveto':
                            return { 'foldersArray': $scope.folderArrayToMove, 'filesArray': $scope.fileArrayToMove, 'path': $scope.path };
                            break;
                        default:
                            return { 'wtf': $scope.newElementName, 'path': $scope.path };
                    }
                }
            }
        });
        switch (action) {

            case 'moveto':
                modalInstance.result.then(function (result) {
                    if (result) {
                        $scope.fileMngDraw($scope.pathBeforeMove);
                    } else {
                        $scope.fileMngDraw($scope.pathBeforeMove);
                    }
                }, function () {
                    //function if user just close modal
                    //$log.info('Modal dismissed at: ' + new Date());
                    console.log('here')
                    //$scope.selectAll();
                    $scope.allCheckedFlag = false;
                    $scope.fileMngDraw($scope.pathBeforeMove);
                });
                break;
            default:
                modalInstance.result.then(function () {
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
        }
    };
};

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above
function ModalInstanceCtrl($scope, $uibModalInstance) {

    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
    };
};

function MoveToModalCtrl($scope, $uibModalInstance, data, $http, $location, $interval) {

    $scope.filedata = data.filesArray
    $scope.folderdata = data.foldersArray
    $scope.path = data.path
    $scope.pathForTest = ($scope.path === '/') ? $scope.path : $scope.path + '/';
    $scope.errorMessage = "";
    $scope.folderSearchList = [];
    $scope.currentSearchPath = '';
    $scope.newpath = "";
    $scope.openDropdown = "";
    $scope.pathDeeper = 0;
    $scope.pathDeeperCheck = 0;
    $scope.apiSearch = false;
    $scope.localSearch = "";
    $scope.blockButtons = false;
    $scope.blockButtonsClass = '';
    // $scope.inputSlash=$('#newPathInput');
    //$("#newPathInput").dropdown();
    console.log($scope.filedata)
    console.log($scope.folderdata)

    // $scope.inputSlash = function(){
    // 	$('#newPathInput').focus();
    // 	var inputSlash = $('#newPathInput').val();
    // 	inputSlash.val('/');
    // 	inputSlash.val(inputSlash);
    // }

    $scope.fastSearch = function (pathInput) {
        $scope.errorMessage = "";
        var re = /^\//;
        //console.log($scope.newpath.search(re))
        if (pathInput == "" || pathInput.search(re) == -1) { $scope.openDropdown = ""; return; }
        var fullPathSplit = $scope.newpath.split('/')
        var pathSearch = '';
        console.log(fullPathSplit)
        $scope.localSearch = fullPathSplit[fullPathSplit.length - 1];
        console.log(fullPathSplit.length)
        if ($scope.pathDeeperCheck > fullPathSplit.length - 1) $scope.pathDeeper = fullPathSplit.length - 2
        $scope.pathDeeperCheck = fullPathSplit.length - 1
        for (z = 0; z < (fullPathSplit.length - 1); z++) {
            pathSearch += fullPathSplit[z] + '/'
        }
        console.log(pathSearch)
        if ($scope.pathDeeper < fullPathSplit.length - 1) {
            $scope.localSearch = '';
            $scope.apiSearch = true;
            $scope.openDropdown = "show";
            $scope.pathDeeper = fullPathSplit.length - 1
            console.log('API search')
            $scope.currentSearchPath = pathSearch;
            if (pathSearch != '/') pathSearch = pathSearch.replace(/\/$/, '');
            $http.get('/api/folders', { params: { path: pathSearch } }).then(
                function successCallback(response) {
                    $scope.folderSearchList = response.data.data.folders
                    if ($scope.folderSearchList.length == 1) $scope.openDropdown = "";
                    console.log(response)
                    $scope.apiSearch = false;
                },
                function errorCallback(response) {
                    console.log(response)
                    error_handle(response);
                }
            );
        } else {
            if ($scope.localSearch == '') { $scope.openDropdown = ""; return; }
            $scope.openDropdown = "show";
            console.log('Local Search');
            console.log($scope.localSearch)

        }
    }
    $scope.fastSearchFast = function (foldername) {
        var fastPath = $scope.currentSearchPath + foldername + '/';
        $scope.newpath = fastPath;
        $scope.fastSearch(fastPath);
        $("#newPathInput").focus();

    }

    $scope.deselect = function () {

    }

    $scope.move = function () {
        $scope.openDropdown = "";
        $scope.folderfound = true;
        var re = /^\/.*\/$/;
        $scope.newpath = "/" + $scope.newpath
        console.log($scope.newpath.search(re))
        $scope.errorMessage = "";
        if ($scope.newpath == "") { $scope.errorMessage = "New path can't be empty"; return; }
        if ($scope.newpath.search(re) == -1 && $scope.newpath != "/") { $scope.errorMessage = "Unknown path format, be sure that you added '/' to the end"; return; }
        if ($scope.pathForTest == $scope.newpath) { $scope.errorMessage = "Path can't be the same"; return; }

        for (i = 0; i < $scope.folderdata.length; i++) {
            if ($scope.pathForTest + $scope.folderdata[i] + '/' == $scope.newpath) { $scope.errorMessage = "You can't select this directory"; return; }
            //console.log($scope.pathForTest+$scope.folderdata[i][0]+'/')
        }
        $http.get('/api/folders', { params: { path: $scope.newpath.replace(/\/$/, '') } }).then(
            function successCallback(response) {
                console.log(response)
            },
            function errorCallback(response) {
                console.log(response)
                error_handle(response);
                //console.log("Unknown Error. Why did API doesn't respond?"); $location.path("/login");
            }
        ).finally(function () {
            if ($scope.folderfound) {
                $scope.blockButtons = true;
                $scope.blockButtonsClass = 'm-progress';
                var folderTester = $scope.folderdata.length
                var fileTester = $scope.filedata.length
                var stopTester = 5;
                if ($scope.folderdata.length > 0)
                    for (fo = 0; fo < $scope.folderdata.length; fo++) {
                        ///Move Folders///START
                        $http({
                            method: 'POST',
                            url: '/api/folders/edit',
                            data: {
                                path: $scope.pathForTest + $scope.folderdata[fo],
                                new_path: $scope.newpath + $scope.folderdata[fo]
                            }
                        }).then(
                            function successCallback(response) {
                                console.log(response)
                                folderTester--
                            },
                            function errorCallback(response) {
                                console.log(response)
                                error_handle(response);
                                //$location.path("/login");
                            }
                        );
                    }
                ///Move Folders///END
                /////////////////////
                //Edit APPLY for File //START
                if ($scope.filedata.length > 0)
                    for (fi = 0; fi < $scope.filedata.length; fi++) {
                        var tempPathNew = ($scope.newpath == '/') ? $scope.newpath : $scope.newpath.replace(/\/$/, '');
                        $http({
                            method: 'POST',
                            url: '/api/labs/move',
                            data: { 
                                path: $scope.pathForTest + $scope.filedata[fi],
                                new_path: tempPathNew 
                            }
                        })
                            .then(
                                function successCallback(response) {
                                    console.log(response)
                                    fileTester--
                                },
                                function errorCallback(response) {
                                    console.log(response)
                                    error_handle(response);
                                    $uibModalInstance.dismiss('cancel');
                                }
                            );
                        //Edit APPLY for File //END
                    }
                $interval(function () {
                    console.log
                    if ((folderTester <= 0 && fileTester <= 0) || stopTester == 0) {
                        $scope.result = true; $uibModalInstance.close($scope.result);
                        $scope.blockButtons = false;
                        $scope.blockButtonsClass = '';
                        return;
                    }
                    else stopTester--
                }, 1000);
            }
        })

        console.log($scope.errorMessage)
    }

    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
    };

}

