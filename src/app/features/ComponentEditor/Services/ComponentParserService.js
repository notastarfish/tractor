'use strict';

// Utilities:
import assert from 'assert';

// Dependencies:
import angular from 'angular';
import ActionParserService from '../Services/ActionParserService';
import ComponentModel from '../Models/ComponentModel';
import ElementParserService from '../Services/ElementParserService';
import PersistentStateService from '../../../Core/Services/PersistentStateService';

class ComponentParserService {
    constructor (
        actionParserService,
        ComponentModel,
        elementParserService,
        persistentStateService
    ) {
        this.actionParserService = actionParserService;
        this.ComponentModel = ComponentModel;
        this.elementParserService = elementParserService;
        this.persistentStateService = persistentStateService;
    }

    parse (componentFile) {
        try {
            let { ast } = componentFile;
            let [metaComment] = ast.comments;
            let meta = JSON.parse(metaComment.value);

            let component = new this.ComponentModel({
                isSaved: true,
                path: componentFile.path
            });
            component.name = meta.name;
            let state = this.persistentStateService.get(component.name);

            let [componentModuleExpressionStatement] = ast.body;
            let moduleBlockStatement = componentModuleExpressionStatement.expression.right.callee.body;

            moduleBlockStatement.body.forEach((statement, index) => {
                try {
                    assert(statement.argument.name);
                    return;
                } catch (e) {}

                try {
                    let [constructorDeclarator] = statement.declarations;
                    let constructorBlockStatement = constructorDeclarator.init.body;
                    constructorBlockStatement.body.forEach((statement) => {
                        let domElement = this.elementParserService.parse(component, statement);
                        assert(domElement);
                        domElement.name = meta.elements[component.domElements.length].name;
                        domElement.minimised = !!state[domElement.name];
                        component.elements.push(domElement);
                        component.domElements.push(domElement);
                    });
                    return;
                } catch (e) {}

                try {
                    let actionMeta = meta.actions[component.actions.length];
                    let action = this.actionParserService.parse(component, statement, actionMeta);
                    assert(action);
                    action.name = actionMeta.name;
                    action.minimised = !!state[action.name];
                    component.actions.push(action);
                    return;
                } catch (e) {}

                console.warn('Invalid Component:', statement, index);
            });

            return component;
        } catch (e) {
            return new this.ComponentModel();
        }
    }
}

export default angular.module('componentParserService', [
    ActionParserService.name,
    ComponentModel.name,
    ElementParserService.name,
    PersistentStateService.name
])
.service('componentParserService', ComponentParserService);
