var gulp = require('gulp')
var shell = require('gulp-shell')

// Run project
gulp.task('run', shell.task([
     'node node_modules/node-webkit-builder/bin/nwbuild -v 0.12.3 --run ./'
]));

// Compile project
gulp.task('build-osx', shell.task([
	 'node node_modules/node-webkit-builder/bin/nwbuild -v 0.12.3 -p osx ./'
]));

// Compile project
gulp.task('build-win', shell.task([
	 'node node_modules/node-webkit-builder/bin/nwbuild -v 0.12.3 -p win ./'
]));

// Compile project
gulp.task('build-linux', shell.task([
	 'node node_modules/node-webkit-builder/bin/nwbuild -v 0.12.3 -p linux32,linux64 ./'
]));

// Compile project
gulp.task('install', shell.task([
	 'npm install sqlite3 --build-from-source --runtime=node-webkit --target_arch=x64 --target=0.12.3'
]));
