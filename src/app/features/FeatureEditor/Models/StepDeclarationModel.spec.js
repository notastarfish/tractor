/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';

// Test setup:
const expect = chai.expect;

// Testing:
import './StepDeclarationModel';
let StepDeclarationModel;

describe('StepDeclarationModel.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.stepDeclarationModel');

        angular.mock.inject((_StepDeclarationModel_) => {
            StepDeclarationModel = _StepDeclarationModel_;
        });
    });

    describe('StepDeclarationModel constructor:', () => {
        it('should return a StepDeclarationModel', () => {
            let stepDeclaration = new StepDeclarationModel();

            expect(stepDeclaration).to.be.an.instanceof(StepDeclarationModel);
        });

        it('should have a default `type` of "Given"', () => {
            let stepDeclaration = new StepDeclarationModel();

            expect(stepDeclaration.type).to.equal('Given');
        });
    });

    describe('StepDeclarationModel.types:', () => {
        it('should have the different types', () => {
            let stepDeclaration = new StepDeclarationModel();

            expect(stepDeclaration.types).to.deep.equal(['Given', 'When', 'Then', 'And', 'But']);
        });
    });

    describe('StepDeclarationModel.feature:', () => {
        it('should format the step declaration', () => {
            let stepDeclaration = new StepDeclarationModel();

            stepDeclaration.step = 'something';

            expect(stepDeclaration.feature).to.equal('Given something');
        });
    });
});
