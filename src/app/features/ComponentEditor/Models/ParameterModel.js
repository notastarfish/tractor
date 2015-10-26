'use strict';

// Utilities:
import changecase from 'change-case';

// Dependencies:
import angular from 'angular';
import ASTCreatorService from '../../../Core/Services/ASTCreatorService';

function createParameterModelConstructor (
    astCreatorService
) {
    const action = Symbol();

    return class ParameterModel {
        constructor (_action) {
            this[action] = _action;

            this.name = '';
        }

        get action () {
            return this[action];
        }

        get variableName () {
            return changecase.camel(this.name);
        }

        get meta () {
            return {
                name: this.name
            };
        }

        get ast () {
            return toAST.call(this);
        }

        getAllVariableNames () {
            let currentParameter = this;
            return this.action.parameters
            .filter((parameter) => parameter !== currentParameter)
            .map((object) => object.name);
        }
    }

    function toAST () {
        return astCreatorService.identifier(this.variableName);
    }
}

export default angular.module('parameterModel', [
    ASTCreatorService.name
])
.factory('ParameterModel', createParameterModelConstructor);
