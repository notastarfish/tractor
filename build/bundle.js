'use strict';

// Utilities:
import gulp from 'gulp';

// Dependencies:
import Builder from 'systemjs-builder';

export default function bundle (done) {
    let builder = new Builder('./src', './src/jspm.config.js');

    builder
    .bundle('./src/app/app.js', './www/bundle.js', { sourceMaps: true })
    .then(() => done())
    .catch(done);
}
