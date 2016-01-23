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
import './MockDataParserService';
let mockDataParserService;

describe('MockDataParserService.js:', () => {
    let MockDataModel;

    beforeEach(() => {
        angular.mock.module('tractor.mockDataParserService');

        angular.mock.inject((
            _mockDataParserService_,
            _MockDataModel_
        ) => {
            mockDataParserService = _mockDataParserService_;
            MockDataModel = _MockDataModel_;
        });
    });

    describe('MockDataParserService.parse:', () => {
        it('should return a `MockDataModel`', () => {
            let mockDataFile = {
                name: 'mockData'
            };

            let mockDataModel = mockDataParserService.parse(mockDataFile);

            expect(mockDataModel).to.be.an.instanceof(MockDataModel);
        });

        it('should have `isSaved` set to true', () => {
            let mockDataFile = {
                name: 'mockData'
            };

            let mockDataModel = mockDataParserService.parse(mockDataFile);

            expect(mockDataModel.isSaved).to.equal(true);
        });

        it('should have the correct path', () => {
            let mockDataFile = {
                name: 'mockData',
                path: 'path'
            };

            let mockDataModel = mockDataParserService.parse(mockDataFile);

            expect(mockDataModel.path).to.equal('path');
        });

        it('should bail out and return `null` when it cannot parse', () => {
            let mockDataFile = {
            };

            sinon.stub(console, 'warn');

            let mockDataModel = mockDataParserService.parse(mockDataFile);

            expect(mockDataModel).to.equal(null);

            console.warn.restore();
        });
    });
});
