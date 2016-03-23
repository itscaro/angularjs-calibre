var gulp = require('gulp')
var shell = require('gulp-shell')
var symdest = require('gulp-symdest')
var watch = require('gulp-watch')
var notify = require('gulp-notify')

gulp.task('tsc', shell.task([
  'tsc ./api/index.ts'
], {
    ignoreErrors: true
}));

gulp.task('browserify', shell.task([
  'browserify ./app.dev.js -o ./app.js'
]));

gulp.task('default', ['tsc', 'browserify'], shell.task([
  'node ./api/index.js'
]));

gulp.task('watch', function (cb) {
    gulp.start('default')
    watch([
        './**/*.ts',
        './app.dev.js',
    ],function() {
        gulp.start('default')
    }).pipe(notify("Done"));
});