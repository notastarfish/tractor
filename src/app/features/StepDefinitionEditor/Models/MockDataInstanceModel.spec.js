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
import './MockDataInstanceModel';
let MockDataInstanceModel;

describe('MockDataInstanceModel.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.mockDataInstanceModel');

        angular.mock.inject((
            _MockDataInstanceModel_
        ) => {
            MockDataInstanceModel = _MockDataInstanceModel_;
        });
    });

    describe('MockDataInstanceModel constructor:', () => {
        it('should create a new `MockDataInstanceModel`', () => {
            let mockData = {};
            let stepDefinition = {};

            let mockDataInstanceModel = new MockDataInstanceModel(mockData, stepDefinition);

            expect(mockDataInstanceModel).to.be.an.instanceof(MockDataInstanceModel);
        });
    });

    describe('MockDataInstanceModel.mockData:', () => {
        it('should have `mockData`', () => {
            let mockData = {};
            let stepDefinition = {};

            let mockDataInstanceModel = new MockDataInstanceModel(mockData, stepDefinition);

            expect(mockDataInstanceModel.mockData).to.equal(mockData);
        });
    });

    describe('MockDataInstanceModel.stepDefinition:', () => {
        it('should have a `stepDefinition`', () => {
            let mockData = {};
            let stepDefinition = {};

            let mockDataInstanceModel = new MockDataInstanceModel(mockData, stepDefinition);

            expect(mockDataInstanceModel.stepDefinition).to.equal(stepDefinition);
        });
    });

    describe('MockDataInstanceModel.name:', () => {
        it('should come from the MockData', () => {
            let mockData = {
                name: 'Some mock data'
            };
            let stepDefinition = {};

            let mockDataInstanceModel = new MockDataInstanceModel(mockData, stepDefinition);

            expect(mockDataInstanceModel.name).to.equal('Some mock data');
        });
    });

    describe('MockDataInstanceModel.variableName:', () => {
        it('should be the camelcase version of the name of the MockData', () => {
            let mockData = {
                name: 'Some mock data'
            };
            let stepDefinition = {};

            let mockDataInstanceModel = new MockDataInstanceModel(mockData, stepDefinition);

            expect(mockDataInstanceModel.variableName).to.equal('someMockData');
        });
    });

    describe('MockDataInstanceModel.meta:', () => {
        it('should get contain the full name of the MockDataInstance', () => {
            let mockData = {
                name: 'Some mock data'
            };
            let stepDefinition = {};

            let mockDataInstanceModel = new MockDataInstanceModel(mockData, stepDefinition);

            expect(mockDataInstanceModel.meta).to.deep.equal({
                name: 'Some mock data'
            });
        });
    });

    describe('MockDataInstanceModel.ast:', () => {
        it('should be the AST of the MockDataInstance:', () => {
            let mockData = {
                name: 'Some mock data',
                path: '/some/path/to/mock-data/Some mock data.mock.js'
            };
            let stepDefinition = {
                path: '/some/path/to/step-definition/Some step definition.step.js'
            };

            let mockDataInstanceModel = new MockDataInstanceModel(mockData, stepDefinition);
            let { ast } = mockDataInstanceModel;

            expect(escodegen.generate(ast)).to.equal(dedent(`
                var someMockData = require('../mock-data/Some mock data.mock.js');
            `));
        });

        it('should have a correct require path even on Windows', () => {
            let mockData = {
                name: 'Some mock data',
                path: 'C:\\some\\path\\to\\mock-data\\Some mock data.mock.js'
            };
            let stepDefinition = {
                path: 'C:\\some\\path\\to\\step-definition\\Some step definition.step.js'
            };

            let mockDataInstanceModel = new MockDataInstanceModel(mockData, stepDefinition);
            let { ast } = mockDataInstanceModel;

            expect(escodegen.generate(ast)).to.equal(dedent(`
                var someMockData = require('../mock-data/Some mock data.mock.js');
            `));
        });
    });
});
