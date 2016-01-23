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
import './MockDataModel';
let MockDataModel;

describe('MockDataModel.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.mockDataModel');

        angular.mock.inject((
            _MockDataModel_
        ) => {
            MockDataModel = _MockDataModel_;
        });
    });

    describe('MockDataModel constructor:', () => {
        it('should return an `MockDataModel`', () => {
            let mockDataModel = new MockDataModel();

            expect(mockDataModel).to.be.an.instanceof(MockDataModel);
        });
    });

    describe('MockDataModel.isSaved:', () => {
        it('should equal the value from `options`', () => {
            let options = {
                isSaved: true
            };

            let mockDataModel = new MockDataModel({}, options);

            expect(mockDataModel.isSaved).to.equal(true);
        });

        it('should default to `false`', () => {
            let mockDataModel = new MockDataModel();

            expect(mockDataModel.isSaved).to.equal(false);
        });
    });

    describe('MockDataModel.path:', () => {
        it('should equal the value from `options`', () => {
            let options = {
                path: 'some/path'
            };

            let mockDataModel = new MockDataModel({}, options);

            expect(mockDataModel.path).to.equal('some/path');
        });
    });

    describe('MockDataModel.json:', () => {
        it('should have `json`', () => {
            let json = JSON.stringify({ some: 'object' });

            let mockDataModel = new MockDataModel(json);

            expect(mockDataModel.json).to.equal(dedent(`
                {
                    "some": "object"
                }
            `));
        });

        it('should default to an empty object', () => {
            let mockDataModel = new MockDataModel();

            expect(mockDataModel.json).to.equal('{}');
        });

        it('should handle incomplete JSON', () => {
            let json = dedent(`
                {
                    "some": "obj
            `);

            let mockDataModel = new MockDataModel(json);

            expect(mockDataModel.json).to.equal(dedent(`
                {
                    "some": "obj
            `));
        });

        it('should be able to be set', () => {
            let mockDataModel = new MockDataModel();

            mockDataModel.json = JSON.stringify({ some: 'object' });

            expect(mockDataModel.json).to.equal(dedent(`
                {
                    "some": "object"
                }
            `));
        });
    });

    describe('MockDataModel.data:', () => {
        it('should be an alias for `json`', () => {
            let json = JSON.stringify({ some: 'object' });

            let mockDataModel = new MockDataModel(json);

            expect(mockDataModel.data).to.equal(dedent(`
                {
                    "some": "object"
                }
            `));
        });
    });
});
