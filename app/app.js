'use strict';

// Declare app level module which depends on views, and components
angular
    .module('myApp', [
        'ngRoute',
        'ui.bootstrap',
        'myApp.calibre',
        'myApp.version'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/books'});
    }]);