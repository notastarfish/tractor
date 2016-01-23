/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);

// Testing:
import './TextInputDirective';

describe('TextInputDirective.js:', () => {
    let $compile;
    let $rootScope;

    beforeEach(() => {
        angular.mock.module('tractor.textInput');

        angular.mock.inject((_$compile_, _$rootScope_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    let compileDirective = (template, scope) => {
        let directive = $compile(template)(scope);
        scope.$digest();
        return directive;
    };

    describe('Link function:', () => {
        it('should throw an error when "model" is not passed in:', () => {
            let scope = $rootScope.$new();

            expect(() => {
                compileDirective('<tractor-text-input></tractor-text-input>', scope);
            }).to.throw('The <tractor-text-input> directive requires a "model" attribute.');
        });

        it('should throw an error when "label" is not passed in:', () => {
            let scope = $rootScope.$new();
            scope.model = {};

            expect(() => {
                compileDirective('<tractor-text-input model="model"></tractor-text-input>', scope);
            }).to.throw('The <tractor-text-input> directive requires a "label" attribute.');
        });

        it('should throw an error when "form" is not passed in:', () => {
            let scope = $rootScope.$new();
            scope.model = {};

            expect(() => {
                compileDirective('<tractor-text-input model="model" label="Some label"></tractor-text-input>', scope);
            }).to.throw('The <tractor-text-input> directive requires a "form" attribute.');
        });

        it('should successfully compile the directive otherwise:', () => {
            let scope = $rootScope.$new();
            scope.model = {};
            scope.form = {}

            expect(() => {
                compileDirective('<tractor-text-input model="model" label="Some label" form="form"></tractor-text-input>', scope);
            }).not.to.throw();
        });

        it('should convert the "label" attribute into a camel-cased `property`:', () => {
            let scope = $rootScope.$new();
            scope.model = {};
            scope.form = {};

            let directive = compileDirective('<tractor-text-input model="model" label="Some Label" form="form"></tractor-text-input>', scope);

            expect(directive.isolateScope().property).to.equal('someLabel');
        });
        it('should generate a unique `id` for the input:', () => {
            let scopeOne = $rootScope.$new();
            let scopeTwo = $rootScope.$new();
            scopeOne.model = scopeTwo.model = {};
            scopeOne.form = scopeTwo.form = {};

            let directiveOne = compileDirective('<tractor-text-input model="model" label="Some label" form="form"></tractor-text-input>', scopeOne);
            let directiveTwo = compileDirective('<tractor-text-input model="model" label="Some label" form="form"></tractor-text-input>', scopeTwo);

            let idOne = directiveOne.isolateScope().id;
            let idTwo = directiveTwo.isolateScope().id;
            expect(idOne).not.to.be.undefined();
            expect(idTwo).not.to.be.undefined();
            expect(idOne).not.to.equal(idTwo);
        });
    });
});
