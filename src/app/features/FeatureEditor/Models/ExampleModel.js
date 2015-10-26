'use strict';

// Utilities:
import isUndefined from 'lodash.isundefined';

// Dependencies:
import angular from 'angular';
import StringToLiteralService from '../../../Core/Services/StringToLiteralService';

function createExampleModelConstructor (
    stringToLiteralService,
    FeatureIndent
) {
    const scenario = Symbol();

    return class ExampleModel {
        constructor (_scenario) {
            this[scenario] = _scenario;
        }

        get scenario () {
            return this[scenario];
        }

        get values () {
            let values = {};
            this.scenario.exampleVariables.forEach(exampleVariable => {
                values[exampleVariable] = values[exampleVariable] || {
                    value: ''
                };
            });
            return values;
        }

        get feature () {
            return toFeature.call(this);
        }
    }

    function toFeature () {
        let values = this.scenario.exampleVariables.map(variable => {
            let value = this.values[variable].value;
            let literal = stringToLiteralService.toLiteral(value);
            return isUndefined(literal) ? `"${value}"` : literal;
        }).join(' | ');
        return `${FeatureIndent}${FeatureIndent}${FeatureIndent}| ${values} |`;
    }
}

export default angular.module('exampleModel', [
    StringToLiteralService.name
])
.factory('ExampleModel', createExampleModelConstructor);
