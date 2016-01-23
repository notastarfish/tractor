/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';

// Test setup:
const expect = chai.expect;

// Dependencies:
import escodegen from 'escodegen';

// Testing:
import './ParameterModel';
let ParameterModel;

describe('ParameterModel.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.parameterModel');

        angular.mock.inject((
            _ParameterModel_
        ) => {
            ParameterModel = _ParameterModel_;
        });
    });

    describe('ParameterModel constructor:', () => {
        it('should create a new `ParameterModel`:', () => {
            let parameterModel = new ParameterModel();
            expect(parameterModel).to.be.an.instanceof(ParameterModel);
        });

        it('should have default properties:', () => {
            let action = {};

            let parameterModel = new ParameterModel(action);

            expect(parameterModel.action).to.equal(action);
            expect(parameterModel.name).to.equal('');
            expect(parameterModel.meta).to.deep.equal({
                name: ''
            });
        });
    });

    describe('ParameterModel.variableName:', () => {
        it('should turn the full name of the Parameter into a JS variable:', () => {
            let parameterModel = new ParameterModel();

            parameterModel.name = 'A long name that describes the parameter.';
            expect(parameterModel.variableName).to.equal('aLongNameThatDescribesTheParameter');
        });
    });

    describe('ParameterModel.meta:', () => {
        it('should contain the full name of the Parameter:', () => {
            let parameterModel = new ParameterModel();

            parameterModel.name = 'A long name that describes the parameter.';
            expect(parameterModel.meta.name).to.equal('A long name that describes the parameter.');
        });
    });

    describe('ParameterModel.ast:', () => {
        it('should be the AST of the Parameter:', () => {
            let parameterModel = new ParameterModel();
            parameterModel.name = 'Parameter';
            let ast = parameterModel.ast;

            expect(escodegen.generate(ast)).to.equal('parameter');
        });
    });

    describe('ParameterModel.getAllVariableNames:', () => {
        it('should return the names of all the other Parameters assosciated with an Action:', () => {
            let action = {
                parameters: [{
                    name: 'parameter1'
                }, {
                    name: 'parameter2'
                }]
            };
            let parameterModel = new ParameterModel(action);
            expect(parameterModel.getAllVariableNames()).to.deep.equal(['parameter1', 'parameter2']);
        });
    });
});
