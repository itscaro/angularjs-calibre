'use strict'

angular.module('myApp.calibre.services', [])
    .service('apiService', ['$http', function ($http) {
        this.getBooks = function (page, limit) {
            // Return promise for controller to use.
            return $http.get('api/books/page/' + page + '/' + limit)
        };

        this.getBook = function (id) {
            return $http.get('api/books/' + id)
        };

        this.getBookCover = function (id, height) {
            return 'api/books/' + id + "/cover.jpg?height=" + height;
        };

        this.getBookInFormat = function (id, format) {
            return ('api/books/' + id + '/download/' + format).toLocaleLowerCase();
        };
    }]);