/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';
import sinon from 'sinon';

// Test setup:
const expect = chai.expect;

// Testing:
import './StepDeclarationParserService';
let stepDeclarationParserService;

describe('StepDeclarationParserService.js:', () => {
    let StepDeclarationModel;

    beforeEach(() => {
        angular.mock.module('tractor.stepDeclarationParserService');

        angular.mock.module($provide => {
            $provide.factory('FeatureIndent', () => {
                return '  ';
            });
            $provide.factory('FeatureNewLine', () => {
                return '\n';
            });
        });

        angular.mock.inject((
            _stepDeclarationParserService_,
            _StepDeclarationModel_
        ) => {
            stepDeclarationParserService = _stepDeclarationParserService_;
            StepDeclarationModel = _StepDeclarationModel_;
        });
    });

    describe('StepDeclarationParserService.parse:', () => {
        it('should return a `StepDeclarationModel`', () => {
            let tokens = {
                type: 'Given',
                step: 'something'
            };

            let stepDeclarationModel = stepDeclarationParserService.parse(tokens);

            expect(stepDeclarationModel).to.be.an.instanceof(StepDeclarationModel);
        });

        it('should parse the type of the step declaration', () => {
            let tokens = {
                type: 'Given',
                step: 'something'
            };

            let stepDeclarationModel = stepDeclarationParserService.parse(tokens);

            expect(stepDeclarationModel.type).to.equal('Given');
        });

        it('should parse the step of the step declaration', () => {
            let tokens = {
                type: 'Given',
                step: 'something'
            };

            let stepDeclarationModel = stepDeclarationParserService.parse(tokens);

            expect(stepDeclarationModel.step).to.equal('something');
        });

        it('should bail out and return `null` when it cannot parse', () => {
            let tokens = {};

            sinon.stub(console, 'warn');

            let stepDeclarationModel = stepDeclarationParserService.parse(tokens);

            expect(stepDeclarationModel).to.equal(null);

            console.warn.restore();
        });
    });
});
