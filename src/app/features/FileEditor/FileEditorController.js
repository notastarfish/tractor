'use strict';

// Utilities:
import Promise from 'bluebird';

export default class FileEditorController {
    constructor (
        $state,
        confirmDialogService,
        persistentStateService,
        notifierService,
        fileService,
        FileModel,
        fileStructure,
        filePath
    ) {
        this.$state = $state;
        this.confirmDialogService = confirmDialogService;
        this.persistentStateService = persistentStateService;
        this.notifierService = notifierService;
        this.fileService = fileService;
        this.FileModel = FileModel;
        this.fileStructure = fileStructure;

        this.availableComponents = fileStructure.availableComponents;
        this.availableMockData = fileStructure.availableMockData;

        if (filePath) {
            let { path } = filePath;
            this.fileService.openFile({ path }, this.availableComponents, this.availableMockData)
            .then(file => this.fileModel = file);
        } else if (FileModel && !this.fileModel) {
            this.newFile();
        }
    }

    newFile () {
        if (this.fileModel) {
            this.$state.go('.', { file: null });
        }
        this.fileModel = new this.FileModel();
    }

    saveFile () {
        let path = null;
        let { data, name } = this.fileModel;

        this.fileService.getPath({ path: this.fileModel.path, name })
        .then((filePath) => {
            path = filePath.path;
            let exists = this.fileService.checkFileExists(this.fileStructure, path);

            if (exists) {
                this.confirmOverWrite = this.confirmDialogService.show();
                return this.confirmOverWrite.promise
                .finally(() => {
                    this.confirmOverWrite = null;
                });
            } else {
                return Promise.resolve();
            }
        })
        .then(() => this.fileService.saveFile({ data, path }))
        .then(() => this.fileService.getFileStructure())
        .then(fileStructure => {
            this.fileStructure = fileStructure;
            return this.fileService.openFile({ path }, this.availableComponents, this.availableMockData)
        })
        .then(file => this.fileModel = file)
        .catch(() => {
            this.notifierService.error('File was not saved.');
        });
    }

    showErrors () {
        let fileEditor = this.fileEditor;
        if (fileEditor.$invalid) {
            Object.keys(fileEditor.$error).forEach((invalidType) => {
                fileEditor.$error[invalidType].forEach((element) => {
                    element.$setTouched();
                });
            });
            this.notifierService.error(`Can't save file, something is invalid.`);
        }
        return !fileEditor.$invalid;
    }

    minimise (item) {
        item.minimised = !item.minimised;

        let displayState = this.persistentStateService.get(this.fileModel.name);
        displayState[item.name] = item.minimised;
        this.persistentStateService.set(this.fileModel.name, displayState);
    }
}
