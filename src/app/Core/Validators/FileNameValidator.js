'use strict';

// Dependencies:
import angular from 'angular';
import NotifierService from '../Components/Notifier/NotifierService';

class FileNameValidator {
    constructor (
        notifierService
    ) {
        this.notifierService = notifierService;

        this.restrict = 'A';
        this.require = 'ngModel';

        this.link = ($scope, $element, $attrs, ngModelController) => {
            ngModelController.$validators.fileName = function (value) {
                if (value.includes('_')) {
                    this.notifierService.error('Invalid character: "_"');
                    return false;
                }
                if (value.includes('/')) {
                    this.notifierService.error('Invalid character: "/"');
                    return false;
                }
                if (value.includes('\\')) {
                    this.notifierService.error('Invalid character: "\\"');
                    return false;
                }
                return true;
            };
        };
    }
}

export default angular.module('fileName', [
    NotifierService.name
])
.directive('fileName', (
    notifierService
) => new FileNameValidator(notifierService));
