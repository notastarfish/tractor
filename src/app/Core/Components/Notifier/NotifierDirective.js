'use strict';

// Dependencies:
import angular from 'angular';
import NotifierService from './NotifierService';
import template from './Notifier.html'

class NotifierDirective {
    constructor (
        notifierService
    ) {
        this.notifierService = notifierService;

        this.restrict = 'E';
        this.template = template;
    }

    link ($scope) {
        $scope.notifications = this.notifierService.notifications;
        $scope.dismiss = this.notifierService.dismiss;
    }
}

export default angular.module('tractorNotifier', [
    NotifierService.name
])
.directive('tractorNotifier', NotifierDirective);
