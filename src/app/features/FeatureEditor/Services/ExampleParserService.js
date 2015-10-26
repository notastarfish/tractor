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
        let example = new this.ExampleModel(scenario);

        scenario.exampleVariables.forEach((variable, index) => {
            example.values[variable] = tokens[index].replace(/^"/, '').replace(/"$/, '');
        });

        return example;
    }
}

export default angular.module('exampleParserService', [
    ExampleModel.name
])
.service('ExampleParserService', ExampleParserService);
