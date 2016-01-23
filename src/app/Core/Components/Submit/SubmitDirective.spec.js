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
import './SubmitDirective';

describe('SubmitDirective.js:', () => {
    let $compile;
    let $rootScope;

    beforeEach(() => {
        angular.mock.module('tractor.submit');

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
        it('should throw an error when an "action" is not passed in:', () => {
            let scope = $rootScope.$new();

            expect(() => {
                compileDirective('<tractor-submit></tractor-submit>', scope);
            }).to.throw('The <tractor-submit> directive requires an "action" attribute.');
        });

        it('should successfully compile the directive otherwise:', () => {
            let scope = $rootScope.$new();

            expect(() => {
                compileDirective('<tractor-submit action="Some action"></tractor-submit>', scope);
            }).not.to.throw();
        });
    });
});
