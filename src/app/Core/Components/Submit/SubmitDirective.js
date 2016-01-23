'use strict';

// Dependencies:
import angular from 'angular';
import template from './Submit.html';

class SubmitDirective {
    constructor () {
        this.restrict = 'E';

        this.scope = {
            action: '@'
        };

        this.template = template;

        this.link = $scope => {
            if (angular.isUndefined($scope.action)) {
                throw new Error('The <tractor-submit> directive requires an "action" attribute.');
            }
        };
    }
}

export default angular.module('tractor.submit', [])
.directive('tractorSubmit', () => new SubmitDirective());
