'use strict';

// Dependencies:
import angular from 'angular';
import MockDataModel from '../Models/MockDataModel';

class MockDataParserService {
    constructor (MockDataModel) {
        this.MockDataModel = MockDataModel;
    }

    parse (mockDataFile) {
        try {
            let mockDataModel = new this.MockDataModel(mockDataFile.content, {
                isSaved: true,
                path: mockDataFile.path
            });
            mockDataModel.name = mockDataFile.name;
            return mockDataModel;
        } catch (e) {
            return new MockDataModel();
        }
    }
}

export default angular.module('mockDataParserService', [
    MockDataModel.name
])
.service('MockDataParserService', MockDataParserService);
