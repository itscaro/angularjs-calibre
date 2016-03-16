'use strict';

// Declare app level module which depends on views, and components
var modulesToLoad = [
  'ui.router',
  'ui.bootstrap',
  'myApp.calibre',
  'myApp.version',
  'ngMaterial'
];
try {
  angular.module('myApp.debug')
  modulesToLoad.push('myApp.debug')
} catch (err) {

}

if (typeof Config != "undefined" && typeof process != "undefined") {
  import { ipc } from "electron";
  var Config = ipc.sendSync('config');
}

angular.module('myApp', modulesToLoad)
  .value('myAppConfig', Config)
  .config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider',
    function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
      $urlRouterProvider.otherwise('/books');

      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange');
    }])
  .run(['$rootScope', 'ngDialog',
    function($rootScope, $dialog) {
      $rootScope.about = function() {
        $dialog.open({
          template: 'components/calibre/about.html'
        })
      }

      $rootScope.loadingMode = 'indeterminate';
      $rootScope.isLoading = true;

      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        console.log('$stateChangeStart to ' + toState.to + '- fired when the transition begins. toState,toParams : \n', toState, toParams);
      });

      $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams) {
        console.log('$stateChangeError - fired when an error occurs during transition.');
        console.log(arguments);
      });

      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
      });

      $rootScope.$on('$viewContentLoaded', function(event) {
        console.log('$viewContentLoaded - fired after dom rendered', event);
      });

      $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
        console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
        console.log(unfoundState, fromState, fromParams);
      });
    }]);
