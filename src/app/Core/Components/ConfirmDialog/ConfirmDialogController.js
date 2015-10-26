'use strict';

// Dependencies:
import angular from 'angular';

class ConfirmDialogController {
    ok () {
        this.trigger.resolve();
    }

    cancel () {
        this.trigger.reject();
    }
}

export default angular.module('confirmDialogController', [])
.controller('ConfirmDialogController', ConfirmDialogController);
