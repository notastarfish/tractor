'use strict';

// Dependencies:
import gulp from 'gulp';

// Tasks:
import assets from './build/assets';
import bundle from './build/bundle';
import lint from './build/lint';
import reload from './build/reload';
import styles from './build/styles';
import test from'./build/test';
import watch from './build/watch';

gulp.task('bundle', bundle);

gulp.task('config', ['bundle'], assets.config);
gulp.task('files', assets.files);
gulp.task('fonts', assets.fonts);
gulp.task('images', assets.images);
gulp.task('markup', assets.markup);
gulp.task('assets', ['config', 'files', 'fonts', 'images', 'markup']);

gulp.task('styles', styles);

gulp.task('lint-server', lint.server);
gulp.task('test-server', ['lint-server'], test.server);

gulp.task('lint-client', lint.client);
gulp.task('test-client', ['lint-client'], test.client);

gulp.task('reload', reload);
gulp.task('watch', ['reload'], watch);

gulp.task('server', ['test-server', 'watch']);
gulp.task('client', ['assets', 'styles', 'watch', 'lint-client']);
