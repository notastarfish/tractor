'use strict';

// Utilities:
import Promise from 'bluebird';

// Dependencies:
import angular from 'angular';
import 'angular-messages';
import 'angular-mocks';
import 'angular-sanitize';
import 'angular-sortable';
import 'angular-ui-router';
import 'babel/polyfill';

import ActionDirective from './Core/Components/Action/ActionDirective';
import CheckboxDirective from './Core/Components/Checkbox/CheckboxDirective';
import ConfirmDialogDirective from './Core/Components/ConfirmDialog/ConfirmDialogDirective';
import DragFileDirective from './Core/Components/DragFile/DragFileDirective';
import DropFileDirective from './Core/Components/DropFile/DropFileDirective';
import FileTreeDirective from './Core/Components/FileTree/FileTreeDirective';
import GiveFocusDirective from './Core/Components/GiveFocus/GiveFocusDirective';
import LiteralInputDirective from './Core/Components/LiteralInput/LiteralInputDirective';
import NotifierDirective from './Core/Components/Notifier/NotifierDirective';
import PanelHandleDirective from './Core/Components/PanelHandle/PanelHandleDirective';
import SelectInputDirective from './Core/Components/SelectInput/SelectInputDirective';
import StepInputDirective from './Core/Components/StepInput/StepInputDirective';
import SubmitDirective from './Core/Components/Submit/SubmitDirective';
import TextInputDirective from './Core/Components/TextInput/TextInputDirective';
import VariableInputDirective from './Core/Components/VariableInput/VariableInputDirective';

import ExampleNameValidator from './Core/Validators/ExampleNameValidator';
import FileNameValidator from './Core/Validators/FileNameValidator';
import VariableNameValidator from './Core/Validators/VariableNameValidator';

import FileStructureService from './Core/Services/FileStructureService';
import HttpResponseInterceptor from './Core/Services/HttpResponseInterceptor';
import RealTimeService from './Core/Services/RealTimeService';

import ControlPanelController from './features/ControlPanel/ControlPanelController';
import controlPanelTemplate from './features/ControlPanel/ControlPanel.html';

import ComponentEditorController from './features/ComponentEditor/ComponentEditorController';
import ComponentFileService from './features/ComponentEditor/Services/ComponentFileService';
import componentEditorTemplate from './features/ComponentEditor/ComponentEditor.html';

import FeatureEditorController from './features/FeatureEditor/FeatureEditorController';
import FeatureFileService from './features/FeatureEditor/Services/FeatureFileService';
import featureEditorTemplate from './features/FeatureEditor/FeatureEditor.html';

import MockDataEditorController from './features/MockDataEditor/MockDataEditorController';
import MockDataFileService from './features/MockDataEditor/Services/MockDataFileService';
import mockDataEditorTemplate from './features/MockDataEditor/MockDataEditor.html';

import StepDefinitionEditorController from './features/StepDefinitionEditor/StepDefinitionEditorController';
import StepDefinitionFileService from './features/StepDefinitionEditor/Services/StepDefinitionFileService';
import stepDefinitionEditorTemplate from './features/StepDefinitionEditor/StepDefinitionEditor.html';

NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
angular.element.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

// Application Init:
let tractor = angular.module('tractor', [
    'ngMessages',
    'ui.router',
    'as.sortable',
    ActionDirective.name,
    CheckboxDirective.name,
    ConfirmDialogDirective.name,
    DragFileDirective.name,
    DropFileDirective.name,
    FileTreeDirective.name,
    GiveFocusDirective.name,
    LiteralInputDirective.name,
    NotifierDirective.name,
    PanelHandleDirective.name,
    SelectInputDirective.name,
    StepInputDirective.name,
    SubmitDirective.name,
    TextInputDirective.name,
    VariableInputDirective.name,
    ExampleNameValidator.name,
    FileNameValidator.name,
    VariableNameValidator.name,
    FileStructureService.name,
    HttpResponseInterceptor.name,
    RealTimeService.name,
    ControlPanelController.name,
    ComponentEditorController.name,
    ComponentFileService.name,
    FeatureEditorController.name,
    FeatureFileService.name,
    MockDataEditorController.name,
    MockDataFileService.name,
    StepDefinitionEditorController.name,
    StepDefinitionFileService.name
]);

tractor.config((
    $stateProvider,
    $locationProvider,
    $urlMatcherFactoryProvider,
    $urlRouterProvider
) => {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

    $urlMatcherFactoryProvider.type('TractorFile', {
        encode (toEncode) {
            return toEncode && toEncode.name ? toEncode.name.replace(/\s/g, '+') : '';
        },
        decode (toDecode) {
            return toDecode && angular.isString(toDecode) ? { name: toDecode.replace(/\+/g, ' ') } : toDecode;
        },
        is (tractorFile) {
            return !tractorFile || tractorFile && tractorFile.name;
        },
        equals (a, b) {
            return a && a.name && b && b.name && a.name === b.name;
        }
    });

    $stateProvider
    .state('tractor', {
        url: '/',
        template: controlPanelTemplate,
        controller: 'ControlPanelController as controlPanel'
    })
    .state('tractor.components', {
        url: 'components/{file:TractorFile}',
        template: componentEditorTemplate,
        controller: 'ComponentEditorController as componentEditor',
        resolve: {
            componentFileStructure (componentFileService) {
                return componentFileService.getFileStructure();
            },
            componentPath ($stateParams, componentFileService) {
                let name = $stateParams.file && $stateParams.file.name;
                return name ? componentFileService.getPath({ name }) : null;
            }
        }
    })
    .state('tractor.features', {
        url: 'features/{file:TractorFile}',
        template: featureEditorTemplate,
        controller: 'FeatureEditorController as featureEditor',
        resolve: {
            featureFileStructure (featureFileService) {
                return featureFileService.getFileStructure();
            },
            featurePath ($stateParams, featureFileService) {
                let name = $stateParams.file && $stateParams.file.name;
                return name ? featureFileService.getPath({ name }) : null;
            }
        }
    })
    .state('tractor.mock-data', {
        url: 'mock-data/{file:TractorFile}',
        template: mockDataEditorTemplate,
        controller: 'MockDataEditorController as mockDataEditor',
        resolve: {
            mockDataFileStructure (mockDataFileService) {
                return mockDataFileService.getFileStructure();
            },
            mockDataPath ($stateParams, mockDataFileService) {
                let name = $stateParams.file && $stateParams.file.name;
                return name ? mockDataFileService.getPath({ name }) : null;
            }
        }
    })
    .state('tractor.step-definitions', {
        url: 'step-definitions/{file:TractorFile}',
        template: stepDefinitionEditorTemplate,
        controller: 'StepDefinitionEditorController as stepDefinitionEditor',
        resolve: {
            stepDefinitionFileStructure (stepDefinitionFileService) {
                return stepDefinitionFileService.getFileStructure();
            },
            stepDefinitionPath ($stateParams, stepDefinitionFileService) {
                let name = $stateParams.file && $stateParams.file.name;
                return name ? stepDefinitionFileService.getPath({ name }) : null;
            }
        }
    });
})
.run(($rootScope) => {
    Promise.longStackTraces();
    Promise.setScheduler((callback) => {
        $rootScope.$evalAsync(callback);
    });
});

let $http = angular.injector(['ng']).get('$http');
$http.get('/config')
.then((response) => {
    tractor.constant('config', response.data);
    angular.bootstrap(document.body, ['tractor']);
});
