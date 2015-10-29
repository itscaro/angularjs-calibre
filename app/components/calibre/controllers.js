'use strict'

angular.module('myApp.calibre.controllers', ['ngDialog'])
    .controller('BooksCtrl', ['myAppConfig', '$scope', '$routeParams', '$cookies', 'apiService',
        function (config, $scope, $routeParams, $cookies, apiService) {
            var page = parseInt($routeParams.page ? $routeParams.page : ($cookies.get('page') ? $cookies.get('page') : 1)),
                limit = 24;

            $scope.templates = {
                navigation: { url: 'components/calibre/partials/navigation.html'}
            };
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
    .controller('BookDetailCtrl', ['myAppConfig', '$scope', '$routeParams', 'apiService', 'ngDialog',
        function (config, $scope, $routeParams, apiService, $dialog) {
            $scope.config = config;

            $scope.coverUrl = function (id, height) {
                return apiService.getBookCover(id, height);
            };

            $scope.downloadUrl = function (id, format) {
                return apiService.getBookInFormat(id, format);
            };

            $scope.read = function (id, format) {
                $dialog.open({
                    template: 'components/calibre/reader.html',
                    controller: ['$scope', function ($scope) {
                        $scope.data = {
                            id: id,
                            format: format
                        };
                    }]
                });
            };

            apiService.getBook($routeParams.id).success(function (data) {
                $scope.book = data;
            });
        }])
    .directive('reader', ['apiService', function (apiService) {
        return function (scope, elm, attrs) {
            var url = apiService.getBookInFormat(attrs.bookId, attrs.bookFormat);
            scope.Book = ePub((url + '.' + attrs.bookFormat).toLocaleLowerCase());
            scope.Book.renderTo(elm[0]);
        };
    }]);

;
