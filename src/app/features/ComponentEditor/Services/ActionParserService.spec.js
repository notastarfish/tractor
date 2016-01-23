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
import './ActionParserService';
let actionParserService;

describe('ActionParserService.js:', () => {
    let interactionParserService;
    let parameterParserService;

    beforeEach(() => {
        angular.mock.module('tractor.actionParserService');

        angular.mock.module($provide => {
            $provide.factory('interactionParserService', () => {
                interactionParserService = {};
                return interactionParserService;
            });
            $provide.factory('parameterParserService', () => {
                parameterParserService = {};
                return parameterParserService;
            });
        });

        angular.mock.inject((
            _actionParserService_
        ) => {
            actionParserService = _actionParserService_;
        });
    });

    describe('ActionParserService.parse:', () => {
        it('should parse each of the Action\'s `params` into a `ParameterModel`', () => {
            let parameter1 = {};
            let parameter2 = {};
            let ast = {
                expression: {
                    right: {
                        body: {
                            body: []
                        },
                        params: [parameter1, parameter2]
                    }
                }
            };
            let component = {};
            let meta = {
                parameters: [{
                    name: 'param1'
                }, {
                    name: 'param2'
                }]
            };

            parameterParserService.parse = angular.noop;
            sinon.stub(parameterParserService, 'parse')
            .onCall(0).returns({})
            .onCall(1).returns({});

            let actionModel = actionParserService.parse(component, ast, meta);
            let [parameterModel1, parameterModel2] = actionModel.parameters;

            expect(parameterParserService.parse).to.have.been.calledTwice();
            expect(parameterParserService.parse).to.have.been.calledWith(actionModel);
            expect(parameterParserService.parse).to.have.been.calledWith(actionModel);
            expect(actionModel.parameters.length).to.equal(2);
            expect(parameterModel1.name).to.equal('param1');
            expect(parameterModel2.name).to.equal('param2');
        });

        it('should attempt to parse each `statement` as `var self = this;`', () => {
            let ast = {
                expression: {
                    right: {
                        body: {
                            body: [{
                                declarations: [{
                                    id: {
                                        name: 'self'
                                    },
                                    init: {
                                        type: 'ThisExpression'
                                    }
                                }]
                            }]
                        },
                        params: []
                    }
                }
            };
            let component = {};
            let meta = {};

            interactionParserService.parse = angular.noop;
            sinon.stub(interactionParserService, 'parse');

            actionParserService.parse(component, ast, meta);

            expect(interactionParserService.parse).to.not.have.been.called();
        });

        it('should attempt to parse each `statement` into an `InteractionModel`', () => {
            let statement1 = {};
            let statement2 = {};
            let ast = {
                expression: {
                    right: {
                        body: {
                            body: [statement1, statement2]
                        },
                        params: []
                    }
                }
            };
            let component = {};
            let meta = {};

            interactionParserService.parse = angular.noop;
            sinon.stub(interactionParserService, 'parse');

            let actionModel = actionParserService.parse(component, ast, meta);

            expect(interactionParserService.parse).to.have.been.calledWith(actionModel, statement1);
            expect(interactionParserService.parse).to.have.been.calledWith(actionModel, statement2);
        });

        it('should bail out and return `null` when it cannot parse', () => {
            let ast = {
                expression: {
                    right: {
                        body: {
                            body: [{}]
                        },
                        params: []
                    }
                }
            };
            let component = {};
            let meta = {};

            sinon.stub(console, 'warn');
            interactionParserService.parse = angular.noop;
            sinon.stub(interactionParserService, 'parse').throws();

            let actionModel = actionParserService.parse(component, ast, meta);
            expect(console.warn).to.have.been.calledWith('Invalid action:');

            expect(actionModel).to.equal(null);

            console.warn.restore();
        });
    });
});
