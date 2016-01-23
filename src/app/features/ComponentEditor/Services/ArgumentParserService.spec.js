/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Testing:
import './ArgumentParserService';
let argumentParserService;

describe('ArgumentParserService.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.actionParserService');

        angular.mock.inject((
            _argumentParserService_
        ) => {
            argumentParserService = _argumentParserService_;
        });
    });

    describe('ArgumentParserService.parse:', () => {
        it('should parse the `ast` into an `ArgumentModel` based on a `name`', () => {
            let argument = {};
            let ast = {
                name: 'argument'
            };
            let method = {};

            let argumentModel = argumentParserService.parse(method, argument, ast);

            expect(argumentModel.value).to.equal('argument');
        });

        it('should parse the `ast` into an `ArgumentModel` based on a `value`', () => {
            let argument = {};
            let ast = {
                value: 'argument'
            };
            let method = {};

            let argumentModel = argumentParserService.parse(method, argument, ast);

            expect(argumentModel.value).to.equal('argument');
        });

        it('should bail out and return `null` when it cannot parse', () => {
            let argument = {};
            let ast = {};
            let method = {};

            sinon.stub(console, 'warn');

            let argumentModel = argumentParserService.parse(method, argument, ast);

            expect(argumentModel).to.equal(null);

            console.warn.restore();
        });
    });
});
