'use strict';

// Utilities:
import assert from 'assert';

// Dependencies:
import angular from 'angular';
import FilterModel from '../Models/FilterModel';

class FilterParserService {
    constructor (
        FilterModel
    ) {
        this.FilterModel = FilterModel;
    }

    parse (element, ast) {
        try {
            let filter = new this.FilterModel(element);

            let parsers = [parseFilter, parseCSSContainingTextFilter, parseOptionsRepeaterIndexFilter, parseOptionsRepeaterTextFilter];
            tryParse(filter, ast, parsers);

            return filter;
        } catch (e) {
            console.warn('Invalid filter:', ast);
            return null;
        }
    }
}

function tryParse (filter, ast, parsers) {
    let parsed = parsers.some(parser => {
        try {
            return parser(filter, ast);
        } catch (e) {}
    });
    if (!parsed) {
        throw new Error();
    }
}

function parseFilter (filter, ast) {
    assert(ast.callee.property.name !== 'cssContainingText');
    let [locatorLiteral] = ast.arguments;
    filter.locator = locatorLiteral.value;
    filter.type = ast.callee.property.name;
    return true;
}

function parseCSSContainingTextFilter (filter, ast) {
    assert(ast.callee.property.name === 'cssContainingText');
    let [allSelectorLiteral] = ast.arguments;
    assert(allSelectorLiteral.value === '*');
    let locatorLiteral = ast.arguments[1];
    filter.locator = locatorLiteral.value;
    filter.type = 'text';
    return true;
}

function parseOptionsRepeaterIndexFilter (filter, ast) {
    assert(angular.isNumber(ast.value));
    filter.locator = String(ast.value);
    filter.type = 'text';
    return true;
}

function parseOptionsRepeaterTextFilter (filter, ast) {
    let [getTextThenReturnStatement] = ast.body.body;
    let [checkFoundTextFunctionExpression] = getTextThenReturnStatement.argument.arguments;
    let [checkFoundTextReturnStatement] = checkFoundTextFunctionExpression.body.body;
    let [locatorLiteral] = checkFoundTextReturnStatement.argument.left.arguments;
    filter.locator = locatorLiteral.value;
    filter.type = 'text';
    return true;
}

export default angular.module('tractor.filterParserService', [
    FilterModel.name
])
.service('filterParserService', FilterParserService);
