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
import './SelectInputDirective';

describe('SelectInputDirective.js:', () => {
    let $compile;
    let $rootScope;

    beforeEach(() => {
        angular.mock.module('tractor.select');

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
                compileDirective('<tractor-select></tractor-select>', scope);
            }).to.throw('The <tractor-select> directive requires a "model" attribute.');
        });

        it('should throw an error when "label" is not passed in:', () => {
            let scope = $rootScope.$new();
            scope.model = {};

            expect(() => {
                compileDirective('<tractor-select model="model"></tractor-select>', scope);
            }).to.throw('The <tractor-select> directive requires a "label" attribute.');
        });

        it(`should throw an error when "options" is not passed in, and it can't determine the "options" by the "label":`, () => {
            let scope = $rootScope.$new();
            scope.model = {};

            expect(() => {
                compileDirective('<tractor-select model="model" label="Some Label"></tractor-select>', scope);
            }).to.throw('The <tractor-select> directive requires an "options" attribute, or a "label" attribute that matches a set of options on the "model".');
        });

        it('should successfully compile the directive:', () => {
            let scope = $rootScope.$new();
            scope.model = {};
            scope.options = [];

            expect(() => {
                compileDirective('<tractor-select model="model" label="Some Label" options="options"></tractor-select>', scope);
            }).not.to.throw();
        });

        it('should convert the "label" attribute into a camel-cased `property`:', () => {
            let scope = $rootScope.$new();
            scope.model = {};
            scope.options = [];

            let directive = compileDirective('<tractor-select model="model" label="Some Label" options="options"></tractor-select>', scope);

            expect(directive.isolateScope().property).to.equal('someLabel');
        });

        it('should first look for an "options" attribute to determine the `selectOptions`:', () => {
            let scope = $rootScope.$new();
            scope.model = {};
            scope.options = [];

            let directive = compileDirective('<tractor-select model="model" label="Some Label" options="options"></tractor-select>', scope);

            expect(directive.isolateScope().selectOptions).to.equal(scope.options);
        });

        it('should should try to figure out the `selectOptions` from the "label" if an "options" attribute is not present:', () => {
            let scope = $rootScope.$new();
            scope.model = {
                options: []
            };

            let directive = compileDirective('<tractor-select model="model" label="Option"></tractor-select>', scope);

            expect(directive.isolateScope().selectOptions).to.equal(scope.model.options);
        });
    });
});
