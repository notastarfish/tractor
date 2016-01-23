'use strict';

// Utilities:
import gulp from 'gulp';

// Dependencies:
import browserSync from 'browser-sync';
import changed from 'gulp-changed';

export default {
    config,
    files,
    fonts,
    images,
    markup
}

function config () {
    return gulp.src([
        './src/jspm.config.js'
    ])
    .pipe(gulp.dest('./www/'));
}

function files () {
    return gulp.src([
        './src/jspm_packages/system.js',
        './src/jspm_packages/system-polyfills.js'
    ])
    .pipe(gulp.dest('./www/jspm_packages/'));
}

function fonts () {
    return gulp.src('./src/fonts/*')
    .pipe(gulp.dest('./www/fonts/'));
}

function images () {
    return gulp.src('./src/images/*')
    .pipe(changed('./src/images/'))
    .pipe(gulp.dest('./www/images/'))
    .pipe(browserSync.reload({
        stream: true
    }));
}

function markup () {
    return gulp.src('./src/*.html')
    .pipe(gulp.dest('./www/'))
    .pipe(browserSync.reload({
        stream: true
    }));
}
