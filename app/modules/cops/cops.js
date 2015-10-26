'use strict';

angular.module('myApp.cops', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/cops', {
            templateUrl: 'modules/cops/cops.html',
            controller: 'CopsController'
        });
    }])

    .controller('CopsController', ['$scope', '$http', 'apiService', function ($scope, $http, apiService) {
        var offset = 0, limit = 25;

        $scope.coverUrl = function (id, height) {
            return "/api/books/" + id + "/cover.jpg?height=" + height;
        };

        $scope.searchall = function () {
            apiService.getBooks(offset, limit).success(function (data) {
                $scope.books = data;
            });
        };

        $scope.loadPage = function(page) {
            apiService.getBooks(offset + page * limit, limit).success(function (data) {
                $scope.books = data;
            });
        };

        $scope.renderHTML = function(html_code)
        {
            //return angular.element('<textarea />').html(html_code).text();
        };

        apiService.getBooks(offset, limit).success(function (data) {
            $scope.books = data;
        });
    }]);
