'use strict';

// Constants:
const OPEN_DIRECTORIES = 'OpenDirectories';

// Dependencies:
import angular from 'angular';
import ComponentParserService from '../../features/ComponentEditor/Services/ComponentParserService';
import MockDataParserService from '../../features/MockDataEditor/Services/MockDataParserService';
import PersistentStateService from './PersistentStateService';

class FileStructureService {
    constructor (
        $http,
        componentParserService,
        mockDataParserService,
        persistentStateService
    ) {
        this.$http = $http;
        this.componentParserService = componentParserService;
        this.mockDataParserService = mockDataParserService;
        this.persistentStateService = persistentStateService;
    }

    getFileStructure (type) {
        return this.$http.get(`/${type}/file-structure`)
        .then(parseComponentsAndMockData.bind(this))
        .then(updateFileStructure.bind(this));
    }

    addDirectory (type, options) {
        return this.$http.post(`/${type}/directory`, options)
        .then(updateFileStructure.bind(this));
    }

    copyFile (type, options) {
        return this.$http.post(`/${type}/file/copy`, options)
        .then(updateFileStructure.bind(this));
    }

    deleteDirectory (type, params) {
        return this.$http.delete(`/${type}/directory`, { params })
        .then(updateFileStructure.bind(this));
    }

    deleteFile (type, params) {
        return this.$http.delete(`/${type}/file`, { params })
        .then(updateFileStructure.bind(this));
    }

    editDirectoryPath (type, options) {
        options.isDirectory = true;
        return this.$http.patch(`/${type}/directory/path`, options)
        .then(updateFileStructure.bind(this));
    }

    editFilePath (type, options) {
        return this.$http.patch(`/${type}/file/path`, options)
        .then(updateFileStructure.bind(this));
    }

    toggleOpenDirectory (directoryPath) {
        let openDirectories = getOpenDirectories.call(this);
        if (openDirectories[directoryPath]) {
            delete openDirectories[directoryPath];
        } else {
            openDirectories[directoryPath] = true;
        }
        this.persistentStateService.set(OPEN_DIRECTORIES, openDirectories);
    }
}

function parseComponentsAndMockData (fileStructure) {
    let { availableComponents, availableMockData } = fileStructure;
    if (availableComponents && availableMockData) {
        fileStructure.availableComponents = availableComponents.map(component => {
            return this.componentParserService.parse(component);
        });
        fileStructure.availableMockData = availableMockData.map(mockData => {
            return this.mockDataParserService.parse(mockData);
        });
    }
    return fileStructure;
}

function updateFileStructure (fileStructure) {
    fileStructure.directory = restoreOpenDirectories.call(this, fileStructure.directory);
    fileStructure.directory.allFiles = getAllFiles.call(this, fileStructure.directory);
    fileStructure.directory.open = true;
    return fileStructure;
}

function getOpenDirectories () {
    return this.persistentStateService.get(OPEN_DIRECTORIES);
}

function restoreOpenDirectories (directory) {
    directory.directories.forEach(directory => {
        restoreOpenDirectories.call(this, directory);
    });
    directory.open = !!getOpenDirectories.call(this)[directory.path];
    return directory;
}

function getAllFiles (directory, allFiles = []) {
    directory.directories.forEach(directory => {
        allFiles = getAllFiles.call(this, directory, allFiles);
    });
    allFiles = allFiles.concat(directory.files);
    return allFiles;
}

export default angular.module('tractor.fileStructureService', [
    ComponentParserService.name,
    MockDataParserService.name,
    PersistentStateService.name
])
.service('fileStructureService', FileStructureService);
