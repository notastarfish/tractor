'use strict';

// Dependencies:
import angular from 'angular';
import ASTCreatorService from '../../../Core/Services/ASTCreatorService';

function createMockModelConstructor (
    astCreatorService
) {
    const step = Symbol();

    return class MockModel {
        constructor (_step) {
            this[step] = _step;

            this.actions = ['GET', 'POST', 'DELETE', 'PUT', 'HEAD', 'PATCH'];
            let [action] = this.actions;
            this.action = action;

            let [instance] = this.step.stepDefinition.mockDataInstances;
            this.data = instance;

            this.passThrough = false;
            this.url = '';
        }

        get step () {
            return this[step];
        }

        get ast () {
            return toAST.call(this);
        }
    }

    function toAST () {
        let data = {
            url: astCreatorService.literal(new RegExp(this.url))
        };
        let template = `httpBackend.when${this.action}(%= url %)`;
        if (this.passThrough) {
            template += '.passThrough(); ';
        } else {
            template += '.respond(%= dataName %); ';
            data.dataName = astCreatorService.identifier(this.data.variableName);
        }

        return astCreatorService.template(template, data);
    }
}

export default angular.module('mockModel', [
    ASTCreatorService.name
])
.factory('MockModel', createMockModelConstructor);
