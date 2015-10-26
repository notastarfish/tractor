'use strict';

// Dependencies:
import angular from 'angular';
import ComponentModel from './Models/ComponentModel';
import ComponentFileService from './Services/ComponentFileService';
import ConfirmDialogService from '../../Core/Services/ConfirmDialogService';
import FileEditorController from '../FileEditor/FileEditorController';
import NotifierService from '../../Core/Components/Notifier/NotifierService';
import PersistentStateService from '../../Core/Services/PersistentStateService';

class ComponentEditorController extends FileEditorController {
    constructor (
        $state,
        confirmDialogService,
        persistentStateService,
        notifierService,
        componentFileService,
        ComponentModel,
        componentFileStructure,
        componentPath
    ) {
        super(
            $state,
            confirmDialogService,
            persistentStateService,
            notifierService,
            componentFileService,
            ComponentModel,
            componentFileStructure,
            componentPath
        );
        this.component = this.fileModel;
    }
}

export default angular.module('componentEditorController', [
    ComponentModel.name,
    ComponentFileService.name,
    ConfirmDialogService.name,
    NotifierService.name,
    PersistentStateService.name
])
.controller('ComponentEditorController', ComponentEditorController);
