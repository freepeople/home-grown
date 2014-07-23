'use strict';
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var ugilfy = require('gulp-uglify');
var index = ['./slider/src/app'];

gulp.task('app-build', function() {
    var bundleStream = browserify({
        entries: index
    });
    bundleStream
        .bundle()
        .pipe(source('app.js'))
    // .pipe(buffer())
    // .pipe(ugilfy())
    .pipe(gulp.dest('./slider/dist/js'))
        .on('error', function(err) {
            console.log(err);
        });
});