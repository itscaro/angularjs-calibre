'use strict';

angular.module('myApp.calibre',
    [
        'ui.router',
        'ngCookies',
        'myApp.calibre.controllers',
        'myApp.calibre.services'
    ])
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('books', {
                    url: '/books',
                    templateUrl: 'components/calibre/books.html',
                    controller: 'BooksCtrl'
                })
                .state('book-detail', {
                    url: '/books/{id:int}',
                    templateUrl: 'components/calibre/book-detail.html',
                    controller: 'BookDetailCtrl'
                });
        }]);
