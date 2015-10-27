'use strict'

angular.module('myApp.calibre.controllers', [])
    .controller('BooksCtrl', ['myAppConfig', '$scope', '$routeParams', '$cookies', 'apiService',
        function (config, $scope, $routeParams, $cookies, apiService) {
            var page = parseInt($routeParams.page ? $routeParams.page : ($cookies.get('page') ? $cookies.get('page') : 1)),
                limit = 24;

            $scope.page = page;
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
                $cookies.put('page', page)
                apiService.getBooks(page, limit).success(function (data) {
                    $scope.books = data;
                });
            };

            $scope.loadPage(page)
        }])
    .controller('BookDetailCtrl', ['myAppConfig', '$scope', '$routeParams', 'apiService',
        function (config, $scope, $routeParams, apiService) {
            $scope.config = config;

            $scope.coverUrl = function (id, height) {
                return apiService.getBookCover(id, height);
            };

            $scope.downloadUrl = function (id, format) {
                return apiService.getBookInFormat(id, format);
            };

            $scope.renderHTML = function (html_code) {
                //return angular.element('<textarea />').html(html_code).text();
            };

            apiService.getBook($routeParams.id).success(function (data) {
                $scope.book = data;
            });
        }]);
