'use strict';

// Utilities:
import isRegExp from 'lodash.isregexp';

// Dependencies:
import angular from 'angular';
import estemplate from 'estemplate';

class ASTCreatorService {
    file (expression, meta) {
        return program([this.expressionStatement(expression)], [blockComment(meta)]);
    }

    expression (template, objects = {}) {
        let [ast] = estemplate(template, objects).body;
        return ast ? ast.expression || ast.value || ast : null;
    }

    template (template, objects = {}) {
        let [statement] = estemplate(template, objects).body;
        return statement;
    }

    expressionStatement (expression) {
        return {
            type: 'ExpressionStatement',
            expression
        };
    }

    identifier (name) {
        return {
            type: 'Identifier',
            name
        };
    }

    literal (value) {
        let literal = {
            type: 'Literal',
            value
        };
        if (isRegExp(value)) {
            literal.raw = `${value}`;
        }
        return literal;
    }
}

function program (body = [], comments = []) {
    return {
        type: 'Program',
        body,
        comments
    };
}

function blockComment (value) {
    return {
        type: 'Block',
        value
    };
}

export default angular.module('astCreatorService', [])
.service('astCreatorService', ASTCreatorService);
