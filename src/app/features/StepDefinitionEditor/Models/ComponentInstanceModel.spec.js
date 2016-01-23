/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';
import dedent from 'dedent';

// Test setup:
const expect = chai.expect;

// Dependencies:
import escodegen from 'escodegen';

// Testing:
import './ComponentInstanceModel';
let ComponentInstanceModel;

describe('ComponentInstanceModel.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.componentInstanceModel');

        angular.mock.inject((
            _ComponentInstanceModel_
        ) => {
            ComponentInstanceModel = _ComponentInstanceModel_;
        });
    });

    describe('ComponentInstanceModel constructor:', () => {
        it('should create a new `ComponentInstanceModel`', () => {
            let componentInstanceModel = new ComponentInstanceModel();

            expect(componentInstanceModel).to.be.an.instanceof(ComponentInstanceModel);
        });
    });

    describe('ComponentInstanceModel.component:', () => {
        it('should have a `component`', () => {
            let component = {};

            let componentInstanceModel = new ComponentInstanceModel(component);

            expect(componentInstanceModel.component).to.equal(component);
        });
    });

    describe('ComponentInstanceModel.stepDefinition:', () => {
        it('should have a `stepDefinition`', () => {
            let stepDefinition = {};

            let componentInstanceModel = new ComponentInstanceModel(null, stepDefinition);

            expect(componentInstanceModel.stepDefinition).to.equal(stepDefinition);
        });
    });

    describe('ComponentInstanceModel.name:', () => {
        it('should come from the Component', () => {
            let component = {
                name: 'Some component'
            };

            let componentInstanceModel = new ComponentInstanceModel(component);

            expect(componentInstanceModel.name).to.equal('Some component');
        });
    });

    describe('ComponentInstanceModel.variableName:', () => {
        it('should be the camelcase version of the name of the Component', () => {
            let component = {
                name: 'Some component'
            };

            let componentInstanceModel = new ComponentInstanceModel(component);

            expect(componentInstanceModel.variableName).to.equal('someComponent');
        });
    });

    describe('ComponentInstanceModel.meta:', () => {
        it('should get contain the full name of the ComponentInstance', () => {
            let component = {
                name: 'Some component'
            };

            let componentInstanceModel = new ComponentInstanceModel(component);

            expect(componentInstanceModel.meta).to.deep.equal({
                name: 'Some component'
            });
        });
    });

    describe('ComponentInstanceModel.ast:', () => {
        it('should be the AST of the ComponentInstance:', () => {
            let component = {
                name: 'Some component',
                path: '/some/path/to/component/Some component.component.js',
                variableName: 'SomeComponent'
            };
            let stepDefinition = {
                path: '/some/path/to/step-definition/Some step definition.step.js'
            };

            let componentInstanceModel = new ComponentInstanceModel(component, stepDefinition);
            let { ast } = componentInstanceModel;

            expect(escodegen.generate(ast)).to.equal(dedent(`
                var SomeComponent = require('../component/Some component.component.js'), someComponent = new SomeComponent();
            `));
        });

        it('should have a correct require path even on Windows', () => {
            let component = {
                name: 'Some component',
                path: 'C:\\some\\path\\to\\component\\Some component.component.js',
                variableName: 'SomeComponent'
            };
            let stepDefinition = {
                path: 'C:\\some\\path\\to\\step-definition\\Some step definition.step.js'
            };

            let componentInstanceModel = new ComponentInstanceModel(component, stepDefinition);
            let { ast } = componentInstanceModel;

            expect(escodegen.generate(ast)).to.equal(dedent(`
                var SomeComponent = require('../component/Some component.component.js'), someComponent = new SomeComponent();
            `));
        });
    });
});
