'use strict';

// Utilities:
import assert from 'assert';
import isNumber from 'lodash.isnumber';

// Dependencies:
import angular from 'angular';
import FilterModel from '../Models/FilterModel';

class FilterParserService {
    constructor (
        FilterModel
    ) {
        this.FilterModel = FilterModel;
    }

    parse (element, astObject) {
        let filter = new this.FilterModel(element);

        let notModelBindingCSSOptionsRepeater = false;
        let notText = false;
        let notAllIndex = false;
        let notAllString = false;

        try {
            assert(astObject.callee.property.name !== 'cssContainingText');
            let [locatorLiteral] = astObject.arguments;
            filter.locator = locatorLiteral.value;
            filter.type = astObject.callee.property.name;
        } catch (e) {
            notModelBindingCSSOptionsRepeater = true;
        }

        try {
            if (notModelBindingCSSOptionsRepeater) {
                assert(astObject.callee.property.name === 'cssContainingText');
                let [allSelectorLiteral] = astObject.arguments;
                assert(allSelectorLiteral.value === '*');
                let locatorLiteral = astObject.arguments[1];
                filter.locator = locatorLiteral.value;
                filter.type = 'text';
            }
        } catch (e) {
            notText = true;
        }

        try {
            if (notText) {
                assert(isNumber(astObject.value));
                filter.locator = String(astObject.value);
                filter.type = 'text';
            }
        } catch (e) {
            notAllIndex = true;
        }

        try {
            if (notAllIndex) {
                let [getTextThenReturnStatement] = astObject.body.body;
                let [checkFoundTextFunctionExpression] = getTextThenReturnStatement.argument.arguments;
                let [checkFoundTextReturnStatement] = checkFoundTextFunctionExpression.body.body;
                let [locatorLiteral] = checkFoundTextReturnStatement.argument.left.arguments;
                filter.locator = locatorLiteral.value;
                filter.type = 'text';
            }
        } catch (e) {
            notAllString = true;
        }

        if (notModelBindingCSSOptionsRepeater && notText && notAllIndex && notAllString) {
            console.log(astObject);
        }

        return filter;
    }
}

export default angular.module('filterParserService', [
    FilterModel.name
])
.service('filterParserService', FilterParserService);
