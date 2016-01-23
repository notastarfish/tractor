/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Testing:
import './StepInputDirective';

describe('StepInputDirective.js:', () => {
    let $compile;
    let $rootScope;
    let ScenarioModel;

    beforeEach(() => {
        angular.module('StepDefinitionEditor', []);
        angular.mock.module('tractor.stepInput');

        ScenarioModel = {};
        angular.mock.module(($provide) => {
            $provide.factory('ScenarioModel', () => ScenarioModel);
        });

        angular.mock.inject((_$compile_, _$rootScope_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    const compileDirective = (template, scope) => {
        let directive = $compile(template)(scope);
        scope.$digest();
        return directive;
    };

    describe('Link function:', () => {
        it('should throw an error when "model" is not passed in:', () => {
            let scope = $rootScope.$new();

            expect(() => {
                compileDirective('<tractor-step-input></tractor-step-input>', scope);
            }).to.throw('The <tractor-step-input> directive requires a "model" attribute.');
        });

        it('should throw an error when "label" is not passed in:', () => {
            let scope = $rootScope.$new();
            scope.model = {};

            expect(() => {
                compileDirective('<tractor-step-input model="model"></tractor-step-input>', scope);
            }).to.throw('The <tractor-step-input> directive requires a "label" attribute.');
        });

        it('should throw an error when "form" is not passed in:', () => {
            let scope = $rootScope.$new();
            scope.model = {};

            expect(() => {
                compileDirective('<tractor-step-input model="model" label="Some label"></tractor-step-input>', scope);
            }).to.throw('The <tractor-step-input> directive requires a "form" attribute.');
        });

        it('should successfully compile the directive:', () => {
            ScenarioModel.getExampleVariableNames = angular.noop;
            sinon.stub(ScenarioModel, 'getExampleVariableNames').returns([]);

            let scope = $rootScope.$new();
            scope.model = {};
            scope.form = {};

            expect(() => {
                compileDirective('<tractor-step-input model="model" label="Some label" form="form"></tractor-step-input>', scope);
            }).not.to.throw();
        });

        it('should generate a unique `id` for the input:', () => {
            ScenarioModel.getExampleVariableNames = angular.noop;
            sinon.stub(ScenarioModel, 'getExampleVariableNames').returns([]);

            let scopeOne = $rootScope.$new();
            let scopeTwo = $rootScope.$new();
            scopeOne.model = scopeTwo.model = {};
            scopeOne.form = scopeTwo.form = {};

            let directiveOne = compileDirective('<tractor-step-input model="model" label="Some label" form="form"></tractor-step-input>', scopeOne);
            let directiveTwo = compileDirective('<tractor-step-input model="model" label="Some label" form="form"></tractor-step-input>', scopeTwo);

            let idOne = directiveOne.isolateScope().id;
            let idTwo = directiveTwo.isolateScope().id;
            expect(idOne).not.to.be.undefined();
            expect(idTwo).not.to.be.undefined();
            expect(idOne).not.to.equal(idTwo);
        });

        it('should convert the "label" attribute into a camel-cased `property`:', () => {
            ScenarioModel.getExampleVariableNames = angular.noop;
            sinon.stub(ScenarioModel, 'getExampleVariableNames').returns([]);

            let scope = $rootScope.$new();
            scope.model = {};
            scope.form = {};

            let directive = compileDirective('<tractor-step-input model="model" label="Some label" form="form"></tractor-step>', scope);

            expect(directive.isolateScope().property).to.equal('someLabel');
        });
    });
});
