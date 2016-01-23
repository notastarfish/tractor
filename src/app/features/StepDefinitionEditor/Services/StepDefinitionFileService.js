'use strict';

// Dependencies:
import angular from 'angular';
import FileService from '../../../Core/Services/FileService';
import FileStructureService from '../../../Core/Services/FileStructureService';
import StepDefinitionParserService from './StepDefinitionParserService';

class StepDefinitionFileService extends FileService {
    constructor (
        $http,
        fileStructureService,
        stepDefinitionParserService
    ) {
        super($http, stepDefinitionParserService, fileStructureService, 'step-definitions');
    }
}

export default angular.module('stepDefinitionFileService', [
    FileStructureService.name,
    StepDefinitionParserService.name
])
.service('stepDefinitionFileService', StepDefinitionFileService);
