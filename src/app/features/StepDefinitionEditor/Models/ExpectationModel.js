'use strict';

// Dependencies:
import angular from 'angular';
import ArgumentModel from '../../ComponentEditor/Models/ArgumentModel';
import ASTCreatorService from '../../../Core/Services/ASTCreatorService';
import StringToLiteralService from '../../../Core/Services/StringToLiteralService';

function createExpectationModelConstructor (
    ArgumentModel,
    astCreatorService,
    stringToLiteralService
) {
    const action = Symbol();
    const args = Symbol();
    const component = Symbol();
    const step = Symbol();

    return class ExpectationModel {
        constructor (_step) {
            this[step] = _step;

            let [componentInstance] = this.step.stepDefinition.componentInstances;
            this[component] = componentInstance;

            this.conditions = ['equal', 'contain'];
            let [condition] = this.conditions;
            this.condition = condition;

            this.value = '';
        }

        get step () {
            return this[step];
        }

        get component () {
            return this[component];
        }
        set component (newComponent) {
            this[component] = newComponent;
            let [firstAction] = this.component.component.actions
            this.action = firstAction;
        }

        get action () {
            return this[action];
        }
        set action (newAction) {
            this[action] = newAction;
            this[args] = parseArguments.call(this);
        }

        get ast () {
            return toAST.call(this);
        }
    }

    function toAST () {
        let template = 'expect(<%= component %>.<%= action %>(%= expectationArguments %)).to.eventually.<%= condition %>(<%= expectedResult %>); ';

        let expectationArguments = this.arguments.map(argument => argument.ast);
        let expectedResult = astCreatorService.literal(stringToLiteralService.toLiteral(this.value) || this.value);

        let action = astCreatorService.identifier(this.action.variableName);
        let component = astCreatorService.identifier(this.component.variableName);
        let condition = astCreatorService.identifier(this.condition);
        return astCreatorService.template(template, { action, component, condition, expectationArguments, expectedResult }).expression;
    }

    function parseArguments () {
        return this.action.parameters.map(parameter => {
            return new ArgumentModel(null, {
                name: parameter.name
            });
        });
    }
}

export default angular.module('expectationModel', [
    ArgumentModel.name,
    ASTCreatorService.name,
    StringToLiteralService.name
])
.factory('ExpectationModel', createExpectationModelConstructor);
