'use strict';

// Dependencies:
import angular from 'angular';
import NotifierController from './NotifierController';
import NotifierService from './NotifierService';
import template from './Notifier.html'

class NotifierDirective {
    constructor () {
        this.restrict = 'E';
        this.template = template;

        this.controller = NotifierController;
        this.controllerAs = 'notifier';
        this.bindToController = true;
    }
}

export default angular.module('tractor.notifier', [
    NotifierService.name
])
.directive('tractorNotifier', () => new NotifierDirective());
