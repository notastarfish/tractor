'use strict';

// Dependencies:
import angular from 'angular';
import StepDeclarationModel from '../../features/FeatureEditor/Models/StepDeclarationModel';
import ValidationService from '../Services/ValidationService';

class ExampleNameValidator {
    constructor (
        StepDeclarationModel,
        validationService
    ) {
        this.StepDeclarationModel = StepDeclarationModel;
        this.validationService = validationService;

        this.restrict = 'A';
        this.require = 'ngModel';
    }

    link ($scope, $element, $attrs, ngModelController) {
        ngModelController.$validators.exampleName = value => {
            let variableNames = this.StepDeclarationModel.getExampleVariableNames(value);
            return variableNames.filter(variableName => {
                return this.validationService.validateVariableName(variableName);
            }).length === variableNames.length;
        };
    }
}

export default angular.module('exampleName', [
    StepDeclarationModel.name,
    ValidationService.name
])
.directive('exampleName', ExampleNameValidator);
