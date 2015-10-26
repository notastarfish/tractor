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
        try {
            let feature = new this.FeatureModel({
                isSaved: true,
                path: featureFile.path
            });

            let [featureTokens] = featureFile.tokens;
            feature.name = featureTokens.name;
            feature.inOrderTo = featureTokens.inOrderTo;
            feature.asA = featureTokens.asA;
            feature.iWant = featureTokens.iWant;

            featureTokens.elements.forEach((element, index) => {
                try {
                    let parsedScenario = this.scenarioParserService.parse(feature, element);
                    assert(parsedScenario);
                    feature.scenarios.push(parsedScenario);
                    return;
                } catch (e) {}

                console.warn('Invalid Feature:', element, index);
            });

            return feature;
        } catch (e) {
            return new this.FeatureModel();
        }
    }
}

export default angular.module('featureParserService', [
    FeatureModel.name,
    ScenarioParserService.name
])
.service('featureParserService', FeatureParserService);
