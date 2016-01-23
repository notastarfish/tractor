'use strict';

// Dependencies:
import angular from 'angular';
import ConfirmDialogService from '../../Core/Services/ConfirmDialogService';
import FeatureFileService from './Services/FeatureFileService';
import FeatureModel from './Models/FeatureModel';
import FileEditorController from '../FileEditor/FileEditorController';
import NotifierService from '../../Core/Components/Notifier/NotifierService';
import PersistentStateService from '../../Core/Services/PersistentStateService';

class FeatureEditorController extends FileEditorController {
    constructor (
        $state,
        confirmDialogService,
        persistentStateService,
        notifierService,
        featureFileService,
        FeatureModel,
        featureFileStructure,
        featurePath
    ) {
        super(
            $state,
            confirmDialogService,
            persistentStateService,
            notifierService,
            featureFileService,
            FeatureModel,
            featureFileStructure,
            featurePath
        );
    }
}

export default angular.module('featureEditorController', [
    ConfirmDialogService.name,
    FeatureFileService.name,
    FeatureModel.name,
    NotifierService.name,
    PersistentStateService.name
])
.constant('FeatureIndent', '  ')
.constant('FeatureNewLine', '\n')
.controller('FeatureEditorController', FeatureEditorController);
