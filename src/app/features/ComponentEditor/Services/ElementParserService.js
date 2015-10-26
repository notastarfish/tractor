'use strict';

// Utilities:
import assert from 'assert';

// Dependencies:
import angular from 'angular';
import ElementModel from '../Models/ElementModel';
import FilterParserService from '../Services/FilterParserService';

class ElementParserService {
    constructor (
        ElementModel,
        filterParserService
    ) {
        this.ElementModel = ElementModel;
        this.filterParserService = filterParserService;
    }

    parse (component, astObject, element) {
        if (!element) {
            element = new this.ElementModel(component);
        }

        let elementCallExpression = astObject.expression.right;
        let elementCallExpressionCallee = elementCallExpression.callee;

        try {
            assert(elementCallExpressionCallee.object.callee);
            try {
                assert(elementCallExpressionCallee.object.callee.property.name === 'filter');
                elementCallExpressionCallee = elementCallExpressionCallee.object.callee;
                elementCallExpression = elementCallExpression.callee.object;
            } catch (e) {}

            this.parse(component, {
                expression: {
                    right: elementCallExpressionCallee.object
                }
            }, element);
        } catch (e) {}

        let notFirstElementBy = false;
        let notFirstElementAllBy = false;
        let notElementBy = false;
        let notElementAllBy = false;
        let notElementFilter = false;
        let notElementGet = false;

        try {
            assert(elementCallExpressionCallee.name === 'element');
            let [filterAST] = elementCallExpression.arguments;
            let filter = this.filterParserService.parse(element, filterAST);
            element.addFilter(filter);
        } catch (e) {
            notFirstElementBy = true;
        }

        try {
            if (notFirstElementBy) {
                assert(elementCallExpressionCallee.object.name === 'element');
                assert(elementCallExpressionCallee.property.name === 'all');
                let [filterAllAST] = elementCallExpression.arguments;
                let filter = this.filterParserService.parse(element, filterAllAST);
                element.addFilter(filter);
            }
        } catch (e) {
            notFirstElementAllBy = true;
        }

        try {
            if (notFirstElementAllBy) {
                assert(elementCallExpressionCallee.property.name === 'element');
                let [filterAST] = elementCallExpression.arguments;
                let filter = this.ilterParserService.parse(element, filterAST);
                element.addFilter(filter);
            }
        } catch (e) {
            notElementBy = true;
        }

        try {
            if (notElementBy) {
                assert(elementCallExpressionCallee.property.name === 'all');
                let [filterAllAST] = elementCallExpression.arguments;
                let filter = this.filterParserService.parse(element, filterAllAST);
                element.addFilter(filter);
            }
        } catch (e) {
            notElementAllBy = true;
        }

        try {
            if (notElementAllBy) {
                assert(elementCallExpressionCallee.property.name === 'filter');
                let [filterAST] = elementCallExpression.arguments;
                let filter = this.filterParserService.parse(element, filterAST);
                element.addFilter(filter);
            }
        } catch (e) {
            notElementFilter = true;
        }

        try {
            if (notElementFilter) {
                assert(elementCallExpressionCallee.property.name === 'get');
                let [filterAST] = elementCallExpression.arguments;
                let filter = this.filterParserService.parse(element, filterAST);
                element.addFilter(filter);
            }
        } catch (e) {
            notElementGet = true;
        }

        if (notFirstElementBy && notFirstElementAllBy && notElementBy && notElementAllBy && notElementFilter && notElementGet) {
            console.log(astObject);
        }

        return element;
    }
}

export default angular.module('elementParserService', [
    ElementModel.name,
    FilterParserService.name
])
.service('elementParserService', ElementParserService);
