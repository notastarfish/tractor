'use strict';

// Utilities:
import changecase from 'change-case';

// Dependencies:
import angular from 'angular';
import template from './TextInput.html';

class TextInputDirective {
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
                throw new Error('The <tractor-text-input> directive requires a "model" attribute.');
            }

            if (angular.isUndefined($scope.label)) {
                throw new Error('The <tractor-text-input> directive requires a "label" attribute.');
            }

            if (angular.isUndefined($scope.form)) {
                throw new Error('The <tractor-text-input> directive requires a "form" attribute.');
            }

            $scope.id = Math.floor(Math.random() * Date.now());
            $scope.validateFileName = Object.prototype.hasOwnProperty.call($attrs, 'validateFileName');

            $scope.property = changecase.camel($scope.label);
        };
    }
}

export default angular.module('tractor.textInput', [])
.directive('tractorTextInput', () => new TextInputDirective());
