'use strict';

// Dependencies
import angular from 'angular';
import StepDeclarationModel from '../Models/StepDeclarationModel';

class StepDeclarationParserService {
    constructor (
        StepDeclarationModel
    ) {
        this.StepDeclarationModel = StepDeclarationModel;
    }

    parse (tokens) {
        let stepDeclaration = new this.StepDeclarationModel();

        stepDeclaration.type = tokens.type;
        stepDeclaration.step = tokens.step;

        return stepDeclaration;
    }
}

export default angular.module('stepDeclarationParserService', [
    StepDeclarationModel.name
])
.service('StepDeclarationParserService', StepDeclarationParserService);
