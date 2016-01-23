'use strict';

// Dependencies:
import angular from 'angular';
import ArgumentModel from '../../ComponentEditor/Models/ArgumentModel';
import ASTCreatorService from '../../../Core/Services/ASTCreatorService';

function createTaskModelConstructor (
    astCreatorService,
    ArgumentModel
) {
    const action = Symbol();
    const args = Symbol();
    const component = Symbol();
    const step = Symbol();

    return class TaskModel {
        constructor (_step) {
            this[step] = _step;

            let [firstComponent] = this.step.stepDefinition.componentInstances;
            this.component = firstComponent;
        }

        get step () {
            return this[step];
        }

        get component () {
            return this[component];
        }
        set component (newComponent) {
            this[component] = newComponent;
            let [firstAction] = this.component.component.actions;
            this.action = firstAction;
        }

        get action () {
            return this[action];
        }
        set action (newAction) {
            this[action] = newAction;
            this[args] = parseArguments.call(this);
        }

        get arguments () {
            return this[args];
        }

        get ast () {
            return toAST.call(this);
        }
    }

    function toAST () {
        let template = '<%= component %>.<%= action %>(%= taskArguments %)';

        let action = astCreatorService.identifier(this.action.variableName);
        let component = astCreatorService.identifier(this.component.variableName);
        let taskArguments = this.arguments.map(argument => argument.ast);

        return astCreatorService.template(template, { action, component, taskArguments }).expression;
    }

    function parseArguments () {
        return this.action.parameters.map(parameter => {
            let name = parameter.name;
            name = name.replace(/([A-Z])/g, ' $1');
            name = `${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`;
            return new ArgumentModel(null, { name });
        });
    }
}

export default angular.module('tractor.taskModel', [
    ArgumentModel.name,
    ASTCreatorService.name
])
.factory('TaskModel', createTaskModelConstructor);
