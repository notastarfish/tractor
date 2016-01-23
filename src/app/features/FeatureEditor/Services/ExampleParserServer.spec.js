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
import './ExampleParserService';
let exampleParserService;

describe('ExampleParserService.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.exampleParserService');

        angular.mock.module($provide => {
            $provide.factory('FeatureIndent', () => {
                return '  ';
            });
        });

        angular.mock.inject((_exampleParserService_) => {
            exampleParserService = _exampleParserService_;
        });
    });

    describe('ExampleParserService.parse:', () => {
        it('should parse all the variables in an example', () => {
            let scenario = {
                exampleVariables: ['variable 1', 'variable 2']
            };
            let tokens = ['value 1', 'value 2'];

            let example = exampleParserService.parse(scenario, tokens);

            expect(example.values['variable 1']).to.equal('value 1');
            expect(example.values['variable 2']).to.equal('value 2');
        });

        it(`should get rid of any '"' characters in values`, () => {
            let scenario = {
                exampleVariables: ['variable 1']
            };
            let tokens = ['"string 1"'];

            let example = exampleParserService.parse(scenario, tokens);

            expect(example.values['variable 1']).to.equal('string 1');
        });

        it('should bail out and return `null` when it cannot parse', () => {
            let scenario = {
                exampleVariables: ['variable 1']
            };
            let tokens = [];

            sinon.stub(console, 'warn');

            let example = exampleParserService.parse(scenario, tokens);
            expect(example).to.equal(null);

            console.warn.restore();
        });
    });
});
