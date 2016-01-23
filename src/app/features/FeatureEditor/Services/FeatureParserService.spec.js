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
import './FeatureParserService';
let featureParserService;

describe('FeatureParserService.js:', () => {
    let FeatureModel;
    let scenarioParserService;

    beforeEach(() => {
        angular.mock.module('tractor.featureParserService');

        angular.mock.module($provide => {
            $provide.factory('FeatureIndent', () => {
                return '  ';
            });
            $provide.factory('FeatureNewLine', () => {
                return '\n';
            });
            $provide.factory('scenarioParserService', () => {
                scenarioParserService = {};
                return scenarioParserService;
            });
        });

        angular.mock.inject((
            _featureParserService_,
            _FeatureModel_
        ) => {
            featureParserService = _featureParserService_;
            FeatureModel = _FeatureModel_;
        });
    });

    describe('FeatureParserService.parse:', () => {
        it('should return a `FeatureModel`', () => {
            let featureFiles = {
                tokens: [{
                    name: 'feature',
                    inOrderTo: 'achieve something',
                    asA: 'user',
                    iWant: 'to do something',
                    elements: []
                }]
            };

            let featureModel = featureParserService.parse(featureFiles);

            expect(featureModel).to.be.an.instanceof(FeatureModel);
        });

        it('should have `isSaved` set to true', () => {
            let featureFiles = {
                tokens: [{
                    name: 'feature',
                    inOrderTo: 'achieve something',
                    asA: 'user',
                    iWant: 'to do something',
                    elements: []
                }]
            };

            let featureModel = featureParserService.parse(featureFiles);

            expect(featureModel.isSaved).to.equal(true);
        });

        it('should have the correct path', () => {
            let featureFiles = {
                path: 'path',
                tokens: [{
                    name: 'feature',
                    inOrderTo: 'achieve something',
                    asA: 'user',
                    iWant: 'to do something',
                    elements: []
                }]
            };

            let featureModel = featureParserService.parse(featureFiles);

            expect(featureModel.path).to.equal('path');
        });

        it('should attempt to parse each `element` into a ScenarioModel', () => {
            let element = {};
            let featureFiles = {
                tokens: [{
                    name: 'feature',
                    inOrderTo: 'achieve something',
                    asA: 'user',
                    iWant: 'to do something',
                    elements: [element]
                }]
            };

            let scenarioModel = {};
            scenarioParserService.parse = angular.noop;
            sinon.stub(scenarioParserService, 'parse').returns(scenarioModel);

            let featureModel = featureParserService.parse(featureFiles);

            expect(scenarioParserService.parse).to.have.been.calledWith(element);
            expect(featureModel.scenarios.length).to.equal(1);
        });

        it('should bail out and return `null` when it cannot parse', () => {
            let featureFiles = {
                tokens: [{
                    name: 'feature',
                    inOrderTo: 'achieve something',
                    asA: 'user',
                    iWant: 'to do something'
                }]
            };

            sinon.stub(console, 'warn');

            let featureModel = featureParserService.parse(featureFiles);

            expect(featureModel).to.equal(null);

            console.warn.restore();
        });
    });
});
