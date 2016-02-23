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
import './StepDefinitionFileService';
let stepDefinitionFileService;

describe('StepDefinitionFileService.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.componentFileService');
        angular.mock.module('tractor.mockDataFileService');
        angular.mock.module('tractor.stepDefinitionFileService');

        angular.mock.inject((
            _stepDefinitionFileService_
        ) => {
            stepDefinitionFileService = _stepDefinitionFileService_;
        });
    });

    it('should inherit from the FileService', () => {
        expect(stepDefinitionFileService).to.be.an.instanceof(FileService);
    });
});
