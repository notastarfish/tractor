'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var GherkinEditor = require('../GherkinEditor');

// Dependencies:
require('./StepDeclarationModel');
require('./ExampleModel');

var ScenarioModel = (function (
    StepDeclarationModel,
    ExampleModel,
    GherkinIndent,
    GherkinNewLine
) {
    var DEFAULTS = {
        name: 'Scenario'
    };

    var ScenarioModel = function ScenarioModel () {
        var stepDeclarations = [];
        var examples = [];

        Object.defineProperties(this, {
            stepDeclarations: {
                get: function () { return stepDeclarations; }
            },
            examples: {
                get: function () { return examples; }
            },
            exampleVariables: {
                get: function () { return getExampleVariables(this.stepDeclarations); }
            },
            feature: {
                get: function () { return toFeature.call(this); }
            }
        });

        this.name = DEFAULTS.name;
    };

    var getExampleVariables = function (stepDeclarations) {
        return _.chain(stepDeclarations)
        .pluck('step')
        .map(StepDeclarationModel.getExampleVariableNames)
        .flatten()
        .unique().value();
    };

    ScenarioModel.prototype.addStepDeclaration = function () {
        this.stepDeclarations.push(new StepDeclarationModel());
    };

    ScenarioModel.prototype.removeStepDeclaration = function (stepDeclaration) {
        _.remove(this.stepDeclarations, stepDeclaration);
    };

    ScenarioModel.prototype.addExample = function () {
        this.examples.push(new ExampleModel(this));
    };

    ScenarioModel.prototype.removeExample = function (example) {
        _.remove(this.examples, example);
    };

    ScenarioModel.prototype.setValidValue = function (property, value) {
        this[property] = value || DEFAULTS[property];
    };

    var toFeature = function () {
        var scenario = 'Scenario' + (this.examples.length ? ' Outline' : '') + ': ' + this.name;

        var stepDeclarations = _.map(this.stepDeclarations, function (stepDeclaration) {
            return GherkinIndent + GherkinIndent + stepDeclaration.feature;
        });

        var lines = [scenario, stepDeclarations];

        if (this.examples.length) {
            lines.push(GherkinIndent + GherkinIndent + 'Examples:');
            var variables = '| ' + this.exampleVariables.join(' | ') + ' |';
            lines.push(GherkinIndent + GherkinIndent + GherkinIndent + variables);
            _.each(this.examples, function (example) {
                lines.push(example.feature);
            }, this);
        }

        lines = _.flatten(lines);
        return lines.join(GherkinNewLine);
    };

    return ScenarioModel;
});

GherkinEditor.factory('ScenarioModel', function (
    StepDeclarationModel,
    ExampleModel,
    GherkinIndent,
    GherkinNewLine
) {
    return ScenarioModel(StepDeclarationModel, ExampleModel, GherkinIndent, GherkinNewLine);
});