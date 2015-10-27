'use strict';

// Declare app level module which depends on views, and components
var myApp;
try {
    angular.module('myApp.debug');
    myApp = angular
        .module('myApp', [
            'ngRoute',
            'ui.bootstrap',
            'myApp.calibre',
            'myApp.version',
            'myApp.debug'
        ]);
} catch (err) {
    myApp = angular
        .module('myApp', [
            'ngRoute',
            'ui.bootstrap',
            'myApp.calibre',
            'myApp.version'
        ]);
}

myApp
    .value('myAppConfig', typeof Config == 'undefined' ? {} : Config)
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/books'});
    }])
    .run(['$rootScope', 'ngDialog', function ($rootScope, $dialog) {
        $rootScope.about = function () {
            $dialog.open({
                template: 'components/calibre/about.html'
            })
        }
    }]);