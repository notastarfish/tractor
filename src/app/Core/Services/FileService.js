'use strict';

export default class FileService {
    constructor (
        $http,
        parserService,
        fileStructureService,
        type
    ) {
        this.$http = $http;
        this.parserService = parserService;
        this.fileStructureService = fileStructureService;
        this.type = type;
    }

    checkFileExists (fileStructure, filePath) {
        return !!findFileByPath(fileStructure, filePath);
    }

    getFileStructure () {
        return this.fileStructureService.getFileStructure(this.type);
    }

    getPath (params) {
        if (params.name) {
            params.name = decodeURIComponent(params.name);
        }
        return this.$http.get(`/${this.type}/file/path`, { params });
    }

    openFile (params, availableComponents, availableMockData) {
        if (params.path) {
            params.path = decodeURIComponent(params.path);
        }
        return this.$http.get(`/${this.type}/file`, { params })
        .then((file) => {
            return this.parserService.parse(file, availableComponents, availableMockData);
        });
    }

    saveFile (options) {
        return this.$http.put(`/${this.type}/file`, options);
    }
}

function findFileByPath (fileStructure, filePath) {
    return fileStructure.directory.allFiles.find((file) => {
        return file.path.includes(filePath) || file.path.includes(filePath.replace(/\//g, '\\'));
    });
}
