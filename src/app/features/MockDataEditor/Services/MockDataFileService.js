'use strict';

// Dependencies:
import angular from 'angular';
import FileService from '../../../Core/Services/FileService';
import FileStructureService from '../../../Core/Services/FileStructureService';
import MockDataParserService from './MockDataParserService';

class MockDataFileService extends FileService {
    constructor (
        $http,
        fileStructureService,
        mockDataParserService
    ) {
        super($http, mockDataParserService, fileStructureService, 'mock-data');
    }
}

export default angular.module('mockDataFileService', [
    FileStructureService.name,
    MockDataParserService.name
])
.service('MockDataFileService', MockDataFileService);
