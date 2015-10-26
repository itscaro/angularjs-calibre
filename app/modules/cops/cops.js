'use strict';

angular.module('myApp.cops', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/cops', {
            templateUrl: 'modules/cops/cops.html',
            controller: 'CopsController'
        });
    }])

    .controller('CopsController', ['$scope', '$http', 'apiService', function ($scope, $http, apiService) {
        $scope.coverUrl = function (id, height) {
            return "/api/cops/fetch.php?id=" + id + "&height=" + height + "db=&_";
        }
        $scope.renderHTML = function(html_code)
        {
            return angular.element('<textarea />').html(html_code).text();
        };
        apiService.getBooks().success(function (data) {
            $scope.books = data.entries;
        });
    }]);