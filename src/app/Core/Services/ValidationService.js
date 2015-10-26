'use strict';

// Utilities:
import charFunk from 'charfunk';

// Dependencies:
import angular from 'angular';

class ValidationService {
    validateVariableName (variableName) {
        return charFunk.isValidName(variableName, true) ? variableName : false;
    }
}

export default angular.module('validationService', [])
.service('validationService', ValidationService);
