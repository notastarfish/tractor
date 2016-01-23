'use strict';

// Utilities:
import changecase from 'change-case';

// Dependencies:
import angular from 'angular';
import template from './VariableInput.html'
import VariableNameValidator from '../../Validators/VariableNameValidator';

class VariableInputDirective {
    constructor () {
        this.restrict = 'E';

        this.scope = {
            form: '=',
            model: '=',
            label: '@',
            example: '@'
        };

        this.template = template;

        this.link = ($scope, $element, $attrs) => {
            if (angular.isUndefined($scope.model)) {
                throw new Error('The <tractor-variable-input> directive requires a "model" attribute.');
            }

            if (angular.isUndefined($scope.label)) {
                throw new Error('The <tractor-variable-input> directive requires a "label" attribute.');
            }

            if (angular.isUndefined($scope.form)) {
                throw new Error('The <tractor-variable-input> directive requires a "form" attribute.');
            }

            $scope.id = Math.floor(Math.random() * Date.now());

            $scope.isClass = Object.prototype.hasOwnProperty.call($attrs, 'isClass');
            $scope.property = changecase.camel($scope.label);
        };
    }
}

export default angular.module('tractor.variableInput', [
    VariableNameValidator.name
])
.directive('tractorVariableInput', () => new VariableInputDirective());
