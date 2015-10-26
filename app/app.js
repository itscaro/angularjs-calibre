'use strict';

function ApiService($http) {
    this.$http = $http;
    this.url = "/api/";
};

// Declare app level module which depends on views, and components
angular
    .module('myApp', [
        'ngRoute',
        'myApp.view1',
        'myApp.view2',
        'myApp.cops',
        'myApp.version'
    ])
    .service('apiService', ApiService)
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/view1'});
    }]);

ApiService.prototype.getBooks = function (offset, limit) {
    // Return promise for controller to use.
    return this.$http.get(this.url + 'books/' + offset + '/' + limit)
};
