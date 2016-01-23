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
import './FilterParserService';
let filterParserService;

describe('FilterParserService.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.filterParserService');

        angular.mock.inject((
            _filterParserService_
        ) => {
            filterParserService = _filterParserService_;
        });
    });

    describe('FilterParserService.parse', () => {
        it('should return a `FilterModel`', () => {
            let element = {};
            let ast = {
                arguments: [{
                    value: 'locator'
                }],
                callee: {
                    property: {
                        name: 'model'
                    }
                }
            };

            let filter = filterParserService.parse(element, ast);

            expect(filter.element).to.equal(element);
        });

        it('should attempt to parse a basic filter', () => {
            ['model', 'binding', 'text', 'css', 'options', 'repeater'].forEach((type) => {
                let element = {};
                let ast = {
                    arguments: [{
                        value: 'locator'
                    }],
                    callee: {
                        property: {
                            name: type
                        }
                    }
                };

                let filter = filterParserService.parse(element, ast);

                expect(filter.type).to.equal(type);
                expect(filter.locator).to.equal('locator');
            });
        });

        it('should attempt to parse a CSSContaingText filter', () => {
            let element = {};
            let ast = {
                arguments: [{
                    value: '*'
                }, {
                    value: 'locator'
                }],
                callee: {
                    property: {
                        name: 'cssContainingText'
                    }
                }
            };

            let filter = filterParserService.parse(element, ast);

            expect(filter.type).to.equal('text');
            expect(filter.locator).to.equal('locator');
        });

        it('should attempt to parse a repeater/options index filter', () => {
            let element = {};
            let ast = {
                value: 0
            };

            let filter = filterParserService.parse(element, ast);

            expect(filter.type).to.equal('text');
            expect(filter.locator).to.equal('0');
        });

        it('should attempt to parse a repeater/options text filter', () => {
            let element = {};
            let ast = {
                body: {
                    body: [{
                        argument: {
                            arguments: [{
                                body: {
                                    body: [{
                                        argument: {
                                            left: {
                                                arguments: [{
                                                    value: 'locator'
                                                }]
                                            }
                                        }
                                    }]
                                }
                            }]
                        }
                    }]
                }
            };

            let filter = filterParserService.parse(element, ast);

            expect(filter.type).to.equal('text');
            expect(filter.locator).to.equal('locator');
        });

        it('should bail out and return `null` when it cannot parse', () => {
            let element = {};
            let ast = {};

            sinon.stub(console, 'warn');
            let filter = filterParserService.parse(element, ast);

            expect(filter).to.equal(null);

            console.warn.restore();
        });
    });
});
