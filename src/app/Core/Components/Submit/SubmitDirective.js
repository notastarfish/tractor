'use strict';

// Utilities:
import isUndefined from 'lodash.isundefined';

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
    }

    link ($scope) {
        if (isUndefined($scope.action)) {
            throw new Error('The "tractor-submit" directive requires an "action" attribute.');
        }
    }
}

export default angular.module('tractorSubmit', [])
.directive('tractorSubmit', SubmitDirective);
