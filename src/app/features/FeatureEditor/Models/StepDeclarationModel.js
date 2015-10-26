'use strict';

// Dependencies:
import angular from 'angular';

function createStepDeclarationModelConstructor () {
    class StepDeclarationModel {
        constructor () {
            this.types = ['Given', 'When', 'Then', 'And', 'But'];
            let [type] = this.types;
            this.type = type;
            this.step = '';
        }

        get feature () {
            return toFeature.call(this);
        }
    }

    StepDeclarationModel.getExampleVariableNames = step => {
        return step.match(new RegExp('<.+?>', 'g'))
        .map(result => result.replace(/^</, '').replace(/>$/, ''));
    }

    return StepDeclarationModel;

    function toFeature () {
        return `${this.type} ${this.step}`;
    }
}

export default angular.module('stepDeclarationModel', [])
.factory('StepDeclarationModel', createStepDeclarationModelConstructor);
