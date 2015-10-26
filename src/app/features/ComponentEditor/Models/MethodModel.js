'use strict';

// Dependencies:
import angular from 'angular';
import ArgumentModel from './ArgumentModel';

function createMethodModelConstructor (
    ArgumentModel
) {
    const interaction = Symbol();
    const method = Symbol();

    return class MethodModel {
        constructor (_interaction, _method) {
            this[interaction] = _interaction;
            this[method] = _method;

            this.arguments = getArguments.call(this, method);

            if (this.returns) {
                this[this.returns] = this[method][this.returns];
            }
        }

        get interaction () {
            return this[interaction];
        }

        get name () {
            return this[method].name;
        }

        get description () {
            return this[method].description;
        }

        get returns () {
            return this[method].returns;
        }
    }

    function getArguments (method) {
        return method.arguments.map(argument => new ArgumentModel(this, argument));
    }
}

export default angular.module('methodModel', [
    ArgumentModel.name
])
.factory('MethodModel', createMethodModelConstructor);
