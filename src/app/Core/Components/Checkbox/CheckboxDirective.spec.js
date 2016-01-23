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
import './CheckboxDirective';

describe('CheckboxDirective.js:', () => {
    let $compile;
    let $rootScope;

    beforeEach(() => {
        angular.mock.module('tractor.checkbox');

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
                compileDirective('<tractor-checkbox></tractor-checkbox>', scope);
            }).to.throw(`The <tractor-checkbox> directive requires a "model" attribute.`);
        });

        it('should throw an error when "label" is not passed in:', () => {
            let scope = $rootScope.$new();
            scope.model = {};

            expect(() => {
                compileDirective('<tractor-checkbox model="model"></tractor-checkbox>', scope);
            }).to.throw('The <tractor-checkbox> directive requires an "label" attribute.');
        });

        it('should successfully compile the directive:', () => {
            let scope = $rootScope.$new();
            scope.model = {};

            expect(() => {
                compileDirective('<tractor-checkbox model="model" label="Some property"></tractor-checkbox>', scope);
            }).not.to.throw();
        });

        it('should convert the "label" attribute into a camel-cased `property`:', () => {
            let scope = $rootScope.$new();
            scope.model = {};

            let directive = compileDirective('<tractor-checkbox model="model" label="Some property"></tractor-checkbox>', scope);

            expect(directive.isolateScope().property).to.equal('someProperty');
        });
    });
});
