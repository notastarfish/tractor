'use strict';

// Utilities:
import changecase from 'change-case';

// Dependencies:
import angular from 'angular';
import ExampleNameValidator from '../../Validators/ExampleNameValidator';
import template from './StepInput.html';

class StepInputDirective {
    constructor () {
        this.restrict = 'E';

        this.scope = {
            form: '=',
            model: '=',
            label: '@',
            example: '@'
        };

        this.template = template;

        this.link = ($scope) => {
            if (angular.isUndefined($scope.model)) {
                throw new Error('The <tractor-step-input> directive requires a "model" attribute.');
            }

            if (angular.isUndefined($scope.label)) {
                throw new Error('The <tractor-step-input> directive requires a "label" attribute.');
            }

            if (angular.isUndefined($scope.form)) {
                throw new Error('The <tractor-step-input> directive requires a "form" attribute.');
            }

            $scope.id = Math.floor(Math.random() * Date.now());

            $scope.property = changecase.camel($scope.label);
        };
    }
}

export default angular.module('tractor.stepInput', [
    ExampleNameValidator.name
])
.directive('tractorStepInput', () => new StepInputDirective());
