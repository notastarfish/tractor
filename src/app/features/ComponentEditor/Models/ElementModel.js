'use strict';

// Utilities:
import changecase from 'change-case';
import isNumber from 'lodash.isnumber';

// Dependencies:
import angular from 'angular';
import ASTCreatorService from '../../../Core/Services/ASTCreatorService';
import ElementMethods from './ElementMethods';
import FilterModel from './FilterModel';
import StringToLiteralService from '../../../Core/Services/StringToLiteralService';

function createElementModelConstructor (
    astCreatorService,
    FilterModel,
    stringToLiteralService
) {
    const component = Symbol();

    return class ElementModel {
        constructor (_component) {
            this[component] = _component;

            this.name = '';
            this.filters = [];
            this.methods = [
                ElementMethods.CLICK,
                ElementMethods.SEND_KEYS,
                ElementMethods.GET_TEXT,
                ElementMethods.IS_ENABLED,
                ElementMethods.IS_SELECTED,
                ElementMethods.SUBMIT,
                ElementMethods.CLEAR,
                ElementMethods.IS_DISPLAYED,
                ElementMethods.GET_OUTER_HTML,
                ElementMethods.GET_INNER_HTML
            ]
            this.sortableFilters = [];
        }

        get component () {
            return this[component];
        }

        get selector () {
            let [filter] = this.filters;
            return filter;
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

        addFilter (filter = new FilterModel(this)) {
            this.filters.push(filter);
            if (this.filters.length > 1) {
                this.sortableFilters.push(filter);
            }
        }

        removeFilter (toRemove) {
            this.filters.splice(this.filters.findIndex(filter => {
                return filter === toRemove;
            }), 1);
            this.sortableFilters.splice(this.sortableFilters.findIndex(sortableFilter => {
                return sortableFilter === toRemove;
            }), 1);
        }

        getAllVariableNames () {
            return this.component.getAllVariableNames(this);
        }
    };

    function toAST () {
        let element = astCreatorService.identifier(this.variableName);
        let filters = filtersAST.call(this);

        let template = 'this.<%= element %> = <%= filters %>;';

        return astCreatorService.expression(template, { element, filters });
    }

    function filtersAST () {
        let template = '';
        let fragments = {};
        this.filters.reduce((previousFilter, filter, index) => {
            let filterTemplate = `<%= filter${index} %>`;
            if (template.length) {
                template += filterAfterFilterAST(previousFilter, filter, filterTemplate);
            } else {
                template += filterAST(filter, filterTemplate);
            }

            fragments[`filter${index}`] = filter.ast;

            return filter;
        }, {});

        return astCreatorService.expression(template, fragments);
    }

    function filterAST (filter, filterTemplate) {
        if (filter.isGroup) {
            return `element.all(${filterTemplate})`;
        } else {
            return `element(${filterTemplate})`;
        }
    }

    function filterAfterFilterAST (previousFilter, filter, filterTemplate) {
        if (previousFilter.isGroup) {
            filter.isNested = true;
            return filterAfterGroupFilter(filter, filterTemplate);
        } else {
            return filterAfterSingleFilter(filter, filterTemplate);
        }
    }

    function filterAfterGroupFilter (filter, filterTemplate) {
        let locatorLiteral = stringToLiteralService.toLiteral(filter.locator);
        if (isNumber(locatorLiteral)) {
            return `.get(${filterTemplate})`;
        } else {
            return `.filter(${filterTemplate}).get(0)`;
        }
    }

    function filterAfterSingleFilter (filter, filterTemplate) {
        if (filter.isGroup) {
            return `.all(${filterTemplate})`;
        } else {
            return `.element(${filterTemplate})`;
        }
    }
}

export default angular.module('elementModel', [
    ASTCreatorService.name,
    FilterModel.name,
    StringToLiteralService.name
])
.factory('ElementModel', createElementModelConstructor);
