'use strict';

// Utilities:
import isUndefined from 'lodash.isundefined';

// Dependencies:
import angular from 'angular';
import ASTCreatorService from '../../../Core/Services/ASTCreatorService';
import StringToLiteralService from '../../../Core/Services/StringToLiteralService';

function createArgumentModelConstructor (
    astCreatorService,
    stringToLiteralService
) {
    const argument = Symbol();
    const method = Symbol();

    return class ArgumentModel {
        constructor (_method, _argument) {
            this[argument] = _argument;
            this[method] = _method;

            this.value = '';
        }

        get method () {
            return this[method] || null;
        }

        get name () {
            return this[argument] ? this[argument].name : false;
        }

        get description () {
            return this[argument] ? this[argument].description : false;
        }

        get type () {
            return this[argument] ? this[argument].type : false;
        }

        get required () {
            return this[argument] ? this[argument].required : false;
        }

        get ast () {
            return toAST.call(this);
        }
    }

    function toAST () {
        let literal = stringToLiteralService.toLiteral(this.value);
        let parameter = findParameter.call(this);
        let result = findResult.call(this);

        if (!isUndefined(literal) && literal !== this.value) {
            return astCreatorService.literal(literal);
        } else if (parameter) {
            return astCreatorService.identifier(parameter.variableName);
        } else if (result) {
            return astCreatorService.identifier(this.value);
        } else if (this.value) {
            return astCreatorService.literal(this.value);
        } else {
            return astCreatorService.literal(null);
        }
    }

    function findParameter () {
        return this.method && this.method.interaction.action.parameters.find(parameter => {
            return parameter.name === this.value;
        });
    }

    function findResult () {
        return this.method && this.method.interaction.action.interactions.find(interaction => {
            let returns = interaction.method[interaction.method.returns];
            return returns ? returns.name === this.value : false;
        });
    }
}

export default angular.module('argumentModel', [
    ASTCreatorService.name,
    StringToLiteralService.name
])
.factory('ArgumentModel', createArgumentModelConstructor);
