/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';

// Test setup:
const expect = chai.expect;

// Dependencies:
import FileService from '../../../Core/Services/FileService';

// Testing:
import './MockDataFileService';
let mockDataFileService;

describe('MockDataFileService.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.mockDataFileService');

        angular.mock.inject((
            _mockDataFileService_
        ) => {
            mockDataFileService = _mockDataFileService_;
        });
    });

    it('should inherit from the FileService', () => {
        expect(mockDataFileService).to.be.an.instanceof(FileService);
    });
});
