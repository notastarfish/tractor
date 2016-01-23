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
import './ValidationService';
let validationService;

describe('ValidationService.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.validationService');

        angular.mock.inject(_validationService_ => {
            validationService = _validationService_;
        });
    });

    describe('ValidationService.validateVariableName:', () => {
        it('should return the variable name if it valid', () => {
            let variableName = validationService.validateVariableName('variable')

            expect(variableName).to.equal('variable');
        });

        it('should return false if a variable name is not valid', () => {
            let variableName = validationService.validateVariableName('1')

            expect(variableName).to.equal(false);
        });
    });
});
