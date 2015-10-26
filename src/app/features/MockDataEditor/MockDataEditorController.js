'use strict';

// Dependencies:
import angular from 'angular';
import ConfirmDialogService from '../../Core/Services/ConfirmDialogService';
import FileEditorController from '../FileEditor/FileEditorController';
import MockDataFileService from './Services/MockDataFileService';
import MockDataModel from './Models/MockDataModel';
import NotifierService from '../../Core/Components/Notifier/NotifierService';
import PersistentStateService from '../../Core/Services/PersistentStateService';

class MockDataEditorController extends FileEditorController {
    constructor (
        $state,
        confirmDialogService,
        persistentStateService,
        notifierService,
        mockDataFileService,
        MockDataModel,
        mockDataFileStructure,
        mockDataPath
    ) {
        super(
            $state,
            confirmDialogService,
            persistentStateService,
            notifierService,
            MockDataFileService,
            MockDataModel,
            mockDataFileStructure,
            mockDataPath
        );
    }
}

export default angular.module('mockDataEditorController', [
    ConfirmDialogService.name,
    MockDataFileService.name,
    MockDataModel.name,
    NotifierService.name,
    PersistentStateService.name
])
.controller('MockDataEditorController', MockDataEditorController);
