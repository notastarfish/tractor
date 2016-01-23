/* global describe:true, beforeEach:true, it:true */
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
import './ActionDirective';

describe('ActionDirective.js:', () => {
    let $compile;
    let $rootScope;

    beforeEach(() => {
        angular.mock.module('tractor.action');

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
                compileDirective('<tractor-action></tractor-action>', scope);
            }).to.throw(`The <tractor-action> directive requires a "model" attribute.`);
        });

        it('should throw an error when "action" is not passed in:', () => {
            let scope = $rootScope.$new();
            scope.model = {};

            expect(() => {
                compileDirective('<tractor-action model="model"></tractor-action>', scope);
            }).to.throw(`The <tractor-action> directive requires an "action" attribute.`);
        });

        it('should successfully compile the directive:', () => {
            let scope = $rootScope.$new();
            scope.model = {};

            expect(() => {
                compileDirective('<tractor-action model="model" action="Some Action"></tractor-action>', scope);
            }).not.to.throw();
        });

        it('should convert the "action" attribute into a camel-cased `method`:', () => {
            let scope = $rootScope.$new();
            scope.model = {};

            let directive = compileDirective('<tractor-action model="model" action="Some Action"></tractor-action>', scope);

            expect(directive.isolateScope().method).to.equal('someAction');
        });
    });
});
