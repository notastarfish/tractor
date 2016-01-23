'use strict';

// Dependencies:
import angular from 'angular';
import ASTCreatorService from '../../../Core/Services/ASTCreatorService';
import ComponentInstanceModel from './ComponentInstanceModel';
import MockDataInstanceModel from './MockDataInstanceModel';

function createStepDefinitionModelConstructor (
    astCreatorService,
    componentFileService,
    ComponentInstanceModel,
    mockDataFileService,
    MockDataInstanceModel
) {
    const components = Symbol();
    const componentInstances = Symbol();
    const mockData = Symbol();
    const mockDataInstances = Symbol();
    const options = Symbol();

    return class StepDefinitionModel {
        constructor (_options = {}) {
            this[options] = _options;

            this[components] = [];
            this[componentInstances] = [];

            this[mockData] = [];
            this[mockDataInstances] = [];
        }

        get availableComponents () {
            return this[options].availableComponents || [];
        }

        get availableMockData () {
            return this[options].availableMockData || [];
        }

        get path () {
            return this[options].path;
        }

        get components () {
            return this[components];
        }

        get componentInstances () {
            return this[componentInstances];
        }

        get mockData () {
            return this[mockData];
        }

        get mockDataInstances () {
            return this[mockDataInstances];
        }

        get meta () {
            return JSON.stringify({
                name: this.name,
                components: this.componentInstances.map(component => component.meta),
                mockData: this.mockDataInstances.map(mockData => mockData.meta)
            });
        }

        get ast () {
            return toAST.call(this);
        }

        get data () {
            return this.ast;
        }

        addComponent (name) {
            let component = this.availableComponents.find(component => component.name === name);
            if (component && !this.components.includes(component)) {
                this.components.push(component);
                this.componentInstances.push(new ComponentInstanceModel(component, this));
            }
        }

        removeComponent (toRemove) {
            let index = this.componentInstances.indexOf(toRemove);
            this.componentInstances.splice(index, 1);
            this.components.splice(index, 1);
        }

        addMock (name) {
            let mockData = this.availableMockData.find(mockData => mockData.name === name);
            if (mockData && !this.mockData.includes(mockData)) {
                this.mockData.push(mockData);
                this.mockDataInstances.push(new MockDataInstanceModel(mockData, this));
            }
        }

        removeMock (toRemove) {
            let index = this.mockDataInstances.indexOf(toRemove);
            this.mockDataInstances.splice(index, 1);
            this.mockData.splice(index, 1);
        }
    }

    function toAST () {
        let components = this.componentInstances.map(component => component.ast);
        let mockData = this.mockDataInstances.map(mockData => mockData.ast);

        let template = 'module.exports = function () { ';
        if (components.length) {
            template += '%= components %; ';
        }
        if (mockData.length) {
            template += '%= mockData %; ';
        }
        template += '%= step %; ';
        template += '};';

        let step = this.step.ast;
        return astCreatorService.file(astCreatorService.expression(template, { components, mockData, step }), this.meta);
    }
}

export default angular.module('tractor.stepDefinitionModel', [
    ASTCreatorService.name,
    ComponentInstanceModel.name,
    MockDataInstanceModel.name
])
.factory('StepDefinitionModel', createStepDefinitionModelConstructor);
