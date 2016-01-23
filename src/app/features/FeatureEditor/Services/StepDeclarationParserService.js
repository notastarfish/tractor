'use strict';

// Utilities:
import assert from 'assert';

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
        try {
            let stepDeclaration = new this.StepDeclarationModel();

            parseStepDeclaration(stepDeclaration, tokens);

            return stepDeclaration;
        } catch (e) {
            console.warn('Invaid step declarartion:', tokens);
            return null;
        }
    }
}

function parseStepDeclaration (stepDeclaration, tokens) {
    stepDeclaration.type = tokens.type;
    assert(stepDeclaration.type);
    stepDeclaration.step = tokens.step;
    assert(stepDeclaration.step);
}

export default angular.module('tractor.stepDeclarationParserService', [
    StepDeclarationModel.name
])
.service('stepDeclarationParserService', StepDeclarationParserService);
