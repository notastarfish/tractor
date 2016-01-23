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
import './ExpectationParserService';
let expectationParserService;

describe('ExpectationParserService.js:', () => {
    let ExpectationModel;

    beforeEach(() => {
        angular.mock.module('tractor.expectationParserService');

        angular.mock.inject((
            _expectationParserService_,
            _ExpectationModel_
        ) => {
            expectationParserService = _expectationParserService_;
            ExpectationModel = _ExpectationModel_;
        });
    });

    describe('ExpectationParserService.parse', () => {
        it('should return an ExpectationModel:', () => {
            let step = {
                stepDefinition: {
                    componentInstances: [{
                        variableName: 'component',
                        component: {
                            actions: [{
                                variableName: 'action',
                                parameters: [{
                                    name: 'argument'
                                }]
                            }]
                        }
                    }]
                }
            };

            let ast = {
                arguments: [{
                    value: 'argument'
                }],
                callee: {
                    object: {
                        object: {
                            object: {
                                arguments: [{
                                    callee: {
                                        object: {
                                            name: 'component'
                                        },
                                        property: {
                                            name: 'action'
                                        }
                                    },
                                    arguments: []
                                }]
                            }
                        }
                    },
                    property: {
                        name: 'equal'
                    }
                }
            };

            let expectationModel = expectationParserService.parse(step, ast);

            expect(expectationModel).to.be.an.instanceof(ExpectationModel);
        });
    });
});
