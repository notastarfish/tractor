'use strict';

// Utilities:
import changecase from 'change-case';

// Dependencies:
import angular from 'angular';
import template from './Checkbox.html';

class CheckboxDirective {
    constructor () {
        this.restrict = 'E';

        this.scope = {
            model: '=',
            label: '@'
        };

        this.template = template;

        this.link = $scope => {
            if (angular.isUndefined($scope.model)) {
                throw new Error(`The <tractor-checkbox> directive requires a "model" attribute.`);
            }

            if (angular.isUndefined($scope.label)) {
                throw new Error(`The <tractor-checkbox> directive requires an "label" attribute.`);
            }

            $scope.property = changecase.camel($scope.label);
        };
    }
}

export default angular.module('tractor.checkbox', [])
.directive('tractorCheckbox', () => new CheckboxDirective());
