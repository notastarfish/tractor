'use strict';

// Utilities:
import gulp from 'gulp';

// Dependencies:
import eslint from 'gulp-eslint';

export default {
    server,
    client
}

function server () {
    return gulp.src(['server/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
}

function client () {
    return gulp.src([
        'src/app/**/*.js',
        'src/app/**/*spec.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format());
}
