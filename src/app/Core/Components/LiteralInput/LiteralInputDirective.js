'use strict';

// Utilities:
import isUndefined from 'lodash.isundefined';

// Dependencies:
import angular from 'angular';
import template from './LiteralInput.html';

class LiteralInputDirective {
    constructor () {
        this.restrict = 'E';

        this.scope = {
            model: '=',
            name: '=',
            description: '=',
            required: '=',
            type: '='
        };

        this.template = template;
    }

    link ($scope, $element, $attrs) {
        if (isUndefined($scope.model)) {
            throw new Error('The "tractor-literal-input" directive requires a "model" attribute.');
        }

        if (isUndefined($scope.name)) {
            throw new Error('The "tractor-literal-input" directive requires a "name" attribute.');
        }

        if (isUndefined($attrs.form)) {
            throw new Error('The "tractor-literal-input" directive requires a "form" attribute.');
        }

        $scope.form = $scope.$parent[$attrs.form];
        $scope.id = Math.floor(Math.random() * Date.now());
    }
}

export default angular.module('tractorLiteralInput', [])
.directive('tractorLiteralInput', LiteralInputDirective);
