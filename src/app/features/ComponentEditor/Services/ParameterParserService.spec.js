/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';

// Test setup:
const expect = chai.expect;

// Testing:
import './ParameterParserService';
let parameterParserService;

describe('ParameterParserService.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.parameterParserService');

        angular.mock.inject((
            _parameterParserService_
        ) => {
            parameterParserService = _parameterParserService_;
        });
    });

    describe('ParameterParserService.parse', () => {
        it('should return a `ParameterModel`', () => {
            let action = {};

            let parameter = parameterParserService.parse(action);

            expect(parameter.action).to.equal(action);
        });
    });
});
