'use strict';

angular.module('myApp.calibre',
    [
        'ngRoute',
        'myApp.calibre.controller',
        'myApp.calibre.service'
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
            }).otherwise({
                redirectTo: '/books'
            });
        }]);
