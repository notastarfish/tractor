'use strict';

// Utilities:
import changecase from 'change-case';
import isUndefined from 'lodash.isundefined';

// Dependencies:
import angular from 'angular';
import template from './CheckBox.html';

class CheckboxDirective {
    constructor () {
        this.restrict = 'E';

        this.scope = {
            model: '=',
            label: '@'
        };

        this.template = template;
    }

    link ($scope) {
        if (isUndefined($scope.model)) {
            throw new Error('The "tractor-checkbox" directive requires a "model" attribute.');
        }

        if (isUndefined($scope.label)) {
            throw new Error('The "tractor-checkbox" directive requires an "label" attribute.');
        }

        $scope.property = changecase.camel($scope.label);
    }
}

export default angular.module('tractorCheckbox', [])
.directive('tractorCheckbox', CheckboxDirective);
