'use strict';

// Utilities:
import gulp from 'gulp';

export default function watch (reportTaskDone) {
    gulp.watch('./server/**/*', ['test-server']);
    gulp.watch('./src/app/**/*', ['test-client']);
    gulp.watch('./src/styles/**/*', ['styles']);
    gulp.watch('./src/images/**/*', ['images']);
    gulp.watch('./src/index.html', ['markup']);
    reportTaskDone();
}
