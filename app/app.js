'use strict';

// Declare app level module which depends on views, and components
var myApp;
var modulesToLoad = [
    'ngRoute',
    'ui.bootstrap',
    'myApp.calibre',
    'myApp.version',
    'ngMaterial'
];
try {
    angular.module('myApp.debug')
    modulesToLoad.push('myApp.debug')
} catch (err) {

}
myApp = angular.module('myApp', modulesToLoad)
myApp
    .value('myAppConfig', typeof Config == 'undefined' ? {} : Config)
    .config(['$routeProvider', '$mdThemingProvider', function ($routeProvider, $mdThemingProvider) {
        $routeProvider.otherwise({ redirectTo: '/books' });

        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('orange');

    }])
    .run(['$rootScope', 'ngDialog', '$interval', function ($rootScope, $dialog, $interval) {
        $rootScope.about = function () {
            $dialog.open({
                template: 'components/calibre/about.html'
            })
        }

        $rootScope.loadingMode = 'indeterminate';
        $rootScope.isLoading = true;
    }]);