'use strict';

// Dependencies:
import angular from 'angular';
import StepDeclarationModel from '../../features/FeatureEditor/Models/StepDeclarationModel';
import ValidationService from '../Services/ValidationService';

class ExampleNameValidator {
    constructor (
        ScenarioModel,
        validationService
    ) {
        this.ScenarioModel = ScenarioModel;
        this.validationService = validationService;

        this.restrict = 'A';
        this.require = 'ngModel';

        this.link = ($scope, $element, $attrs, ngModelController) => {
            ngModelController.$validators.exampleName = value => {
                let variableNames = this.ScenarioModel.getExampleVariableNames(value);
                return variableNames.filter(variableName => {
                    return this.validationService.validateVariableName(variableName);
                }).length === variableNames.length;
            };
        };
    }
}

export default angular.module('exampleName', [
    StepDeclarationModel.name,
    ValidationService.name
])
.directive('exampleName', (
    ScenarioModel,
    validationService
) => new ExampleNameValidator(ScenarioModel, validationService));
