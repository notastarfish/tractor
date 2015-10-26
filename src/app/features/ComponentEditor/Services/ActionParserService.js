'use strict';

// Utilities:
import assert from 'assert';

// Dependencies:
import angular from 'angular';
import ActionModel from '../Models/ActionModel';
import InteractionParserService from './InteractionParserService';
import ParameterParserService from './ParameterParserService';

class ActionParserService {
    constructor (
        ActionModel,
        interactionParserService,
        parameterParserService
    ) {
        this.ActionModel = ActionModel;
        this.interactionParserService = interactionParserService;
        this.parameterParserService = parameterParserService;
    }

    parse (component, astObject, meta) {
        let action = new this.ActionModel(component);

        let actionFunctionExpression = astObject.expression.right;
        let actionBody = actionFunctionExpression.body.body;

        actionFunctionExpression.params.forEach(param => {
            let parameter = this.parameterParserService.parse(action);
            assert(parameter);
            parameter.name = meta.parameters[action.parameters.length].name;
            action.parameters.push(parameter);
        });

        actionBody.forEach((statement, index) => {
            let notSelf = false;
            let notInteraction = false;

            try {
                let [selfVariableDeclarator] = statement.declarations;
                assert(selfVariableDeclarator.id.name === 'self');
            } catch (e) {
                notSelf = true;
            }

            try {
                if (notSelf) {
                    this.interactionParserService.parse(action, statement);
                }
            } catch (e) {
                notInteraction = true;
            }

            if (notSelf && notInteraction) {
                console.log(statement, index);
            }
        });

        return action;
    }
}

export default angular.module('actionParserService', [
    ActionModel.name,
    InteractionParserService.name,
    ParameterParserService.name
])
.service('actionParserService', ActionParserService);
