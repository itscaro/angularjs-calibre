'use strict'

angular.module('myApp.calibre.controllers', ['ngDialog'])
    .value('myApp.calibre.templates', {
        navigation: { url: 'components/calibre/partials/navigation.html' },
        bookinfo: { url: 'components/calibre/partials/book-info.html' }
    })
    .controller('BooksCtrl', ['myApp.calibre.templates', '$rootScope', '$scope', '$stateParams', '$cookies', 'apiService',
        function (templates, $rootScope, $scope, $stateParams, $cookies, apiService) {
            $scope.templates = templates
            $scope.page = parseInt($stateParams.page ? $stateParams.page : ($cookies.get('page') ? $cookies.get('page') : 1))
            $scope.perpage = parseInt($stateParams.perpage ? $stateParams.perpage : ($cookies.get('perpage') ? $cookies.get('perpage') : 24))
            $scope.Math = window.Math;

            $scope.$watch('page', function (newValue, oldValue) {
                $cookies.put('page', newValue)
            });

            $scope.$watch('perpage', function (newValue, oldValue) {
                $cookies.put('perpage', newValue)
            });

            $scope.coverUrl = function (id, height) {
                return apiService.getBookCover(id, height);
            };

            $scope.languageText = function (lang_code) {
                switch (lang_code) {
                    case 'eng':
                        return 'English';
                    case 'fra':
                        return 'French';
                    case 'vie':
                        return 'Vietnamese';
                }
            };

            $scope.searchall = function () {
                $scope.page = 1
                $rootScope.isLoading = true
                apiService.getBooks($scope.page, $scope.perpage, $scope.sort, $scope.query)
                    .success(function (data) {
                        $scope.books = data.books
                        $scope.count = data.count
                        $rootScope.isLoading = false
                    });
            };

            $scope.loadPage = function (page) {
                $scope.page = page
                $rootScope.isLoading = true
                apiService.getBooks(page, $scope.perpage, $scope.sort, $scope.query)
                    .success(function (data) {
                        $scope.books = data.books
                        $scope.count = data.count
                        $rootScope.isLoading = false
                    });
            };

            $scope.loadPage($scope.page)
        }])
    .controller('BookDetailCtrl', ['myApp.calibre.templates', '$rootScope', '$scope', '$stateParams', 'apiService', 'ngDialog',
        function (templates, $rootScope, $scope, $stateParams, apiService, $dialog) {
            $scope.templates = templates

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

            $rootScope.isLoading = true
            apiService.getBook($stateParams.id).success(function (data) {
                $scope.book = data;
                $rootScope.isLoading = false
            });
        }])
    .directive('reader', ['apiService', function (apiService) {
        return function (scope, elm, attrs) {
            var url = apiService.getBookInFormat(attrs.bookId, attrs.bookFormat);
            console.debug((url + '.' + attrs.bookFormat).toLocaleLowerCase());
            var bookLoc = (url + '.' + attrs.bookFormat).toLocaleLowerCase();
            scope.Book = ePub(bookLoc);
            scope.Book.renderTo(elm[0]);
        };
    }]);

;
