'use strict';

// Utilities:
import Promise from 'bluebird';

// Dependencies:
import angular from 'angular';

class ConfirmDialogService {
    show () {
        let resolve, reject;
        let promise = new Promise((...args) => {
            [resolve, reject] = args;
        });
        return { resolve, reject, promise };
    }
}

export default angular.module('confirmDialogService', [])
.service('confirmDialogService', ConfirmDialogService);
