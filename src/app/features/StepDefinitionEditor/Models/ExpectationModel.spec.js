/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';
import dedent from 'dedent';

// Test setup:
const expect = chai.expect;

// Dependencies:
import escodegen from 'escodegen';

// Testing:
import './ExpectationModel';
let ExpectationModel;

describe('ExpectationModel.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.expectationModel');

        angular.mock.inject((
            _ExpectationModel_
        ) => {
            ExpectationModel = _ExpectationModel_;
        });
    });

    describe('ExpectationModel constructor:', () => {
        it('should create a new `ExpectationModel`', () => {
            let action = {
                parameters: []
            };
            let component = {
                component: {
                    actions: [action]
                }
            };
            let step = {
                stepDefinition: {
                    componentInstances: [component]
                }
            };

            let expectationModel = new ExpectationModel(step);

            expect(expectationModel).to.be.an.instanceof(ExpectationModel);
        });
    });

    describe('ExpectationModel.step:', () => {
        it('should have a `step`', () => {
            let action = {
                parameters: []
            };
            let component = {
                component: {
                    actions: [action]
                }
            };
            let step = {
                stepDefinition: {
                    componentInstances: [component]
                }
            };

            let expectationModel = new ExpectationModel(step);

            expect(expectationModel.step).to.equal(step);
        });
    });

    describe('ExpectationModel.condition:', () => {
        it('should initially be "equal"', () => {
            let action = {
                parameters: []
            };
            let component = {
                component: {
                    actions: [action]
                }
            };
            let step = {
                stepDefinition: {
                    componentInstances: [component]
                }
            };

            let expectationModel = new ExpectationModel(step);

            expect(expectationModel.condition).to.equal('equal');
        });
    });

    describe('ExpectationModel.component:', () => {
        it('should initially be the first available component of the stepDefinition', () => {
            let action = {
                parameters: []
            };
            let component = {
                component: {
                    actions: [action]
                }
            };
            let step = {
                stepDefinition: {
                    componentInstances: [component]
                }
            };

            let expectationModel = new ExpectationModel(step);

            expect(expectationModel.component).to.equal(component);
        });
    });

    describe('ExpectationModel.action:', () => {
        it('should initially be the first action of the component', () => {
            let action = {
                parameters: []
            };
            let component = {
                component: {
                    actions: [action]
                }
            };
            let step = {
                stepDefinition: {
                    componentInstances: [component]
                }
            };

            let expectationModel = new ExpectationModel(step);

            expect(expectationModel.action).to.equal(action);
        });
    });

    describe('ExpectationModel.arguments:', () => {
        it('should contain the arguments for the action', () => {
            let action = {
                parameters: [{
                    name: 'argument1'
                }, {
                    name: 'argument2'
                }]
            };
            let component = {
                component: {
                    actions: [action]
                }
            };
            let step = {
                stepDefinition: {
                    componentInstances: [component]
                }
            };

            let expectationModel = new ExpectationModel(step);

            let [argument1, argument2] = expectationModel.arguments;
            expect(argument1.name).to.equal('argument1');
            expect(argument2.name).to.equal('argument2');
        });
    });

    describe('ExpectationModel.ast:', () => {
        it('should be the AST of the ExpectationModel', () => {
            let parameter = {
                name: 'argument'
            }
            let action = {
                parameters: [parameter],
                variableName: 'action'
            };
            let component = {
                component: {
                    actions: [action]
                },
                variableName: 'component'
            };
            let step = {
                stepDefinition: {
                    componentInstances: [component]
                }
            };

            let expectationModel = new ExpectationModel(step);
            expectationModel.condition = 'contain';
            expectationModel.value = 'value';

            let [argument] = expectationModel.arguments;
            argument.value = 'argument';

            let { ast } = expectationModel

            expect(escodegen.generate(ast)).to.equal(dedent(`
                expect(component.action('argument')).to.eventually.contain('value')
            `));
        });

        it('should be the AST of the ExpectationModel', () => {
            let parameter = {
                name: 'argument'
            }
            let action = {
                parameters: [parameter],
                variableName: 'action'
            };
            let component = {
                component: {
                    actions: [action]
                },
                variableName: 'component'
            };
            let step = {
                stepDefinition: {
                    componentInstances: [component]
                }
            };

            let expectationModel = new ExpectationModel(step);
            expectationModel.condition = 'contain';
            expectationModel.value = 'value';

            let [argument] = expectationModel.arguments;
            argument.value = 'argument';

            let { ast } = expectationModel

            expect(escodegen.generate(ast)).to.equal(dedent(`
                expect(component.action('argument')).to.eventually.contain('value')
            `));
        });
    });
});
