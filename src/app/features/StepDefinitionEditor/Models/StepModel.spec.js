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
import './StepModel';
let StepModel;

describe('StepModel.js:', () => {
    let ExpectationModel;
    let TaskModel;
    let MockModel;

    beforeEach(() => {
        angular.mock.module('tractor.stepModel');

        angular.mock.inject((
            _StepModel_,
            _ExpectationModel_,
            _TaskModel_,
            _MockModel_
        ) => {
            StepModel = _StepModel_;
            ExpectationModel = _ExpectationModel_;
            TaskModel = _TaskModel_;
            MockModel = _MockModel_;
        });
    });

    describe('StepModel constructor:', () => {
        it('should create a new `StepModel`', () => {
            let stepDefinition = {};

            let stepModel = new StepModel(stepDefinition);

            expect(stepModel).to.be.an.instanceof(StepModel);
        });
    });

    describe('StepModel.stepTypes:', () => {
        it('should contain the possible step types', () => {
            let stepDefinition = {};

            let stepModel = new StepModel(stepDefinition);

            expect(stepModel.stepTypes).to.deep.equal(['Given', 'When', 'Then', 'And', 'But']);
        });
    });

    describe('StepModel.expectations:', () => {
        it('should default to an empty array', () => {
            let stepDefinition = {};

            let stepModel = new StepModel(stepDefinition);

            expect(stepModel.expectations).to.deep.equal([]);
            expect(stepModel.expectations.length).to.equal(0);
        });
    });

    describe('StepModel.mocks:', () => {
        it('should default to an empty array', () => {
            let stepDefinition = {};

            let stepModel = new StepModel(stepDefinition);

            expect(stepModel.mocks).to.deep.equal([]);
            expect(stepModel.mocks.length).to.equal(0);
        });
    });

    describe('StepModel.stepDefinition:', () => {
        it('should be the passed in StepDefinition', () => {
            let stepDefinition = {};

            let stepModel = new StepModel(stepDefinition);

            expect(stepModel.stepDefinition).to.equal(stepDefinition);
        });
    });

    describe('StepModel.tasks:', () => {
        it('should default to an empty array', () => {
            let stepDefinition = {};

            let stepModel = new StepModel(stepDefinition);

            expect(stepModel.tasks).to.deep.equal([]);
            expect(stepModel.tasks.length).to.equal(0);
        });
    });

    describe('StepModel.addExpectation:', () => {
        it('should add a new expectation to the step', () => {
            let stepDefinition = {
                componentInstances: [{
                    component: {
                        actions: [{
                            parameters: []
                        }]
                    }
                }]
            };

            let stepModel = new StepModel(stepDefinition);

            stepModel.addExpectation();

            expect(stepModel.expectations.length).to.equal(1);
            let [expectation] = stepModel.expectations;
            expect(expectation).to.be.an.instanceof(ExpectationModel);
        });
    });

    describe('StepModel.removeExpectation:', () => {
        it('should remove an expectation from the step', () => {
            let stepDefinition = {
                componentInstances: [{
                    component: {
                        actions: [{
                            parameters: []
                        }]
                    }
                }]
            };

            let stepModel = new StepModel(stepDefinition);

            stepModel.addExpectation();
            let [expectation] = stepModel.expectations;
            stepModel.removeExpectation(expectation);

            expect(stepModel.expectations.length).to.equal(0);
        });
    });

    describe('StepModel.addTask:', () => {
        it('should add a new task to the step', () => {
            let stepDefinition = {
                componentInstances: [{
                    component: {
                        actions: [{
                            parameters: []
                        }]
                    }
                }]
            };

            let stepModel = new StepModel(stepDefinition);

            stepModel.addTask();

            expect(stepModel.tasks.length).to.equal(1);
            let [task] = stepModel.tasks;
            expect(task).to.be.an.instanceof(TaskModel);
        });
    });

    describe('StepModel.removeTask:', () => {
        it('should remove an task from the step', () => {
            let stepDefinition = {
                componentInstances: [{
                    component: {
                        actions: [{
                            parameters: []
                        }]
                    }
                }]
            };

            let stepModel = new StepModel(stepDefinition);

            stepModel.addTask();
            let [task] = stepModel.tasks;
            stepModel.removeTask(task);

            expect(stepModel.tasks.length).to.equal(0);
        });
    });

    describe('StepModel.addMock:', () => {
        it('should add a mock to the step', () => {
            let stepDefinition = {
                mockDataInstances: [{}]
            };

            let stepModel = new StepModel(stepDefinition);

            stepModel.addMock();

            expect(stepModel.mocks.length).to.equal(1);
            let [mock] = stepModel.mocks;
            expect(mock).to.be.an.instanceof(MockModel);
        });
    });

    describe('StepModel.removeMock:', () => {
        it('should remove a mock from the step', () => {
            let stepDefinition = {
                mockDataInstances: [{}]
            };

            let stepModel = new StepModel(stepDefinition);

            stepModel.addMock();
            let [mock] = stepModel.mocks;
            stepModel.removeMock(mock);

            expect(stepModel.mocks.length).to.equal(0);
        });
    });

    describe('StepModel.ast:', () => {
        it('should default to the AST of a pending step', () => {
            let stepDefinition = {};

            let stepModel = new StepModel(stepDefinition);

            stepModel.type = 'Given';
            stepModel.regex = /something/;

            let { ast } = stepModel;

            expect(escodegen.generate(ast)).to.equal(dedent(`
                this.Given(/something/, function (done) {
                    done.pending();
                });
            `));
        });

        it('should include the AST for any mocks', () => {
            let stepDefinition = {
                mockDataInstances: [{}]
            };

            let stepModel = new StepModel(stepDefinition);
            stepModel.type = 'Given';
            stepModel.regex = /something/;

            stepModel.addMock();
            let [mock] = stepModel.mocks;
            mock.action = 'GET';
            mock.url = /some\/URL/;
            mock.passThrough = true;

            let { ast } = stepModel;

            expect(escodegen.generate(ast)).to.equal(dedent(`
                this.Given(/something/, function (done) {
                    httpBackend.whenGET(/some\\/URL/).passThrough();
                    done();
                });
            `));
        });

        it('should include the AST from any tasks', () => {
            let stepDefinition = {
                componentInstances: [{
                    variableName: 'component',
                    component: {
                        actions: [{
                            variableName: 'action',
                            parameters: []
                        }]
                    }
                }]
            };

            let stepModel = new StepModel(stepDefinition);
            stepModel.type = 'Given';
            stepModel.regex = /something/;

            stepModel.addTask();
            stepModel.addTask();

            let { ast } = stepModel;

            expect(escodegen.generate(ast)).to.equal(dedent(`
                this.Given(/something/, function (done) {
                    var tasks = component.action().then(function () {
                        return component.action();
                    });
                    Promise.resolve(tasks).then(done).catch(done.fail);
                });
            `));
        });

        it('should include the AST from any expectations', () => {
            let stepDefinition = {
                componentInstances: [{
                    variableName: 'component',
                    component: {
                        actions: [{
                            variableName: 'action',
                            parameters: []
                        }]
                    }
                }]
            };

            let stepModel = new StepModel(stepDefinition);
            stepModel.type = 'Given';
            stepModel.regex = /something/;

            stepModel.addExpectation();

            let [expectation] = stepModel.expectations;
            expectation.value = 'true';

            let { ast } = stepModel;

            expect(escodegen.generate(ast)).to.equal(dedent(`
                this.Given(/something/, function (done) {
                    Promise.all([expect(component.action()).to.eventually.equal(true)]).spread(function () {
                        done();
                    }).catch(done.fail);
                });
            `));
        });
    });
});
