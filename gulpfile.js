var gulp = require('gulp')
var shell = require('gulp-shell')

// Run project
gulp.task('run', shell.task([
     'node_modules/electron-prebuilt/dist/electron .'
]));

// Compile project
gulp.task('build-osx', shell.task([
	 'electron-packager ./ AngularJSCalibre --platform=darwin --arch=x64 --version=0.35.0'
]));

// Compile project
gulp.task('build-win', shell.task([
	 'electron-packager ./ AngularJSCalibre --platform=win32 --arch=x64 --version=0.35.0'
]));

// Compile project
gulp.task('build-linux', shell.task([
	 'electron-packager ./ AngularJSCalibre --platform=linux --arch=x64 --version=0.35.0'
]));

// Compile project
gulp.task('install', shell.task([
	 'npm install sqlite3 --build-from-source --runtime=node-webkit --target_arch=x64 --target=0.12.3'
]));
