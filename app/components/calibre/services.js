'use strict'

angular.module('myApp.calibre.services', [])
    .service('apiService', ['$rootScope', '$http', function ($rootScope, $http) {
        this.getBooks = function (page, limit, order, search) {
            // Return promise for controller to use.
            if (search) {
                search = '?title=' + search
            } else {
                search = ''
            }
            if (order) {
                order = '?order=' + order
            } else {
                order = ''
            }
            var _return = $http.get('api/books/page/' + page + '/' + limit + search + order);

            $rootScope.$broadcast('DEBUG', _return);

            return _return;
        };

        this.getBook = function (id) {
            var _return = $http.get('api/books/' + id);

            $rootScope.$broadcast('DEBUG', _return);

            return _return;
        };

        this.getBookCover = function (id, height) {
            return 'api/books/' + id + "/cover.jpg?height=" + height;
        };

        this.getBookInFormat = function (id, format) {
            return ('api/books/' + id + '/download/' + format).toLocaleLowerCase();
        };
    }]);
