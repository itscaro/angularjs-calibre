'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'modules/view1/view1.html',
            controller: 'View1Ctrl'
        });

        $routeProvider.when('/phone', {
            templateUrl: 'modules/view1/phone.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', '$http', function ($scope, $http) {
        $http.get('data/phones.json').success(function (data) {
            $scope.phones = data.splice(0, 5);
            //$scope.phones = data;
        });

        $scope.orderProp = 'age';
    }]);