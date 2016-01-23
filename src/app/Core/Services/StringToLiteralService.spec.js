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
import './StringToLiteralService';
let stringToLiteralService;

describe('StringToLiteralService.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.stringToLiteralService');

        angular.mock.inject(_stringToLiteralService_ => {
            stringToLiteralService = _stringToLiteralService_;
        });
    });

    describe('StringToLiteralService.toLiteral:', () => {
        it('should turn string values into their JavaScript literal equivalents:', () => {
            let tests = [{
                string: 'true',
                literal: true
            }, {
                string: 'false',
                literal: false
            }, {
                string: '-0.33',
                literal: -0.33
            }, {
                string: 'Infinity',
                literal: Infinity
            }, {
                string: 'NaN',
                literal: NaN
            }, {
                string: 'null',
                literal: null
            }, {
                string: 'just a string',
                literal: 'just a string'
            }];

            tests.forEach(test => {
                expect(stringToLiteralService.toLiteral(test.string)).to.deep.equal(test.literal);
            });
        });
    });
});
