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
import './LiteralInputDirective';

describe('LiteralInputDirective.js:', () => {
    let $compile;
    let $rootScope;

    beforeEach(() => {
        angular.mock.module('tractor.literalInput');

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
                compileDirective('<tractor-literal-input></tractor-literal-input>', scope);
            }).to.throw('The <tractor-literal-input> directive requires a "model" attribute.');
        });

        it('should throw an error when "name" is not passed in:', () => {
            let scope = $rootScope.$new();
            scope.model = {};

            expect(() => {
                compileDirective('<tractor-literal-input model="model"></tractor-literal-input>', scope);
            }).to.throw('The <tractor-literal-input> directive requires a "name" attribute.');
        });

        it('should throw an error when "form" is not passed in:', () => {
            let scope = $rootScope.$new();
            scope.model = {};
            scope.name = '';

            expect(() => {
                compileDirective('<tractor-literal-input model="model" name="name"></tractor-literal-input>', scope);
            }).to.throw('The <tractor-literal-input> directive requires a "form" attribute.');
        });

        it('should successfully compile the directive:', () => {
            let scope = $rootScope.$new();
            scope.model = {};
            scope.name = '';
            scope.form = {};

            expect(() => {
                compileDirective('<tractor-literal-input model="model" name="name" form="form"></tractor-literal-input>', scope);
            }).not.to.throw();
        });

        it('should generate a unique `id` for the input:', () => {
            let scopeOne = $rootScope.$new();
            let scopeTwo = $rootScope.$new();
            scopeOne.model = scopeTwo.model = {};
            scopeOne.name = scopeTwo.name = '';
            scopeOne.form = scopeTwo.form = {};

            let directiveOne = compileDirective('<tractor-literal-input model="model" name="name" form="form"></tractor-literal-input>', scopeOne);
            let directiveTwo = compileDirective('<tractor-literal-input model="model" name="name" form="form"></tractor-literal-input>', scopeTwo);

            expect(directiveOne.isolateScope().id).not.to.equal(directiveTwo.isolateScope().id);
        });
    });
});
