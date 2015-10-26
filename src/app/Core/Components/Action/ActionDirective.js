'use strict';

// Utilities:
import changecase from 'change-case';
import isUndefined from 'lodash.isundefined';

// Dependencies:
import angular from 'angular';
import template from './Action.html';

class ActionDirective {
    constructor () {
        this.restrict = 'E';

        this.scope = {
            model: '=',
            action: '@',
            argument: '=',
            icon: '@'
        };

        this.template = template;
    }

    link ($scope) {
        if (isUndefined($scope.model)) {
            throw new Error('The "tractor-action" directive requires a "model" attribute.');
        }

        if (isUndefined($scope.action)) {
            throw new Error('The "tractor-action" directive requires an "action" attribute.');
        }

        $scope.method = changecase.camel($scope.action);
    }
}

export default angular.module('tractorAction', [])
.directive('tractorAction', ActionDirective);
