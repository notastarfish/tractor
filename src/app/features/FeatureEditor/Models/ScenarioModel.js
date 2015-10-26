'use strict';

// Utilities:
import flatten from 'lodash.flatten';
import pluck from 'lodash.pluck';
import unique from 'lodash.unique';

// Dependencies:
import angular from 'angular';
import ExampleModel from './ExampleModel';
import StepDeclarationModel from './StepDeclarationModel';

function createScenarioModelConstructor (
    ExampleModel,
    FeatureIndent,
    FeatureNewLine,
    StepDeclarationModel
) {
    const stepDeclarations = Symbol();
    const examples = Symbol();

    return class ScenarioModel {
        constructor () {
            this[stepDeclarations] = [];
            this[examples] = [];

            this.name = '';
        }

        get stepDeclarations () {
            return this[stepDeclarations]
        }

        get examples () {
            return this[examples];
        }

        get exampleVariables () {
            return getExampleVariables.call(this, this.stepDeclarations);
        }

        get featureString () {
            return toFeatureString.call(this);
        }

        addStepDeclaration () {
            this.stepDeclarations.push(new StepDeclarationModel());
        }

        removeStepDeclaration (toRemove) {
            this.stepDeclarations.splice(this.stepDeclarations.findIndex(stepDeclaration => {
                return stepDeclaration === toRemove;
            }), 1);
        }

        addExample () {
            this.examples.push(new ExampleModel(this));
        }

        removeExample (toRemove) {
            this.examples.splice(this.examples.findIndex(example => {
                return example === toRemove;
            }), 1);
        }
    }

    function getExampleVariables (stepDeclarations) {
        return unique(flatten(pluck(stepDeclarations, 'step')
        .map(StepDeclarationModel.getExampleVariableNames)))
    }

    function toFeatureString () {
        let scenario = `Scenario${(this.examples.length ? ' Outline' : '')}: ${this.name}`;

        let stepDeclarations = this.stepDeclarations.map(stepDeclaration => {
            return `${FeatureIndent}${FeatureIndent}${stepDeclaration.feature}`;
        });

        let lines = [scenario, stepDeclarations];
        if (this.examples.length) {
            lines.push(`${FeatureIndent}${FeatureIndent}Examples:`);
            let variables = this.exampleVariables.join(' | ');
            lines.push(`${FeatureIndent}${FeatureIndent}${FeatureIndent}| ${variables} |`);
            this.examples.forEach(example => lines.push(example.feature));
        }

        lines = flatten(lines);
        return lines.join(FeatureNewLine);
    }
}

export default angular.module('scenarioModel', [
    ExampleModel.name,
    StepDeclarationModel.name
])
.factory('ScenarioModel', createScenarioModelConstructor);
