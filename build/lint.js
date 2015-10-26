'use strict';

// Utilities:
var gulp = require('gulp');

// Dependencies:
var eslint = require('gulp-eslint');

module.exports = {
    server: server,
    client: client
};

function server () {
    return gulp.src(['server/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
}

function client () {
    return gulp.src([
        'src/app/**/*.js',
        '!src/app/**/*spec.js',
        '!src/app/**/*mock.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format());
}
