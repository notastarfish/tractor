/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';
import dedent from 'dedent';
import dirtyChai from 'dirty-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);

// Dependencies:
import escodegen from 'escodegen';

// Testing:
import './ComponentModel';
let ComponentModel;

describe('ComponentModel.js:', () => {
    let BrowserModel;
    let ElementModel;
    let FilterModel;
    let ActionModel;
    let InteractionModel;

    beforeEach(() => {
        angular.mock.module('tractor.componentModel');

        angular.mock.inject((
            _ComponentModel_,
            _BrowserModel_,
            _ElementModel_,
            _FilterModel_,
            _ActionModel_,
            _InteractionModel_
        ) => {
            ComponentModel = _ComponentModel_;
            BrowserModel = _BrowserModel_;
            ElementModel = _ElementModel_;
            FilterModel = _FilterModel_;
            ActionModel = _ActionModel_;
            InteractionModel = _InteractionModel_;
        });
    });

    describe('ComponentModel constructor:', () => {
        it('should create a new `ComponentModel`:', () => {
            let componentModel = new ComponentModel();
            expect(componentModel).to.be.an.instanceof(ComponentModel);
        });

        it('should have default properties:', () => {
            let componentModel = new ComponentModel();
            let [browser] = componentModel.elements;

            expect(browser).to.be.an.instanceof(BrowserModel);
            expect(componentModel.elements.length).to.equal(1);
            expect(componentModel.domElements.length).to.equal(0);
            expect(componentModel.actions.length).to.equal(0);
            expect(componentModel.name).to.equal('');
            expect(componentModel.meta).to.equal(JSON.stringify({
                name: '',
                elements: [],
                actions: []
            }));
        });
    });

    describe('ComponentModel.isSaved:', () => {
        it('should be false by default:', () => {
            let componentModel = new ComponentModel();

            expect(componentModel.isSaved).to.be.false();
        });

        it('should get the value from the given `options`:', () => {
            let options = {
                isSaved: true
            };
            let componentModel = new ComponentModel(options);

            expect(componentModel.isSaved).to.be.true();
        });
    });

    describe('ComponentModel.isSaved:', () => {
        it('should get the value from the given `options`:', () => {
            let options = {
                path: 'path'
            };
            let componentModel = new ComponentModel(options);

            expect(componentModel.path).to.equal('path');
        });
    });

    describe('ComponentModel.browser:', () => {
        it('should return the first element, which is always the `browser`:', () => {
            let componentModel = new ComponentModel();

            let [browser] = componentModel.elements;
            expect(componentModel.browser).to.equal(browser);
            expect(componentModel.browser).to.be.an.instanceof(BrowserModel);
        });
    });

    describe('ComponentModel.variableName:', () => {
        it('should turn the full name of the Component into a JS variable:', () => {
            let componentModel = new ComponentModel();

            componentModel.name = 'A long name that describes the Component.';
            expect(componentModel.variableName).to.equal('ALongNameThatDescribesTheComponent');
        });
    });

    describe('ComponentModel.meta:', () => {
        it('should contain the full name of the Component:', () => {
            let componentModel = new ComponentModel();

            componentModel.name = 'A long name that describes the Component.';
            expect(JSON.parse(componentModel.meta).name).to.equal('A long name that describes the Component.');
        });

        it('should contain the meta data for the Elements of the Component:', () => {
            let elementMeta = { name: 'element' };
            let element = { meta: elementMeta };

            let componentModel = new ComponentModel();
            componentModel.domElements.push(element);

            let [meta] = JSON.parse(componentModel.meta).elements;
            expect(meta).to.deep.equal(elementMeta);
        });

        it('should contain the meta data for the Actions of the Component:', () => {
            let actionMeta = { name: 'action' };
            let action = { meta: actionMeta };

            let componentModel = new ComponentModel();
            componentModel.actions.push(action);

            let [meta] = JSON.parse(componentModel.meta).actions;
            expect(meta).to.deep.equal(actionMeta);
        });
    });

    describe('ComponentModel.ast:', () => {
        it('should be the AST of the Component:', () => {
            let componentModel = new ComponentModel();
            componentModel.name = 'Component';
            let ast = componentModel.ast;

            expect(escodegen.generate(ast)).to.equal(dedent(`
                module.exports = function () {
                    var Component = function Component() {
                    };
                    return Component;
                }();
            `));
        });

        it('should include Elements of the Component:', () => {
            let componentModel = new ComponentModel();
            componentModel.name = 'Component';
            componentModel.addElement();
            let [element] = componentModel.domElements;
            element.name = 'element';
            let [filter] = element.filters;
            filter.type = 'binding';
            filter.locator = '{{ model.binding }}';
            let ast = componentModel.ast;

            expect(escodegen.generate(ast)).to.equal(dedent(`
                module.exports = function () {
                    var Component = function Component() {
                        this.element = element(by.binding('{{ model.binding }}'));
                    };
                    return Component;
                }();
            `));
        });

        it('should include Actions of the Component:', () => {
            let componentModel = new ComponentModel();
            componentModel.name = 'Component';
            componentModel.addAction();
            let [action] = componentModel.actions;
            action.name = 'action';
            let ast = componentModel.ast;

            expect(escodegen.generate(ast)).to.equal(dedent(`
                module.exports = function () {
                    var Component = function Component() {
                    };
                    Component.prototype.action = function () {
                        var self = this;
                        return new Promise(function (resolve) {
                            resolve(browser.get(null, null));
                        });
                    };
                    return Component;
                }();
            `));
        });
    });

    describe('ComponentModel.data:', () => {
        it('should be an alias for the AST of the Component:', () => {
            let componentModel = new ComponentModel();
            componentModel.name = 'Component';

            expect(componentModel.ast).to.deep.equal(componentModel.data);
        });
    });

    describe('ComponentModel.addElement:', () => {
        it('should add a new Element to the Component:', () => {
            let componentModel = new ComponentModel();
            componentModel.addElement();

            expect(componentModel.elements.length).to.equal(2);
            expect(componentModel.domElements.length).to.equal(1);
            let [element] = componentModel.domElements;
            expect(element).to.be.an.instanceof(ElementModel);
        });

        it('should add a new Filter to the new Element:', () => {
            let componentModel = new ComponentModel();
            componentModel.addElement();

            let [element] = componentModel.domElements;
            expect(element.filters.length).to.equal(1);
            let [filter] = element.filters;
            expect(filter).to.be.an.instanceof(FilterModel);
        });
    });

    describe('ComponentModel.removeElement:', () => {
        it('should remove a Element from the Component:', () => {
            let componentModel = new ComponentModel();
            componentModel.addElement();

            let [element] = componentModel.domElements;
            componentModel.removeElement(element);
            expect(componentModel.domElements.length).to.equal(0);
            expect(componentModel.elements.length).to.equal(1);
        });
    });

    describe('ComponentModel.addAction:', () => {
        it('should add a new Action to the Component:', () => {
            let componentModel = new ComponentModel();
            componentModel.addAction();

            expect(componentModel.actions.length).to.equal(1);
            let [action] = componentModel.actions;
            expect(action).to.be.an.instanceof(ActionModel);
        });

        it('should add a new Interaction to the new Action:', () => {
            let componentModel = new ComponentModel();
            componentModel.addAction();

            let [action] = componentModel.actions;
            expect(action.interactions.length).to.equal(1);
            let [interaction] = action.interactions;
            expect(interaction).to.be.an.instanceof(InteractionModel);
        });
    });

    describe('ComponentModel.removeAction:', () => {
        it('should remove a Action from the Component:', () => {
            let componentModel = new ComponentModel();
            componentModel.addAction();

            let [action] = componentModel.actions;
            componentModel.removeAction(action);
            expect(componentModel.actions.length).to.equal(0);
        });
    });

    describe('ComponentModel.getAllVariableNames:', () => {
        it('should return all the variables associated with this Component:', () => {
            let componentModel = new ComponentModel();
            componentModel.name = 'Component';
            componentModel.addElement();
            let [element] = componentModel.domElements;
            element.name = 'element';
            componentModel.addAction();
            let [action] = componentModel.actions;
            action.name = 'action';

            expect(componentModel.getAllVariableNames()).to.deep.equal(['browser', 'element', 'action']);
        });

        it('should exclude the variable name of the given from the list:', () => {
            let componentModel = new ComponentModel();
            componentModel.name = 'component';
            componentModel.addElement();
            let [element] = componentModel.domElements;
            element.name = 'element';
            componentModel.addAction();
            let [action] = componentModel.actions;
            action.name = 'action';

            expect(componentModel.getAllVariableNames(action)).to.deep.equal(['component', 'browser', 'element']);
        });
    });
});
