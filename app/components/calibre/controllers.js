'use strict'

angular.module('myApp.calibre.controller', [])
    .controller('BooksCtrl', ['$scope', '$http', 'apiService',
        function ($scope, $http, apiService) {
            var page = 1, limit = 25;

            $scope.coverUrl = function (id, height) {
                return apiService.getBookCover(id, height);
            };

            $scope.searchall = function () {
                apiService.getBooks(page, limit).success(function (data) {
                    $scope.books = data;
                });
            };

            $scope.loadPage = function (page) {
                apiService.getBooks(page, limit).success(function (data) {
                    $scope.books = data;
                });
            };

            apiService.getBooks(page, limit).success(function (data) {
                $scope.books = data;
            });
        }])
    .controller('BookDetailCtrl', ['$scope', '$routeParams', 'apiService',
        function ($scope, $routeParams, apiService) {
            $scope.coverUrl = function (id, height) {
                return apiService.getBookCover(id, height);
            };

            $scope.renderHTML = function (html_code) {
                //return angular.element('<textarea />').html(html_code).text();
            };

            apiService.getBook($routeParams.id).success(function (data) {
                $scope.book = data;
            });
        }]);