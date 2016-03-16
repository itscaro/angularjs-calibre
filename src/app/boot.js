'use strict'

import angular from 'angular';
import mainModule from './app';
import './components/calibre/controllers';
import './components/calibre/services';
import calibreModule from './components/calibre/calibre';
import './components/version/version-directive';
import './components/version/interpolate-filter';
import versionModule from './components/version/version';

// CSS
import 'bootstrap/css/bootstrap.css!';
import 'ng-dialog/css/ngDialog.css!';
//import 'ng-dialog/css/ngDialog-theme-default.css!';
import './css/app.css!';
//import './css/material-icons.css!';

angular.element(document).ready(function() {
    angular.bootstrap(document, [mainModule.name, calibreModule.name, versionModule.name]);
});