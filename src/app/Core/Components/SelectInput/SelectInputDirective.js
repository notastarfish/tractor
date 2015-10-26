'use strict';

// Utilities:
import changecase from 'change-case';
import isUndefined from 'lodash.isundefined';

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
    }

    link ($scope) {
        if (isUndefined($scope.model)) {
            throw new Error('The "tractor-select" directive requires a "model" attribute.');
        }

        if (isUndefined($scope.label)) {
            throw new Error('The "tractor-select" directive requires a "label" attribute.');
        }

        $scope.property = changecase.camel($scope.label);
        $scope.selectOptions = getOptionsFromProperty($scope);

        if (isUndefined($scope.selectOptions) && isUndefined($scope.options)) {
            throw new Error('The "tractor-select" directive requires an "options" attribute, or a "label" attribute that matches a set of options on the "model".');
        }

        $scope.$watchCollection('options', () => {
            $scope.selectOptions = $scope.options || getOptionsFromProperty($scope);
        });
    }
}

function getOptionsFromProperty ($scope) {
    return $scope.model[`${$scope.property}s`];
}

export default angular.module('tractorSelect', [])
.directive('tractorSelect', SelectInputDirective);
