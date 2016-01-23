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
import './FeatureFileService';
let featureFileService;

describe('FeatureFileService.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.featureFileService');

        angular.mock.module($provide => {
            $provide.factory('FeatureIndent', () => {
                return '  ';
            });
            $provide.factory('FeatureNewLine', () => {
                return '\n';
            });
        });

        angular.mock.inject((
            _featureFileService_
        ) => {
            featureFileService = _featureFileService_;
        });
    });

    it('should inherit from the FileService', () => {
        expect(featureFileService).to.be.an.instanceof(FileService);
    });

    describe('FeatureFileService.saveFile:', () => {
        it('should replace double-quotemarks before and after example variables with single-quotes', () => {
            let options = {
                data: '"<>" "<>"'
            };

            featureFileService.saveFile(options);

            expect(options.data).to.equal('\'<>\' \'<>\'')
        });
    });
});
