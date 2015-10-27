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
        ])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.otherwise({redirectTo: '/books'});
        }])
        .value('myAppConfig', typeof Config == 'undefined' ? {} : Config);
} catch (err) {
    console.log(err.message)
    myApp = angular
        .module('myApp', [
            'ngRoute',
            'ui.bootstrap',
            'myApp.calibre',
            'myApp.version'
        ])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.otherwise({redirectTo: '/books'});
        }])
        .value('myAppConfig', typeof Config == 'undefined' ? {} : Config);
}

