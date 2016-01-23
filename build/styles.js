'use strict';

// Utilities:
import gulp from 'gulp';

// Dependencies:
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import cssminify from 'gulp-minify-css';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';

// Errors:
import errorHandler from './utilities/error-handler';

export default function styles () {
    return gulp.src('./src/styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({
        browsers: ['last 2 version']
    }))
    .pipe(sourcemaps.init())
    .pipe(cssminify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./www/'))
    .pipe(browserSync.reload({
        stream: true
    }));
}
