var gulp = require('gulp')
var shell = require('gulp-shell')

// Run project
gulp.task('run', shell.task([
  'node_modules/electron-prebuilt/dist/electron .'
]));

// Compile project
gulp.task('build-osx', shell.task([
  'electron-packager ./ AngularJSCalibre --platform=darwin --arch=x64 --version=0.36.11'
]));

// Compile project
gulp.task('build-win', shell.task([
  'electron-packager ./ AngularJSCalibre --platform=win32 --arch=x64 --version=0.36.11'
]));

// Compile project
gulp.task('build-linux', shell.task([
  'electron-packager ./ AngularJSCalibre --platform=linux --arch=x64 --version=0.36.11'
]));

// Compile sqlite3 for electron
gulp.task('sqlite3-electron', shell.task(
  [
    'npm install nan@~2.1.0 --save',
    'npm run prepublish',
    'node-gyp configure --module_name=node_sqlite3 --module_path=../lib/binding/node-v47-win32-x64',
    'node-gyp rebuild --arch=x64 --target_platform=win32 --module_name=node_sqlite3 --module_path=../lib/binding/node-v47-win32-x64 --target=0.36.11 --dist-url=https://atom.io/download/atom-shell'
  ], {
    cwd: 'node_modules/sqlite3'
  }
));

// Compile sqlite3 for node
gulp.task('sqlite3-node', shell.task(
  [
    'npm install nan@~2.1.0 --save',
    'npm run prepublish',
    'node-gyp configure --module_name=node_sqlite3 --module_path=../lib/binding/node-v47-win32-x64',
    'node-gyp rebuild --arch=x64 --target_platform=win32 --module_name=node_sqlite3 --module_path=../lib/binding/node-v47-win32-x64'
  ], {
    cwd: 'node_modules/sqlite3'
  }
));

gulp.task('bundle', shell.task(
  [
    'jspm bundle app src/dist/app.js --inject'
  ]
));