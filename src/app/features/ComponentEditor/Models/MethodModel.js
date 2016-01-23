'use strict';

// Dependencies:
import angular from 'angular';
import ArgumentModel from './ArgumentModel';

// Symbols:
const interaction = Symbol();
const method = Symbol();

function createMethodModelConstructor (
    ArgumentModel
) {
    return class MethodModel {
        constructor (_interaction, _method) {
            this[interaction] = _interaction;
            this[method] = _method;

            this.arguments = getArguments.call(this);

            if (this.returns) {
                this[this.returns] = this.method[this.returns];
            }
        }

        get interaction () {
            return this[interaction];
        }

        get method () {
            return this[method];
        }

        get name () {
            return this.method.name;
        }

        get description () {
            return this.method.description;
        }

        get returns () {
            return this.method.returns;
        }
    }

    function getArguments () {
        if (this.method.arguments) {
            return this.method.arguments.map(argument => new ArgumentModel(this, argument));
        } else {
            return [];
        }
    }
}

export default angular.module('tractor.methodModel', [
    ArgumentModel.name
])
.factory('MethodModel', createMethodModelConstructor);
