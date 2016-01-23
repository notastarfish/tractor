'use strict';

// Utilities:
import gulp from 'gulp';

// Dependencies:
import istanbul from 'gulp-istanbul';
import { Instrumenter as isparta } from 'isparta';
import karma from 'karma';
import mocha from 'gulp-mocha';

export default {
    server,
    client
}

function server (done) {
    gulp.src([
        'server/**/*.js',
        '!server/**/*.spec.js',
        '!server/*.js',
        '!server/cli/init/base-file-sources/*'
    ])
    .pipe(istanbul({
        instrumenter: isparta,
        includeUntested: true
    }))
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
        gulp.src('server/**/*.spec.js')
        .pipe(mocha().on('error', error => {
            console.log(error);
            this.destroy();
            done();
        }))
        .pipe(istanbul.writeReports({
            dir: './reports/server'
        }))
        .on('end', done);
    });
}

function client (done) {
    let server = new karma.Server({
        basePath: './src',

        frameworks: ['jspm', 'mocha', 'sinon-chai', 'dirty-chai'],
        browsers: ['Chrome'],

        jspm: {
            useBundles: true,
            config: 'jspm.config.js',
            loadFiles: [
                'app/**/*.js',
            ],
            serveFiles: [
                'app/**/*',
                'jspm_packages/**/*'
            ]
        },

        proxies: {
            '/app': '/base/app',
            '/jspm_packages': '/base/jspm_packages'
        },

        reporters: ['progress', 'coverage'],

        preprocessors: {
            'app/**/!(*spec).js': ['babel', 'sourcemap', 'coverage']
        },

        babelPreprocessor: {
            options: {
                presets: ['es2015'],
                sourceMap: 'inline'
            },
            sourceFileName: file => file.originalPath
        },

        coverageReporter: {
            instrumenters: { isparta },
            instrumenter: {
                'src/app/**/*.js': 'isparta'
            },

            reporters: [{
                type: 'lcov',
                dir: '../reports/client'
            }, {
                type: 'text'
            }]
        },

        colors: true,
        autoWatch: true,
        singleRun: true
    }, (exitCode) => {
        if (exitCode) {
            done('There are failing unit tests');
        } else {
            done();
        }
    });
    server.start();
}
