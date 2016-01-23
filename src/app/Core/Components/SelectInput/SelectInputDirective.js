'use strict';

// Utilities:
import changecase from 'change-case';

// Dependencies:
import angular from 'angular';
import template from './SelectInput.html';

class SelectInputDirective {
    constructor () {
        this.restrict = 'E';

        this.scope = {
            model: '=',
            label: '@',
            options: '=',
            as: '@'
        };

        this.template = template;

        this.link = $scope => {
            if (angular.isUndefined($scope.model)) {
                throw new Error('The <tractor-select> directive requires a "model" attribute.');
            }

            if (angular.isUndefined($scope.label)) {
                throw new Error('The <tractor-select> directive requires a "label" attribute.');
            }

            $scope.property = changecase.camel($scope.label);
            $scope.selectOptions = getOptionsFromProperty($scope);

            if (angular.isUndefined($scope.selectOptions) && angular.isUndefined($scope.options)) {
                throw new Error('The <tractor-select> directive requires an "options" attribute, or a "label" attribute that matches a set of options on the "model".');
            }

            $scope.$watchCollection('options', () => {
                $scope.selectOptions = $scope.options || getOptionsFromProperty($scope);
            });
        };
    }
}

function getOptionsFromProperty ($scope) {
    return $scope.model[`${$scope.property}s`];
}

export default angular.module('tractor.select', [])
.directive('tractorSelect', () => new SelectInputDirective());
