'use strict';

// Utilities:
import flatten from 'lodash.flatten';

// Dependencies:
import angular from 'angular';
import ScenarioModel from './ScenarioModel';

function createFeatureModelConstructor (
    FeatureIndent,
    FeatureNewLine,
    ScenarioModel
) {
    const scenarios = Symbol();

    return class FeatureModel {
        constructor (options = {}) {
            this.options = options;
            this[scenarios] = [];

            this.name = '';
            this.inOrderTo = '';
            this.asA = '';
            this.iWant = '';
        }

        get isSave () {
            return !!this.options.isSaved;
        }

        get path () {
            return this.options.path;
        }

        get scenarios () {
            return this[scenarios];
        }

        get featureString () {
            return toFeatureString.call(this);
        }

        get data () {
            return this.featureString;
        }

        addScenario () {
            this.scenarios.push(new ScenarioModel());
        }

        removeScenario (toRemove) {
            this.scenarios.splice(this.scenarios.findIndex(scenario => {
                return scenario === toRemove;
            }), 1);
        }
    }

    function toFeatureString () {
        let feature = `Feature: ${this.name}`;

        let inOrderTo = `${FeatureIndent}In order to ${this.inOrderTo}`;
        let asA = `${FeatureIndent}As a ${this.asA}`;
        let iWant = `${FeatureIndent}I want ${this.iWant}`;

        let scenarios = this.scenarios.map(scenario => {
            return `${FeatureIndent}${scenario.featureString}`;
        });

        let lines = flatten([feature, inOrderTo, asA, iWant, scenarios]);
        return lines.join(FeatureNewLine);
    }
}

export default angular.module('featureModel', [
    ScenarioModel.name
])
.factory('FeatureModel', createFeatureModelConstructor);
