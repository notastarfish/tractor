'use strict';

// Utilities:
import changecase from 'change-case';
import isUndefined from 'lodash.isundefined';

// Dependencies:
import angular from 'angular';
import ExampleNameValidator from '../../Validators/ExampleNameValidator';
import template from './StepInput.html';

class StepInputDirective {
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
            throw new Error('The "tractor-step-input" directive requires a "model" attribute.');
        }

        if (isUndefined($scope.label)) {
            throw new Error('The "tractor-step-input" directive requires a "label" attribute.');
        }

        if (isUndefined($attrs.form)) {
            throw new Error('The "tractor-step-input" directive requires a "form" attribute.');
        }

        $scope.form = $scope.$parent[$attrs.form];
        $scope.id = Math.floor(Math.random() * Date.now());

        $scope.property = changecase.camel($scope.label);
    }
}

export default angular.module('tractorStepInput', [
    ExampleNameValidator.name
])
.directive('tractorStepInput', StepInputDirective);
