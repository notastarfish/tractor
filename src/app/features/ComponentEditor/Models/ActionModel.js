'use strict';

// Utilities:
import changecase from 'change-case';
import dedent from 'dedent';

// Dependencies:
import angular from 'angular';
import ASTCreatorService from '../../../Core/Services/ASTCreatorService';
import InteractionModel from './InteractionModel';
import ParameterModel from './ParameterModel';

// Symbols:
const component = Symbol();
const interactions = Symbol();
const parameters = Symbol();

function createActionModelConstructor (
    astCreatorService,
    InteractionModel,
    ParameterModel
) {
    return class ActionModel {
        constructor (_component) {
            this[component] = _component;
            this[interactions] = [];
            this[parameters] = [];

            this.name = '';
        }

        get component () {
            return this[component];
        }

        get interactions () {
            return this[interactions];
        }

        get parameters () {
            return this[parameters];
        }

        get variableName () {
            return changecase.camel(this.name);
        }

        get meta () {
            return {
                name: this.name,
                parameters: this.parameters.map(parameter => parameter.meta)
            };
        }

        get ast () {
            return toAST.call(this);
        }

        addParameter (parameter = new ParameterModel(this)) {
            this.parameters.push(parameter);
        }

        removeParameter (toRemove) {
            this.parameters.splice(this.parameters.findIndex(parameter => {
                return parameter === toRemove;
            }), 1);
        }

        addInteraction (interaction = new InteractionModel(this)) {
            interaction.element = interaction.element || this[component].browser;
            this.interactions.push(interaction);
        }

        removeInteraction (toRemove) {
            this.interactions.splice(this.interactions.findIndex(interaction => {
                return interaction === toRemove;
            }), 1);
        }

        getAllVariableNames () {
            return this[component].getAllVariableNames(this);
        }
    }

    function toAST () {
        let component = astCreatorService.identifier(this.component.variableName);
        let action = astCreatorService.identifier(this.variableName);
        let parameters = this.parameters.map(parameter => parameter.ast);
        let interactions = interactionsAST.call(this);

        let template = '<%= component %>.prototype.<%= action %> = function (%= parameters %) {';
        if (interactions) {
            template += dedent(`
                var self = this;
                return <%= interactions %>;
            `);
        }
        template += '};';

        return astCreatorService.expression(template, { component, action, parameters, interactions });
    }

    function interactionsAST () {
        let template = '';
        let fragments = {};
        this.interactions.reduce((previousInteraction, interaction, index) => {
            let interactionTemplate = `<%= interaction${index} %>`;

            if (template.length) {
                template += dedent(`
                    .then(function (%= parameter${index} %) {
                        return ${interactionTemplate};
                    })
                `);
            } else {
                template += interactionTemplate;
            }

            fragments[`interaction${index}`] = interaction.ast;
            fragments[`parameter${index}`] = [];

            let previousResult = previousInteractionResult(previousInteraction);
            if (previousResult) {
                let parameter = astCreatorService.identifier(previousResult);
                fragments[`parameter${index}`].push(parameter);
            }

            return interaction;
        }, {});

        return astCreatorService.expression(template, fragments);
    }

    function previousInteractionResult (previous) {
        let returns = previous && previous.method && previous.method.returns;
        if (returns && previous.method[returns]) {
            return previous.method[returns].name;
        }
    }
}

export default angular.module('tractor.actionModel', [
    ASTCreatorService.name,
    InteractionModel.name,
    ParameterModel.name
])
.factory('ActionModel', createActionModelConstructor);
