'use strict';

// Dependencies:
import angular from 'angular';
import StringToLiteralService from '../../../Core/Services/StringToLiteralService';

// Symbols:
const scenario = Symbol();
const values = Symbol();

function createExampleModelConstructor (
    stringToLiteralService,
    FeatureIndent
) {
    return class ExampleModel {
        constructor (_scenario) {
            this[scenario] = _scenario;
            this[values] = {};
        }

        get scenario () {
            return this[scenario];
        }

        get values () {
            this.scenario.exampleVariables.forEach(exampleVariable => {
                this[values][exampleVariable] = this[values][exampleVariable] || {
                    value: ''
                };
            });
            return this[values];
        }

        get feature () {
            return toFeature.call(this);
        }
    }

    function toFeature () {
        let values = this.scenario.exampleVariables.map(variable => {
            let value = this.values[variable].value;
            let literal = stringToLiteralService.toLiteral(value);
            return angular.isUndefined(literal) ? `"${value}"` : literal;
        }).join(' | ');
        return `${FeatureIndent}${FeatureIndent}${FeatureIndent}| ${values} |`;
    }
}

export default angular.module('tractor.exampleModel', [
    StringToLiteralService.name
])
.factory('ExampleModel', createExampleModelConstructor);
