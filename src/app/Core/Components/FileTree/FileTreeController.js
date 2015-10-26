'use strict';

// Constants:
const ENTER_KEY_CODE = 13;

// Utilities:
import changecase from 'change-case';
import path from 'path';

// Dependencies:
import angular from 'angular';
import FileStructureService from '../../Services/FileStructureService';
import NotifierService from '../Notifier/NotifierService';

class FileTreeController {
    constructor (
        $state,
        $interval,
        $window,
        notifierService,
        fileStructureService
    ) {
        this.$state = $state;
        this.$interval = $interval;
        this.$window = $window;
        this.notifierService = notifierService;
        this.fileStructureService = fileStructureService;

        this.headerName = changecase.title(this.type);
        this.canModify = this.type !== 'step-definitions';

        this.editFilePath = this.editFilePath.bind(this);
    }

    getName (item) {
        if (item.ast) {
            let [metaComment] = item.ast.comments;
            let meta = JSON.parse(metaComment.value);
            return meta.name;
        }
        return item.name;
    }

    addDirectory (directory) {
        let { path } = directory;
        this.fileStructureService.addDirectory(this.type, { path })
        .then(setFileStructure.bind(this));
    }

    editName (item) {
        if (this.canModify || item.isDirectory) {
            item.editingName = true;
            item.previousName = item.name;
            this.hideOptions(item);
        }
    }

    saveNewName (item) {
        item.editingName = false;

        let valid = true;
        if (item.name.includes('_')) {
            this.notifierService.error('Invalid character: "_"');
            valid = false;
        }
        if (item.name.includes('/')) {
            this.notifierService.error('Invalid character: "/"');
            valid = false;
        }
        if (item.name.includes('\\')) {
            this.notifierService.error('Invalid character: "\\"');
            valid = false;
        }
        if (!item.name.trim().length) {
            valid = false;
        }

        if (!valid) {
            item.name = item.previousName;
        }

        if (item.name !== item.previousName) {
            let directoryPath = getDirname(item.path);
            let oldName = item.previousName;
            let newName = item.name;

            let options = { directoryPath, oldName, newName }

            let isDirectory = !!item.isDirectory;
            if (isDirectory) {
                this.fileStructureService.editDirectoryPath(this.type, options)
                .then(setFileStructure.bind(this));
            } else {
                this.fileStructureService.editFilePath(this.type, options)
                .then(setFileStructure.bind(this));
            }
        }
    }

    renameOnEnter ($event, item) {
        if ($event.keyCode === ENTER_KEY_CODE) {
            this.saveNewName(item);
        }
    }

    openFile (file) {
        let directoryPath = this.model.fileStructure.directory.path.replace(/\\/g, '/');
        let filePath = file.path.replace(/\\/g, '/');
        let name = path.relative(directoryPath, filePath);
        name = name.substring(0, name.indexOf('.'));
        let params = {
            file: { name }
        };
        this.$state.go(`tractor.${this.type}`, params);
    }

    editFilePath (file, directory) {
        let { name } = file
        let oldDirectoryPath = getDirname(file.path);
        let newDirectoryPath = directory.path;
        if (oldDirectoryPath !== newDirectoryPath) {
            let options = { oldDirectoryPath, newDirectoryPath, name };
            this.fileStructureService.editFilePath(this.type, options)
            .then(setFileStructure.bind(this));
        }
    }

    toggleOpenDirectory (item) {
        item.open = !item.open;
        this.fileStructureService.toggleOpenDirectory(item.path);
    }

    showOptions (item) {
        item.showOptions = true;
    }

    hideOptions (item) {
        item.showOptions = false;
    }

    delete (item) {
        this.hideOptions(item);

        let hasChildren = item.files && item.files.length || item.directories && item.directories.length;

        if (!hasChildren || this.$window.confirm('All directory contents will be deleted as well. Continue?')) {
            let { name, path } = item;
            let deleteOptions = { path, name };
            if (item.isDirectory) {
                this.fileStructureService.deleteDirectory(this.type, deleteOptions)
                .then(setFileStructure.bind(this));
            } else {
                this.fileStructureService.deleteFile(this.type, deleteOptions)
                .then(setFileStructure.bind(this));
            }
        }
    }

    copy (item) {
        let { path } = item;
        this.fileStructureService.copyFile(this.type, { path })
        .then(setFileStructure.bind(this));
    }
}

function setFileStructure (fileStructure) {
    this.model.fileStructure = fileStructure;
}

function getDirname (filePath) {
    // Sw33t hax()rz to get around the browserify "path" shim not working on Windows.
    let haxedFilePath = filePath.replace(/\\/g, '/');
    let dirname = path.dirname(haxedFilePath);
    if (haxedFilePath !== filePath) {
        dirname = dirname.replace(/\//g, '\\');
    }
    return dirname;
}

export default angular.module('fileTreeController', [
    FileStructureService.name,
    NotifierService.name
])
.controller('FileTreeController', FileTreeController);
