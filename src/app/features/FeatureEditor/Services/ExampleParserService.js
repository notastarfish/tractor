'use strict';

// Dependencies:
import angular from 'angular';
import ExampleModel from '../Models/ExampleModel';

class ExampleParserService {
    constructor (
        ExampleModel
    ) {
        this.ExampleModel = ExampleModel;
    }

    parse (scenario, tokens) {
        try {
            let example = new this.ExampleModel(scenario);

            scenario.exampleVariables.forEach((variable, index) => {
                example.values[variable] = tokens[index].replace(/^"/, '').replace(/"$/, '');
            });

            return example;
        } catch (e) {
            console.warn('Invalid example:', tokens);
            return null;
        }
    }
}

export default angular.module('tractor.exampleParserService', [
    ExampleModel.name
])
.service('exampleParserService', ExampleParserService);
