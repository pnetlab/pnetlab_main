/* UNL App */
var app_main_unl = angular.module("unlMainApp", [
    "ui.router",
    "ui.select",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngAnimate",
    "angularFileUpload",
    "ngCookies",
]).component('labFolder', {
    templateUrl: "/store/public/main/pages/main.html",
    controller: "mainController",
});


app_main_unl.directive('focusOn', function () {
    return function (scope, elem, attr) {
        scope.$on('focusOn', function (e, name) {
            if (name === attr.focusOn) {
                elem[0].focus();
            }
        });
    };
});

app_main_unl.factory('focus', function ($rootScope, $timeout) {
    return function (name) {
        console.log(name)
        $timeout(function () {
            $rootScope.$broadcast('focusOn', name);
        });
    }
});

// app_main_unl.directive('plumbItem', function () {
//     return {
//         controller: 'labController',
//         link: function (scope, element, attrs) {
//             jsPlumb.makeTarget(element);
//         }
//     };
// });

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
app_main_unl.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

app_main_unl.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

// app_main_unl.config(['$compileProvider', function ($compileProvider) {
//     $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|telnet|vnc|rdp):/);
// }]);

app_main_unl.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.cache = false;
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }
    // disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
}]);


// app_main_unl.directive('myEnter', function () {
//     return function (scope, element, attrs) {
//         element.bind("keydown keypress", function (event) {
//             if (event.which === 13) {
//                 scope.$apply(function () {
//                     scope.$eval(attrs.myEnter);
//                 });

//                 event.preventDefault();
//             }
//         });
//     };
// });

/* Setup App Main Controller */
app_main_unl.controller('unlMainController', ['$scope', '$rootScope', '$http', '$location', '$cookies', function ($rootScope, $scope, $http) {

    $scope.loaded = false;
    window.LANGUAGE = get(localStorage.getItem('language'), '');
    $http.get(`/api/auth?lang=${LANGUAGE}`)
        .then(function successCallback(response) {
            if (response.status == '200' && response.statusText == 'OK') {
                console.log(response);
                window.LANG = response.data.data.lang;
                console.log(get(response.data.data.lang['log'], ''));
                $scope.openLaba = true;
                $scope.userfolder = 'none';
                $scope.username = response.data.data.username;
                $scope.folder = (response.data.data.folder === null) ? '/' : response.data.data.folder;
                $scope.email = response.data.data.email;
                $scope.role = response.data.data.role;
                $scope.name = response.data.data.name;
                $scope.lab = response.data.data.lab;
                $scope.lang = response.data.data.lang;
                $scope.tenant = response.data.data.tenant;
                $scope.userfolder = response.data.data.folder;
                $scope.loaded = true;
            }
        }, function errorCallback() {
            console.log(response);
            if (response.status == '401' && response.statusText == 'Unauthorized') {
                location.reload();
            }
        });

}]);

app_main_unl.controller('HeaderController', function(){});










