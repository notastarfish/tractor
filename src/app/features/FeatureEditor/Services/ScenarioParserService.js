'use strict';

// Utilities:
import assert from 'assert';

// Dependencies:
import angular from 'angular';
import ExampleParserService from './ExampleParserService';
import ScenarioModel from '../Models/ScenarioModel';
import StepDeclarationParserService from './StepDeclarationParserService';

class ScenarioParserService {
    constructor (
        exampleParserService,
        ScenarioModel,
        stepDeclarationParserService
    ) {
        this.exampleParserService = exampleParserService;
        this.ScenarioModel = ScenarioModel;
        this.stepDeclarationParserService = stepDeclarationParserService;
    }

    parse (feature, tokens) {
        let scenario = new this.ScenarioModel();

        scenario.name = tokens.name;

        tokens.stepDeclarations.forEach((stepDeclaration, index) => {
            let notStep = false;

            try {
                let parsedStepDeclaration = this.stepDeclarationParserService.parse(stepDeclaration);
                assert(parsedStepDeclaration);
                scenario.stepDeclarations.push(parsedStepDeclaration);
            } catch (e) {
                notStep = true;
            }

            if (notStep) {
                console.log(stepDeclaration, index);
            }
        });

        tokens.examples.forEach((example, index) => {
            let notExample = false;

            try {
                let parsedExample = this.exampleParserService.parse(scenario, example);
                assert(parsedExample);
                scenario.examples.push(parsedExample);
            } catch (e) {
                notExample = true;
            }

            if (notExample) {
                console.log(example, index);
            }
        });

        return scenario;
    }
}

export default angular.module('scenarioParserService', [
    ExampleParserService.name,
    ScenarioModel.name,
    StepDeclarationParserService.name
])
.service('ScenarioParserService', ScenarioParserService);
