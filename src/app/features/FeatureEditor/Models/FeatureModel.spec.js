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
import './FeatureModel';
let FeatureModel;

describe('FeatureModel.js:', () => {
    let ScenarioModel;

    beforeEach(() => {
        angular.mock.module('tractor.featureModel');

        angular.mock.module($provide => {
            $provide.factory('FeatureIndent', () => {
                return '  ';
            });
            $provide.factory('FeatureNewLine', () => {
                return '\n';
            });
        });

        angular.mock.inject((
            _FeatureModel_,
            _ScenarioModel_
        ) => {
            FeatureModel = _FeatureModel_;
            ScenarioModel = _ScenarioModel_;
        });
    });

    describe('FeatureModel constructor:', () => {
        it('should return a `FeatureModel`', () => {
            let featureModel = new FeatureModel();

            expect(featureModel).to.be.an.instanceof(FeatureModel);
        });
    });

    describe('FeatureModel.isSaved:', () => {
        it('should return whether the feature has been saved or not', () => {
            let tests = [{
                options: {},
                expected: false
            }, {
                options: {
                    isSaved: true
                },
                expected: true
            }];

            tests.forEach((test) => {
                let { options, expected } = test;

                let featureModel = new FeatureModel(options);

                expect(featureModel.isSaved).to.equal(expected);
            });
        });
    });

    describe('FeatureModel.path:', () => {
        it('should return the path to feature', () => {
            let options = {
                path: 'path/to/feature'
            };

            let featureModel = new FeatureModel(options);

            expect(featureModel.path).to.equal('path/to/feature');
        })
    });

    describe('FeatureModel.addScenario:', () => {
        it('should add a new scenario to the feature', () => {
            let featureModel = new FeatureModel();

            expect(featureModel.scenarios.length).to.equal(0);

            featureModel.addScenario();

            expect(featureModel.scenarios.length).to.equal(1);
            let [scenarioModel] = featureModel.scenarios;

            expect(scenarioModel).to.be.an.instanceof(ScenarioModel);
        });
    });

    describe('FeatureModel.removeScenario:', () => {
        it('should remove a scenario from the feature', () => {
            let featureModel = new FeatureModel();

            featureModel.addScenario();

            expect(featureModel.scenarios.length).to.equal(1);

            let [scenario] = featureModel.scenarios;
            featureModel.removeScenario(scenario);

            expect(featureModel.scenarios.length).to.equal(0);
        });
    });

    describe('FeatureModel.featureString:', () => {
        it('should format the feature', () => {
            let scenarioModel1 = {
                featureString: 'Scenario: scenario 1'
            };
            let scenarioModel2 = {
                featureString: 'Scenario: scenario 2'
            };

            let featureModel = new FeatureModel();
            featureModel.name = 'feature';
            featureModel.inOrderTo = 'achieve something';
            featureModel.asA = 'user';
            featureModel.iWant = 'to do something';

            featureModel.scenarios.push(scenarioModel1);
            featureModel.scenarios.push(scenarioModel2);

            expect(featureModel.featureString).to.equal(dedent(`
                Feature: feature
                  In order to achieve something
                  As a user
                  I want to do something
                  Scenario: scenario 1
                  Scenario: scenario 2
            `));
        });
    });

    describe('FeatureModel.data:', () => {
        it('should alias `FeatureModel.featureString`', () => {
            let scenarioModel1 = {
                featureString: 'Scenario: scenario 1'
            };
            let scenarioModel2 = {
                featureString: 'Scenario: scenario 2'
            };

            let featureModel = new FeatureModel();
            featureModel.name = 'feature';
            featureModel.inOrderTo = 'achieve something';
            featureModel.asA = 'user';
            featureModel.iWant = 'to do something';

            featureModel.scenarios.push(scenarioModel1);
            featureModel.scenarios.push(scenarioModel2);

            expect(featureModel.data).to.equal(featureModel.featureString);
        });
    })
});
