/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';
import dedent from 'dedent';
import dirtyChai from 'dirty-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);

// Dependencies:
import escodegen from 'escodegen';

// Testing:
import './FilterModel';
let FilterModel;

describe('FilterModel.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.filterModel');

        angular.mock.inject((
            _FilterModel_
        ) => {
            FilterModel = _FilterModel_;
        });
    });

    describe('FilterModel constructor:', () => {
        it('should create a new `FilterModel`:', () => {
            let filterModel = new FilterModel();
            expect(filterModel).to.be.an.instanceof(FilterModel);
        });

        it('should have default properties:', () => {
            let element = {};
            let filterModel = new FilterModel(element);

            expect(filterModel.element).to.equal(element);
            expect(filterModel.type).to.equal('model');
            expect(filterModel.locator).to.equal('');
        });
    });

    describe('FilterModel.types:', () => {
        it('should contain all the possible types of Filter:', () => {
            let filterModel = new FilterModel();
            expect(filterModel.types).to.deep.equal(
                ['model', 'binding', 'text', 'css', 'options', 'repeater']
            );
        });
    });

    describe('FilterModel.isGroup:', () => {
        it('should return true if `type` is \'options\':', () => {
            let filterModel = new FilterModel();
            filterModel.type = 'options';

            expect(filterModel.isGroup).to.be.true();
        });

        it('should return true if `type` is \'repeater\':', () => {
            let filterModel = new FilterModel();
            filterModel.type = 'repeater';

            expect(filterModel.isGroup).to.be.true();
        });

        it('should return false otherwise:', () => {
            let filterModel = new FilterModel();

            expect(filterModel.isGroup).to.be.false();
        });
    });

    describe('FilterModel.isText:', () => {
        it('should return true if `type` is "text":', () => {
            let filterModel = new FilterModel();
            filterModel.type = 'text';

            expect(filterModel.isText).to.be.true();
        });

        it('should return false otherwise:', () => {
            let filterModel = new FilterModel();

            expect(filterModel.isText).to.be.false();
        });
    });

    describe('FilterModel.ast:', () => {
        it('should return the AST for a Filter where `isNested` and `isText` are both false:', () => {
            let filterModel = new FilterModel();
            filterModel.locator = 'model.property';
            let ast = filterModel.ast;

            expect(escodegen.generate(ast)).to.equal(`by.model('model.property')`);
        });

        it('should return the AST for a Filter where `isNested` is `false` and `isText` is true:', () => {
            let filterModel = new FilterModel();
            filterModel.type = 'text';
            filterModel.locator = 'text locator';
            let ast = filterModel.ast;

            expect(escodegen.generate(ast)).to.equal(`by.cssContainingText('*', 'text locator')`);
        });

        it('should return the AST for a Filter where `isNested` is `true` and the value is a number:', () => {
            let filterModel = new FilterModel();
            filterModel.type = 'text';
            filterModel.isNested = true;
            filterModel.locator = '0';
            let ast = filterModel.ast;

            expect(escodegen.generate(ast)).to.equal('0');
        });

        it('should return the AST for a Filter where `isNested` is `true` and the value is text:', () => {
            let filterModel = new FilterModel();
            filterModel.type = 'text';
            filterModel.isNested = true;
            filterModel.locator = 'text locator';
            let ast = filterModel.ast;

            expect(escodegen.generate(ast)).to.equal(dedent(`
                function (element) {
                    return element.getText().then(function (text) {
                        return text.indexOf('text locator') !== -1;
                    });
                }
            `));
        });
    });
});
