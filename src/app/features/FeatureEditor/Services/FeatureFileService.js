'use strict';

// Utilities:
import compose from 'lodash.compose';

// Dependencies:
import angular from 'angular';
import FeatureParserService from './FeatureParserService';
import FileService from '../../../Core/Services/FileService';
import FileStructureService from '../../../Core/Services/FileStructureService';

class FeatureFileService extends FileService {
    constructor (
        $http,
        featureParserService,
        fileStructureService
    ) {
        super($http, featureParserService, fileStructureService, 'features');
        this.saveFile = compose(this.saveFile, fixFeatureParameters);
    }
}

function fixFeatureParameters (options) {
    options.data = options.data.replace(/"</g, `'<`).replace(/>"/g, `>'`);
    return options;
}

export default angular.module('featureFileService', [
    FeatureParserService.name,
    FileStructureService.name
])
.service('featureFileService', FeatureFileService);
