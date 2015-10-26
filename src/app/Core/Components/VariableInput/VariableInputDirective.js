'use strict';

// Utilities:
import changecase from 'change-case';
import isUndefined from 'lodash.isundefined';

// Dependencies:
import angular from 'angular';
import template from './VariableInput.html'
import VariableNameValidator from '../../Validators/VariableNameValidator';

class VariableInputDirective {
    constructor () {
        this.restrict = 'E';

        this.scope = {
            model: '=',
            label: '@',
            example: '@'
        };

        this.template = template;
    }

    link ($scope, $element, $attrs) {
        if (isUndefined($scope.model)) {
            throw new Error('The "tractor-variable-input" directive requires a "model" attribute.');
        }

        if (isUndefined($scope.label)) {
            throw new Error('The "tractor-variable-input" directive requires a "label" attribute.');
        }

        if (isUndefined($attrs.form)) {
            throw new Error('The "tractor-variable-input" directive requires a "form" attribute.');
        }

        $scope.form = $scope.$parent[$attrs.form];
        $scope.id = Math.floor(Math.random() * Date.now());

        $scope.isClass = Object.prototype.hasOwnProperty.call($attrs, 'isClass');
        $scope.property = changecase.camel($scope.label);
    }
}

export default angular.module('tractorVariableInput', [
    VariableNameValidator.name
])
.directive('tractorVariableInput', VariableInputDirective);
