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
import './DragFileDirective';

describe('DragFileDirective.js:', () => {
    let $compile;
    let $rootScope;

    beforeEach(() => {
        angular.mock.module('tractor.dragFile');

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
        it('should add the "draggable" attribute to the element:', () => {
            angular.element.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
            let scope = $rootScope.$new();
            scope.model = {};

            let directive = compileDirective('<div tractor-drag-file></div>', scope);

            let $element = angular.element(directive);
            expect($element.attr('draggable')).to.equal('true');
        });
    });
});
