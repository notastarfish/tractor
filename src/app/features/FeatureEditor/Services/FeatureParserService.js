'use strict';

// Utilities:
import assert from 'assert';

// Dependencies:
import angular from 'angular';
import FeatureModel from '../Models/FeatureModel';
import ScenarioParserService from './ScenarioParserService';

class FeatureParserService {
    constructor (
        FeatureModel,
        scenarioParserService
    ) {
        this.FeatureModel = FeatureModel;
        this.scenarioParserService = scenarioParserService;
    }

    parse (featureFile) {
        let { tokens } = featureFile;
        try {
            let feature = new this.FeatureModel({
                isSaved: true,
                path: featureFile.path
            });

            let [featureTokens] = tokens;

            parseFeature(feature, featureTokens);

            let parsers = [parseScenarios];
            tryParse.call(this, feature, featureTokens, parsers);

            return feature;
        } catch (e) {
            console.warn('Invalid feature:', tokens);
            return null;
        }
    }
}

function parseFeature (feature, tokens) {
    feature.name = tokens.name;
    assert(feature.name);
    feature.inOrderTo = tokens.inOrderTo;
    assert(feature.inOrderTo);
    feature.asA = tokens.asA;
    assert(feature.asA);
    feature.iWant = tokens.iWant;
    assert(feature.iWant);
}

function tryParse (feature, tokens, parsers) {
    let parsed = parsers.some(parser => {
        try {
            return parser.call(this, feature, tokens);
        } catch (e) { }
    });
    if (!parsed) {
        throw new Error();
    }
}

function parseScenarios (feature, tokens) {
    tokens.elements.forEach((element) => {
        let parsedScenario = this.scenarioParserService.parse(element);
        assert(parsedScenario);
        feature.scenarios.push(parsedScenario);
    });
    return true;
}

export default angular.module('tractor.featureParserService', [
    FeatureModel.name,
    ScenarioParserService.name
])
.service('featureParserService', FeatureParserService);
