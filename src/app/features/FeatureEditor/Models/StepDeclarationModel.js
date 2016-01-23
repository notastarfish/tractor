'use strict';

// Dependencies:
import angular from 'angular';

// Symbols:
const types = Symbol();

function createStepDeclarationModelConstructor () {
    return class StepDeclarationModel {
        constructor () {
            this[types] = ['Given', 'When', 'Then', 'And', 'But'];
            let [type] = this.types;

            this.type = type;
            this.step = '';
        }

        get types () {
            return this[types];
        }

        get feature () {
            return toFeature.call(this);
        }
    }

    function toFeature () {
        return `${this.type} ${this.step}`;
    }
}

export default angular.module('tractor.stepDeclarationModel', [])
.factory('StepDeclarationModel', createStepDeclarationModelConstructor);
