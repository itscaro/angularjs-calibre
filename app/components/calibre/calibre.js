'use strict';

angular.module('myApp.calibre',
    [
        'ngRoute',
        'myApp.calibre.controllers',
        'myApp.calibre.services'
    ])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/books', {
                templateUrl: 'components/calibre/books.html',
                controller: 'BooksCtrl'
            });
            $routeProvider.when('/books/:id', {
                templateUrl: 'components/calibre/book-detail.html',
                controller: 'BookDetailCtrl'
            });
        }]);
