'use strict';

// Dependencies:
import angular from 'angular';
import ASTCreatorService from '../../../Core/Services/ASTCreatorService';
import MethodModel from './MethodModel';

function createInteractionModelConstructor (
    astCreatorService,
    MethodModel
) {
    const action = Symbol();
    const element = Symbol();
    const method = Symbol();
    const methodInstance = Symbol();

    return class InteractionModel {
        constructor (_action) {
            this[action] = _action;
        }

        get action () {
            return this[action];
        }

        get element () {
            return this[element];
        }

        set element (newElement) {
            this[element] = newElement;
            let [method] = this.element.methods
            this.method = method;
        }

        get method () {
            return this[method];
        }

        set method (newMethod) {
            this[method] = newMethod;
            this[methodInstance] = new MethodModel(this, this.method);
        }

        get methodInstance () {
            return this[methodInstance];
        }

        get arguments () {
            return this.methodInstance.arguments;
        }

        get ast () {
            return toAST.call(this);
        }
    }

    function toAST () {
        let template = '<%= interaction %>';
        if (this.methodInstance.returns !== 'promise') {
            template = `new Promise(function (resolve) { resolve(${template}); });`;
        }

        let interaction = interactionAST.call(this);
        return astCreatorService.expression(template, { interaction });
    }

    function interactionAST () {
        let template = '<%= element %>';
        if (this.element.variableName !== 'browser') {
            template = `self.${template}`;
        }
        template += '.<%= method %>(%= argumentValues %);';

        let element = astCreatorService.identifier(this.element.variableName);
        let method = astCreatorService.identifier(this.methodInstance.name);
        let argumentValues = this.methodInstance.arguments.map(argument => argument.ast);

        return astCreatorService.expression(template, { element, method, argumentValues });
    }
}

export default angular.module('interactionModel', [
    ASTCreatorService.name,
    MethodModel.name
])
.factory('InteractionModel', createInteractionModelConstructor);
