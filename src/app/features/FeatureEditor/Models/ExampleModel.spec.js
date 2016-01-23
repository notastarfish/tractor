/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';
import sinon from 'sinon';

// Test setup:
const expect = chai.expect;

// Testing:
import './ExampleModel';
let ExampleModel;

describe('ExampleModel.js:', () => {
    let stringToLiteralService;

    beforeEach(() => {
        angular.mock.module('tractor.exampleModel');

        angular.mock.module($provide => {
            $provide.factory('stringToLiteralService', () => {
                stringToLiteralService = {};
                return stringToLiteralService;
            });
            $provide.factory('FeatureIndent', () => {
                return '  ';
            });
        });

        angular.mock.inject((
            _ExampleModel_
        ) => {
            ExampleModel = _ExampleModel_;
        });
    });

    describe('ExampleModel constructor:', () => {
        it('should return an `ExampleModel`', () => {
            let scenario = {};

            let exampleModel = new ExampleModel(scenario);

            expect(exampleModel).to.be.an.instanceof(ExampleModel);
        });

        it('should have a `scenario`', () => {
            let scenario = {};

            let exampleModel = new ExampleModel(scenario);

            expect(exampleModel.scenario).to.equal(scenario);
        });
    });

    describe('ExampleModel.values:', () => {
        it('should contain a `value` for each variable in the example', () => {
            let scenario = {
                exampleVariables: ['variable 1', 'variable 2', 'variable 3']
            };

            let exampleModel = new ExampleModel(scenario);

            expect(exampleModel.values).to.deep.equal({
                'variable 1': {
                    value: ''
                },
                'variable 2': {
                    value: ''
                },
                'variable 3': {
                    value: ''
                }
            });
        });

        it('should not overwrite existing values:', () => {
            let scenario = {
                exampleVariables: ['variable 1', 'variable 2', 'variable 3']
            };

            let exampleModel = new ExampleModel(scenario);

            exampleModel.values['variable 1'].value = 'value';

            expect(exampleModel.values).to.deep.equal({
                'variable 1': {
                    value: 'value'
                },
                'variable 2': {
                    value: ''
                },
                'variable 3': {
                    value: ''
                }
            });
        });
    });

    describe('ExampleModel.feature:', () => {
        it('should format the example values', () => {
            let scenario = {
                exampleVariables: ['variable 1', 'variable 2', 'variable 3']
            };

            stringToLiteralService.toLiteral = angular.noop;
            sinon.stub(stringToLiteralService, 'toLiteral');

            let exampleModel = new ExampleModel(scenario);

            exampleModel.values['variable 1'].value = 'value 1';
            exampleModel.values['variable 2'].value = 'value 2';
            exampleModel.values['variable 3'].value = 'value 3';

            expect(exampleModel.feature).to.equal('      | "value 1" | "value 2" | "value 3" |');
        });

        it('should should handle non-string values', () => {
            let scenario = {
                exampleVariables: ['variable 1']
            };

            stringToLiteralService.toLiteral = angular.noop;
            sinon.stub(stringToLiteralService, 'toLiteral').returns(true);

            let exampleModel = new ExampleModel(scenario);

            exampleModel.values['variable 1'].value = 'true';

            expect(exampleModel.feature).to.equal('      | true |');
        });
    });
});
