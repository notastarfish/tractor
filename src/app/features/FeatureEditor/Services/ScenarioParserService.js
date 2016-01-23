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

    parse (tokens) {
        try {
            let scenario = new this.ScenarioModel();

            parseScenario.call(this, scenario, tokens);

            let parsers = [parseStepDeclarations, parseExamples];
            tryParse.call(this, scenario, tokens, parsers);

            return scenario;
        } catch (e) {
            console.warn('Invalid scenario:', tokens);
            return null;
        }
    }
}

function parseScenario (scenario, tokens) {
    scenario.name = tokens.name;
    assert(scenario.name);
}

function tryParse (scenario, tokens, parsers) {
    let parsed = parsers.every(parser => {
        try {
            return parser.call(this, scenario, tokens);
        } catch (e) { }
    });
    if (!parsed) {
        throw new Error();
    }
}

function parseStepDeclarations (scenario, tokens) {
    tokens.stepDeclarations.forEach((stepDeclaration) => {
        let parsedStepDeclaration = this.stepDeclarationParserService.parse(stepDeclaration);
        assert(parsedStepDeclaration);
        scenario.stepDeclarations.push(parsedStepDeclaration);
    });
    return true;
}

function parseExamples (scenario, tokens) {
    tokens.examples.forEach((example) => {
        let parsedExample = this.exampleParserService.parse(scenario, example);
        assert(parsedExample);
        scenario.examples.push(parsedExample);
    });
    return true;
}

export default angular.module('tractor.scenarioParserService', [
    ExampleParserService.name,
    ScenarioModel.name,
    StepDeclarationParserService.name
])
.service('scenarioParserService', ScenarioParserService);
