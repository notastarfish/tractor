'use strict';

// Utilities:
import changecase from 'change-case';

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

        this.link = $scope => {
            if (angular.isUndefined($scope.model)) {
                throw new Error(`The <tractor-action> directive requires a "model" attribute.`);
            }

            if (angular.isUndefined($scope.action)) {
                throw new Error(`The <tractor-action> directive requires an "action" attribute.`);
            }

            $scope.method = changecase.camel($scope.action);
        };
    }
}

export default angular.module('tractor.action', [])
.directive('tractorAction', () => new ActionDirective());
