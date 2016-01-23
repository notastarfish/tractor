'use strict';

// Dependencies:
import angular from 'angular';
import template from './LiteralInput.html';

class LiteralInputDirective {
    constructor () {
        this.restrict = 'E';

        this.scope = {
            form: '=',
            model: '=',
            name: '=',
            description: '=',
            required: '=',
            type: '='
        };

        this.template = template;

        this.link = ($scope) => {
            if (angular.isUndefined($scope.model)) {
                throw new Error('The <tractor-literal-input> directive requires a "model" attribute.');
            }

            if (angular.isUndefined($scope.name)) {
                throw new Error('The <tractor-literal-input> directive requires a "name" attribute.');
            }

            if (angular.isUndefined($scope.form)) {
                throw new Error('The <tractor-literal-input> directive requires a "form" attribute.');
            }

            $scope.id = Math.floor(Math.random() * Date.now());
        };
    }
}

export default angular.module('tractor.literalInput', [])
.directive('tractorLiteralInput', () => new LiteralInputDirective());
