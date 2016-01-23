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
import './TaskModel';
let TaskModel;

describe('TaskModel.js:', () => {
    let ArgumentModel;

    beforeEach(() => {
        angular.mock.module('tractor.taskModel');

        angular.mock.inject((
            _ArgumentModel_,
            _TaskModel_
        ) => {
            ArgumentModel = _ArgumentModel_;
            TaskModel = _TaskModel_;
        });
    });

    describe('TaskModel constructor:', () => {
        it('should create a new `TaskModel`', () => {
            let step = {
                stepDefinition: {
                    componentInstances: [{
                        component: {
                            actions: [{
                                parameters: []
                            }]
                        }
                    }]
                }
            };

            let taskModel = new TaskModel(step);

            expect(taskModel).to.be.an.instanceof(TaskModel);
        });
    });

    describe('TaskModel.step:', () => {
        it('should be the passed in step', () => {
            let step = {
                stepDefinition: {
                    componentInstances: [{
                        component: {
                            actions: [{
                                parameters: []
                            }]
                        }
                    }]
                }
            };

            let taskModel = new TaskModel(step);

            expect(taskModel.step).to.equal(step);
        });
    });

    describe('TaskModel.component:', () => {
        it('should initally be the first available component of the step definition', () => {
            let component = {
                component: {
                    actions: [{
                        parameters: []
                    }]
                }
            };
            let step = {
                stepDefinition: {
                    componentInstances: [component]
                }
            };

            let taskModel = new TaskModel(step);

            expect(taskModel.component).to.equal(component);
        });
    });

    describe('TaskModel.action:', () => {
        it('should initially be the first action of the component', () => {
            let action = {
                parameters: []
            };
            let step = {
                stepDefinition: {
                    componentInstances: [{
                        component: {
                            actions: [action]
                        }
                    }]
                }
            };

            let taskModel = new TaskModel(step);

            expect(taskModel.action).to.equal(action);
        });
    });

    describe('TaskModel.arguments:', () => {
        it('should have an ArgumentModel for each parameter of the action', () => {
            let step = {
                stepDefinition: {
                    componentInstances: [{
                        component: {
                            actions: [{
                                parameters: [{
                                    name: 'someParameter'
                                }]
                            }]
                        }
                    }]
                }
            };

            let taskModel = new TaskModel(step);

            let [argument] = taskModel.arguments;

            expect(argument).to.be.an.instanceof(ArgumentModel);
            expect(argument.name).to.be.equal('Some parameter');
        });
    });

    describe('TaskModel.ast:', () => {
        it('should have an ArgumentModel for each parameter of the action', () => {
            let step = {
                stepDefinition: {
                    componentInstances: [{
                        variableName: 'component',
                        component: {
                            actions: [{
                                variableName: 'action',
                                parameters: [{
                                    name: 'someParameter'
                                }]
                            }]
                        }
                    }]
                }
            };

            let taskModel = new TaskModel(step);

            let [argument] = taskModel.arguments;
            argument.value = 'argument';

            let { ast } = taskModel

            expect(escodegen.generate(ast)).to.equal(dedent(`
                component.action('argument')
            `));
        });
    });
});
