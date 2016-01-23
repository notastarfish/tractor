/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);

// Testing:
import './VariableInputDirective';

describe('VariableInputDirective.js:', () => {
    let $compile;
    let $rootScope;

    beforeEach(() => {
        angular.mock.module('tractor.variableInput');

        angular.mock.inject((_$compile_, _$rootScope_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    const compileDirective = (template, $scope) => {
        let directive = $compile(template)($scope);
        $scope.$digest();
        return directive;
    };

    describe('Link function:', () => {
        it('should throw an error when "model" is not passed in:', () => {
            let $scope = $rootScope.$new();

            expect(() => {
                compileDirective(`
                    <tractor-variable-input>
                    </tractor-variable-input>
                `, $scope);
            }).to.throw('The <tractor-variable-input> directive requires a "model" attribute.');
        });

        it('should throw an error when "label" is not passed in:', () => {
            let $scope = $rootScope.$new();
            $scope.model = {};

            expect(() => {
                compileDirective(`
                    <tractor-variable-input
                        model="model">
                    </tractor-variable-input>
                `, $scope);
            }).to.throw('The <tractor-variable-input> directive requires a "label" attribute.');
        });

        it('should throw an error when "form" is not passed in:', () => {
            let $scope = $rootScope.$new();
            $scope.model = {};

            expect(() => {
                compileDirective(`
                    <tractor-variable-input
                        model="model"
                        label="Some label">
                    </tractor-variable-input>
                `, $scope);
            }).to.throw('The <tractor-variable-input> directive requires a "form" attribute.');
        });

        it('should successfully compile the directive otherwise:', () => {
            let $scope = $rootScope.$new();
            let model = {
                getAllVariableNames: angular.noop
            };
            $scope.model = model;
            $scope.form = {};

            sinon.stub(model, 'getAllVariableNames').returns([]);

            expect(() => {
                compileDirective(`
                    <tractor-variable-input
                        model="model"
                        label="Some label"
                        form="form">
                    </tractor-variable-input>
                `, $scope);
            }).not.to.throw();
        });

        it('should generate a unique id for the input:', () => {
            let $scopeOne = $rootScope.$new();
            let $scopeTwo = $rootScope.$new();
            let model = {
                getAllVariableNames: angular.noop
            };
            $scopeOne.model = $scopeTwo.model = model;
            $scopeOne.form = $scopeTwo.form = {};

            sinon.stub(model, 'getAllVariableNames').returns([]);

            let directiveOne = compileDirective(`
                <tractor-variable-input
                    model="model"
                    label="Some label"
                    form="form">
                </tractor-variable-input>
            `, $scopeOne);
            let directiveTwo = compileDirective(`
                <tractor-variable-input
                    model="model"
                    label="Some label"
                    form="form">
                </tractor-variable-input>
            `, $scopeTwo);

            let idOne = directiveOne.isolateScope().id;
            let idTwo = directiveTwo.isolateScope().id;
            expect(idOne).not.to.be.undefined();
            expect(idTwo).not.to.be.undefined();
            expect(idOne).not.to.equal(idTwo);
        });

        it('should determine if the variable is a class name of not:', () => {
            let tests = [{
                template: `
                    <tractor-variable-input
                        model="model"
                        label="Some label"
                        form="form"
                        is-class>
                    </tractor-variable-input>
                `,
                expected: true
            }, {
                template: `
                    <tractor-variable-input
                        model="model"
                        label="Some label"
                        form="form">
                    </tractor-variable-input>
                `,
                expected: false
            }];

            tests.forEach((test) => {
                let $scope = $rootScope.$new();
                let model = {
                    getAllVariableNames: angular.noop
                };
                $scope.model = model;
                $scope.form = {};

                sinon.stub(model, 'getAllVariableNames').returns([]);

                let directive = compileDirective(test.template, $scope);

                expect(directive.isolateScope().isClass).to.equal(test.expected);
            });
        });

        it('should convert the "label" attribute into a camel-cased `property`:', () => {
            let $scope = $rootScope.$new();
            let model = {
                getAllVariableNames: angular.noop
            };
            $scope.model = model;
            $scope.form = {};

            sinon.stub(model, 'getAllVariableNames').returns([]);

            let directive = compileDirective(`
                <tractor-variable-input
                    model="model"
                    label="Some label"
                    form="form">
                </tractor-variable-input>
            `, $scope);

            expect(directive.isolateScope().property).to.equal('someLabel');
        });
    });
});
