'use strict';

// Utilities:
import dedent from 'dedent';
import isNumber from 'lodash.isnumber';

// Dependencies:
import angular from 'angular';
import ASTCreatorService from '../../../Core/Services/ASTCreatorService';
import StringToLiteralService from '../../../Core/Services/StringToLiteralService';

function createFilterModelConstructor (
    astCreatorService,
    stringToLiteralService
) {
    const element = Symbol();

    return class FilterModel {
        constructor (_element) {
            this[element] = _element;

            this.locator = '';
            this.types = ['model', 'binding', 'text', 'css', 'options', 'repeater']
            let [type] = this.types
            this.type = type;
        }

        get element () {
            return this[element];
        }

        get isGroup () {
            return this.type === 'options' || this.type === 'repeater';
        }

        get isText () {
            return this.type === 'text';
        }

        get ast () {
            return toAST.call(this);
        }
    }

    function toAST () {
        if (this.isNested) {
            return toNestedAST.call(this);
        } else {
            return toSingleAST.call(this);
        }
    }

    function toNestedAST () {
        let locator = astCreatorService.literal(this.locator);

        let number = stringToLiteralService.toLiteral(locator.value);
        if (isNumber(number)) {
            return astCreatorService.literal(number);
        } else {
            let template = dedent(`
                (function (element) {
                    return element.getText().then(function (text) {
                        return text.indexOf(<%= locator %>) !== -1;
                    });
                });
            `);
            return astCreatorService.expression(template, { locator });
        }
    }

    function toSingleAST () {
        let locator = astCreatorService.literal(this.locator);
        let type = astCreatorService.identifier(this.type);

        let template = '';
        if (this.isText) {
            template += `by.cssContainingText('*', <%= locator %>)`;
            return astCreatorService.expression(template, { locator });
        } else {
            template += 'by.<%= type %>(<%= locator %>)';
            return astCreatorService.expression(template, { type, locator });
        }
    }
}

export default angular.module('filterModel', [
    ASTCreatorService.name,
    StringToLiteralService.name
])
.factory('FilterModel', createFilterModelConstructor);
