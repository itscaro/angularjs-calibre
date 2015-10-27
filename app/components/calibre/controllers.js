'use strict'

angular.module('myApp.calibre.controllers', [])
    .controller('BooksCtrl', ['myAppConfig', '$scope', '$http', 'apiService',
        function (config, $scope, $http, apiService) {
            var page = 1, limit = 25;

            $scope.config = config;

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
    .controller('BookDetailCtrl', ['myAppConfig', '$scope', '$routeParams', 'apiService',
        function (config, $scope, $routeParams, apiService) {
            $scope.config = config;

            $scope.coverUrl = function (id, height) {
                return apiService.getBookCover(id, height);
            };

            $scope.downloadUrl = function(id, format) {
                return apiService.getBookInFormat(id, format);
            };

            $scope.renderHTML = function (html_code) {
                //return angular.element('<textarea />').html(html_code).text();
            };

            apiService.getBook($routeParams.id).success(function (data) {
                $scope.book = data;
            });
        }]);
