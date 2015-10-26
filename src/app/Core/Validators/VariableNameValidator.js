'use strict';

// Constants:
const MODEL_CHANGE_EVENT = 'VariableNameValidator:ModelChange';

// Utilities:
import changecase from 'change-case';

// Dependencies:
import angular from 'angular';
import ValidationService from '../Services/ValidationService';

class VariableNameValidator {
    constructor (
        $rootScope,
        validationService
    ) {
        this.$rootScope = $rootScope;
        this.validationService = validationService;

        this.restrict = 'A';
        this.require = 'ngModel';

        this.scope = {
            variableValue: '=ngModel',
            variableNameModel: '='
        };
    }

    link ($scope, element, attrs, ngModelController) {
        let destroy = this.$rootScope.$on(MODEL_CHANGE_EVENT, (event, changing) => {
            if (ngModelController !== changing) {
                ngModelController.$validate();
            }
        });
        $scope.$on('$destroy', () => destroy());
        $scope.$watch('variableValue', () => {
            this.$rootScope.$broadcast(MODEL_CHANGE_EVENT, ngModelController);
        });

        ngModelController.$validators.variableNameUnique = value => {
            let allVariableNames = $scope.variableNameModel.getAllVariableNames();
            return !allVariableNames.includes(value);
        };

        ngModelController.$validators.variableNameValid = value => {
            let variableName = $scope.$parent.isClass ? changecase.pascal(value) : changecase.camel(value);
            if (variableName.length === 0) {
                return false;
            }
            return this.validationService.validateVariableName(variableName);
        };
    }
}

export default angular.module('variableName', [
    ValidationService.name
])
.directive('variableName', VariableNameValidator);
