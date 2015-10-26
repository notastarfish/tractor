'use strict';

// Utilities:
import assert from 'assert';

// Dependencies:
import angular from 'angular';
import ArgumentParserService from './ArgumentParserService';
import InteractionModel from '../Models/InteractionModel';

class InteractionParserService {
    constructor (
        argumentParserService,
        InteractionModel
    ) {
        this.argumentParserService = argumentParserService;
        this.InteractionModel = InteractionModel;
    }

    parse (action, astObject) {
        let interaction = new this.InteractionModel(action);

        let notFirstWrappedPromiseInteraction = false;
        let notFirstOwnPromiseInteraction = false;
        let notWrappedPromiseInteraction = false;
        let notOwnPromiseInteraction = false;
        let notValidInteraction = false;

        try {
            assert(astObject.argument.callee.object.callee);
            this.parse(action, {
                argument: astObject.argument.callee.object
            });
        } catch (e) {}

        let interactionCallExpression;

        try {
            let [wrappedThenFunctionExpression] = astObject.argument.arguments;
            let [interactionResolveExpressionStatement] = wrappedThenFunctionExpression.body.body;
            [interactionCallExpression] = interactionResolveExpressionStatement.expression.arguments;
        } catch (e) {
            notFirstWrappedPromiseInteraction = true;
        }

        try {
            if (notFirstWrappedPromiseInteraction) {
                interactionCallExpression = astObject.argument;
                assert(!interactionCallExpression.callee.object.callee);
            }
        } catch (e) {
            notFirstOwnPromiseInteraction = true;
        }

        try {
            if (notFirstOwnPromiseInteraction) {
                let [wrappedThenFunctionExpression] = astObject.argument.arguments;
                let [wrappedNewPromiseReturnStatement] = wrappedThenFunctionExpression.body.body;
                let [wrappedResolveFunctionExpression] = wrappedNewPromiseReturnStatement.argument.arguments;
                let [interactionResolveExpressionStatement] = wrappedResolveFunctionExpression.body.body;
                [interactionCallExpression] = interactionResolveExpressionStatement.expression.arguments;
            }
        } catch (e) {
            notWrappedPromiseInteraction = true;
        }

        try {
            if (notWrappedPromiseInteraction) {
                let [wrappedThenFunctionExpression] = astObject.argument.arguments;
                let [interactionReturnStatement] = wrappedThenFunctionExpression.body.body;
                interactionCallExpression = interactionReturnStatement.argument;
            }
        } catch (e) {
            notOwnPromiseInteraction = true;
        }

        try {
            if (interactionCallExpression.callee.object.name === 'browser') {
                interaction.element = action.component.browser;
            } else {
                interaction.element = action.component.elements.find(element => {
                    return element.variableName === interactionCallExpression.callee.object.property.name;
                });
            }
            assert(interaction.element);
            interaction.method = interaction.element.methods.find(elementAction => {
                return elementAction.name === interactionCallExpression.callee.property.name;
            });
            assert(interaction.method);
            let args = interactionCallExpression.arguments.map((argument, index) => {
                let arg = this.argumentParserService.parse(interaction.methodInstance, interaction.method.arguments[index], argument);
                assert(arg);
                let parameter = action.parameters.find(parameter => {
                    return parameter.variableName === arg.value;
                });
                if (parameter) {
                    arg.value = parameter.name;
                }
                return arg;
            });
            interaction.methodInstance.arguments = args;
            action.interactions.push(interaction);
        } catch (e) {
            notValidInteraction = true;
        }

        if (notFirstWrappedPromiseInteraction && notFirstOwnPromiseInteraction && notWrappedPromiseInteraction && notOwnPromiseInteraction && notValidInteraction) {
            console.log(astObject);
        }
    }
}

export default angular.module('interactionParserService', [
    ArgumentParserService.name,
    InteractionModel.name
])
.service('InteractionParserService', InteractionParserService);
