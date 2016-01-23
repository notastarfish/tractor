'use strict';

// Dependencies:
import angular from 'angular';
import ConfirmDialogService from '../../Core/Services/ConfirmDialogService';
import FileEditorController from '../FileEditor/FileEditorController';
import NotifierService from '../../Core/Components/Notifier/NotifierService';
import PersistentStateService from '../../Core/Services/PersistentStateService';
import StepDefinitionFileService from './Services/StepDefinitionFileService';

class StepDefinitionEditorController extends FileEditorController {
    constructor (
        $state,
        confirmDialogService,
        persistentStateService,
        notifierService,
        stepDefinitionFileService,
        stepDefinitionFileStructure,
        stepDefinitionPath
    ) {
        super(
            $state,
            confirmDialogService,
            persistentStateService,
            notifierService,
            stepDefinitionFileService,
            null,
            stepDefinitionFileStructure,
            stepDefinitionPath
        );
    }

    get canAddComponents () {
        return this.availableComponents.length > 0
            && this.fileModel.step.type !== 'Given';
    }

    get canAddMockData () {
        return this.availableMockData.length > 0
            && this.fileModel.step.type === 'Given';
    }

    get hasComponents () {
        return this.fileModel
            && this.fileModel.componentInstances
            && this.fileModel.componentInstances.length > 0;
    }

    get hasMockData () {
        return this.fileModel
            && this.fileModel.mockDataInstances
            && this.fileModel.mockDataInstances.length > 0;
    }

    get showTasksSection () {
        return this.hasComponents
            && this.fileModel.step.type === 'When';
    }

    get showExpectationsSection () {
        return this.hasComponents
            && this.fileModel.step.type === 'Then';
    }

    get showMockDataSection () {
        return this.fileModel.step.type === 'Given';
    }
}

export default angular.module('stepDefinitionEditorController', [
    ConfirmDialogService.name,
    NotifierService.name,
    PersistentStateService.name,
    StepDefinitionFileService.name
])
.controller('StepDefinitionEditorController', StepDefinitionEditorController);
