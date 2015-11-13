'use strict';

angular.module('myApp.debug', [])
    .controller('DebugCtrl', ['$rootScope', '$scope',
        function ($rootScope, $scope) {
            $rootScope.$on("DEBUG", function (event, promise) {
                promise.then(function (data) {
                    $scope.data = data
                });
            })
        }]);
