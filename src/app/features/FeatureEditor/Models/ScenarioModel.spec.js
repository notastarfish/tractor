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

// Testing:
import './ScenarioModel';
let ScenarioModel;

describe('ScenarioModel.js:', () => {
    let ExampleModel;
    let StepDeclarationModel;

    beforeEach(() => {
        angular.mock.module('tractor.scenarioModel');

        angular.mock.module($provide => {
            $provide.factory('FeatureIndent', () => {
                return '  ';
            });
            $provide.factory('FeatureNewLine', () => {
                return '\n';
            });
        });

        angular.mock.inject((
            _ExampleModel_,
            _ScenarioModel_,
            _StepDeclarationModel_
        ) => {
            ExampleModel = _ExampleModel_;
            ScenarioModel = _ScenarioModel_;
            StepDeclarationModel = _StepDeclarationModel_;
        });
    });

    describe('ScenarioModel constructor:', () => {
        it('should return a ScenarioModel', () => {
            let scenarioModel = new ScenarioModel();

            expect(scenarioModel).to.be.an.instanceof(ScenarioModel);
        });
    });

    describe('ScenarioModel.exampleVariables:', () => {
        it('should contain all the variable names from the steps in the scenario', () => {
            let stepDeclaration = {
                step: '<variable 1> <variable 2>'
            };

            let scenarioModel = new ScenarioModel();
            scenarioModel.stepDeclarations.push(stepDeclaration);

            expect(scenarioModel.exampleVariables).to.deep.equal(['variable 1', 'variable 2']);
        });

        it(`should be an empty array when there aren't any variables`, () => {
            let stepDeclaration = {
                step: ''
            };

            let scenarioModel = new ScenarioModel();
            scenarioModel.stepDeclarations.push(stepDeclaration);

            expect(scenarioModel.exampleVariables).to.deep.equal([]);
        });

        it(`shouldn't contain any duplicates`, () => {
            let stepDeclaration1 = {
                step: '<variable>'
            };
            let stepDeclaration2 = {
                step: '<variable>'
            };

            let scenarioModel = new ScenarioModel();
            scenarioModel.stepDeclarations.push(stepDeclaration1);
            scenarioModel.stepDeclarations.push(stepDeclaration2);

            expect(scenarioModel.exampleVariables).to.deep.equal(['variable']);
        });
    });

    describe('ScenarioModel.addStepDeclaration:', () => {
        it('should add a new scenario to the feature', () => {
            let scenarioModel = new ScenarioModel();

            expect(scenarioModel.stepDeclarations.length).to.equal(0);

            scenarioModel.addStepDeclaration();

            expect(scenarioModel.stepDeclarations.length).to.equal(1);
            let [stepDeclarationModel] = scenarioModel.stepDeclarations;

            expect(stepDeclarationModel).to.be.an.instanceof(StepDeclarationModel);
        });
    });

    describe('ScenarioModel.removeStepDeclaration:', () => {
        it('should remove a scenario from the feature', () => {
            let scenarioModel = new ScenarioModel();

            scenarioModel.addStepDeclaration();

            expect(scenarioModel.stepDeclarations.length).to.equal(1);

            let [stepDeclarationModel] = scenarioModel.stepDeclarations;
            scenarioModel.removeStepDeclaration(stepDeclarationModel);

            expect(scenarioModel.stepDeclarations.length).to.equal(0);
        });
    });

    describe('ScenarioModel.addExample:', () => {
        it('should add a new example to the feature', () => {
            let scenarioModel = new ScenarioModel();

            expect(scenarioModel.examples.length).to.equal(0);

            scenarioModel.addExample();

            expect(scenarioModel.examples.length).to.equal(1);
            let [exampleModel] = scenarioModel.examples;

            expect(exampleModel).to.be.an.instanceof(ExampleModel);
        });
    });

    describe('ScenarioModel.removeExample:', () => {
        it('should remove an example from the feature', () => {
            let scenarioModel = new ScenarioModel();

            scenarioModel.addExample();

            expect(scenarioModel.examples.length).to.equal(1);

            let [exampleModel] = scenarioModel.examples;
            scenarioModel.removeExample(exampleModel);

            expect(scenarioModel.examples.length).to.equal(0);
        });
    });

    describe('ScenarioModel.featureString:', () => {
        it('should format the scenario', () => {
            let stepDeclaration1 = {
                feature: 'Given something'
            };
            let stepDeclaration2 = {
                feature: 'When something else'
            };

            let scenarioModel = new ScenarioModel();
            scenarioModel.name = 'scenario';
            scenarioModel.stepDeclarations.push(stepDeclaration1);
            scenarioModel.stepDeclarations.push(stepDeclaration2);

            expect(scenarioModel.featureString).to.equal(dedent(`
                Scenario: scenario
                    Given something
                    When something else
            `));
        });

        it('should format the scenario outline when there are examples', () => {
            let stepDeclaration1 = {
                feature: 'Given <variable 1>',
                step: '<variable 1>'
            };
            let stepDeclaration2 = {
                feature: 'When <variable 2>',
                step: '<variable 2>'
            };
            let example1 = {
                feature: '      | value 1 | value 2 |'
            };
            let example2 = {
                feature: '      | value 1 | value 2 |'
            };

            let scenarioModel = new ScenarioModel();
            scenarioModel.name = 'scenario';
            scenarioModel.stepDeclarations.push(stepDeclaration1);
            scenarioModel.stepDeclarations.push(stepDeclaration2);
            scenarioModel.examples.push(example1);
            scenarioModel.examples.push(example2);

            expect(scenarioModel.featureString).to.equal(dedent(`
                Scenario Outline: scenario
                    Given <variable 1>
                    When <variable 2>
                    Examples:
                      | variable 1 | variable 2 |
                      | value 1 | value 2 |
                      | value 1 | value 2 |
            `));
        });
    });
});
