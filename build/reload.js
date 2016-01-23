'use strict';

// Dependencies:
import browserSync from 'browser-sync';

export default function reload (reportTaskDone) {
    browserSync({
        proxy: 'localhost:4000'
    });
    reportTaskDone();
}
