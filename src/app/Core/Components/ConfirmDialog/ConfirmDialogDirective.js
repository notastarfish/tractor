'use strict';

// Dependencies:
import angular from 'angular';
import ConfirmDialogController from './ConfirmDialogController';
import template from './ConfirmDialog.html';

class ConfirmDialogDirective {
    constructor () {
        this.restrict = 'E';
        this.transclude = true;

        this.scope = {
            trigger: '='
        };

        this.template = template;

        this.controller = 'ConfirmDialogController';
        this.controllerAs = 'confirmDialog';
        this.bindToController = true;
    }
}

export default angular.module('tractor.confirmDialog', [
    ConfirmDialogController.name
])
.directive('tractorConfirmDialog', () => new ConfirmDialogDirective());
