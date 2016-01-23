'use strict';

// Utilities:
import isVarName from 'is-var-name';

// Dependencies:
import angular from 'angular';

class ValidationService {
    validateVariableName (variableName) {
        return isVarName(variableName) ? variableName : false;
    }
}

export default angular.module('tractor.validationService', [])
.service('validationService', ValidationService);
