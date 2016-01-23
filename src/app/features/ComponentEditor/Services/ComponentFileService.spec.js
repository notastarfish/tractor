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
import './ComponentFileService';
let componentFileService;

describe('ComponentFileService.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.componentFileService');

        angular.mock.inject((
            _componentFileService_
        ) => {
            componentFileService = _componentFileService_;
        });
    });

    it('should inherit from the FileService', () => {
        expect(componentFileService).to.be.an.instanceof(FileService);
    });
});
