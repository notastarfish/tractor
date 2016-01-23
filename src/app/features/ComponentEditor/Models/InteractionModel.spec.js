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
import './InteractionModel';
let InteractionModel;

describe('InteractionModel.js:', () => {
    let MethodModel;

    beforeEach(() => {
        angular.mock.module('tractor.interactionModel');

        angular.mock.inject((
            _InteractionModel_,
            _MethodModel_
        ) => {
            InteractionModel = _InteractionModel_;
            MethodModel = _MethodModel_;
        });
    });

    describe('InteractionModel constructor:', () => {
        it('should create a new `InteractionModel`:', () => {
            let interactionModel = new InteractionModel();
            expect(interactionModel).to.be.an.instanceof(InteractionModel);
        });

        it('should have default properties:', () => {
            let action = {};

            let interactionModel = new InteractionModel(action);

            expect(interactionModel.action).to.equal(action);
        });
    });

    describe('InteractionModel.element:', () => {
        it('should return the Element that the Interaction occurs on:', () => {
            let method = {
                arguments: []
            };
            let element = {
                methods: [method]
            };

            let interactionModel = new InteractionModel();
            interactionModel.element = element;

            expect(interactionModel.element).to.equal(element);
        });

        it('should set the `method` of the Interaction to the first Method of the Element:', () => {
            let method = {
                arguments: []
            };
            let element = {
                methods: [method]
            };

            let interactionModel = new InteractionModel();
            interactionModel.element = element;

            expect(interactionModel.method).to.equal(method);
        });
    });

    describe('InteractionModel.method:', () => {
        it('should return the Method to be called on the Element:', () => {
            let method = {
                arguments: []
            };

            let interactionModel = new InteractionModel();
            interactionModel.method = method;

            expect(interactionModel.method).to.equal(method);
        });

        it('should set the `methodInstance` of the Interaction to a new MethodModel:', () => {
            let method = {
                arguments: []
            };

            let interactionModel = new InteractionModel();
            interactionModel.method = method;

            expect(interactionModel.methodInstance).to.be.an.instanceof(MethodModel);
        });
    });

    describe('InteractionModel.arguments:', () => {
        it('should return the arguments required for the Method of the Interaction:', () => {
            let method = {
                arguments: []
            };

            let interactionModel = new InteractionModel();
            interactionModel.method = method;

            expect(interactionModel.arguments).to.deep.equal([]);
        });
    });

    describe('InteractionModel.ast:', () => {
        it('should be the AST of the Interaction:', () => {
            let method = {
                name: 'method'
            };
            let element = {
                variableName: 'element',
                methods: [method]
            };

            let interactionModel = new InteractionModel();
            interactionModel.element = element;
            let ast = interactionModel.ast;

            expect(escodegen.generate(ast)).to.equal(dedent(`
                new Promise(function (resolve) {
                    resolve(self.element.method());
                })
            `));
        });

        it('should handle method on the global `browser` Element:', () => {
            let method = {
                name: 'method'
            };
            let element = {
                variableName: 'browser',
                methods: [method]
            };

            let interactionModel = new InteractionModel();
            interactionModel.element = element;
            let ast = interactionModel.ast;

            expect(escodegen.generate(ast)).to.equal(dedent(`
                new Promise(function (resolve) {
                    resolve(browser.method());
                })
            `));
        });

        it('should handle methods that return a promise:', () => {
            let method = {
                name: 'method',
                returns: 'promise'
            };
            let element = {
                variableName: 'element',
                methods: [method]
            };

            let interactionModel = new InteractionModel();
            interactionModel.element = element;
            let ast = interactionModel.ast;

            expect(escodegen.generate(ast)).to.equal(dedent(`
                self.element.method()
            `));
        });

        it('should handle methods that have arguments:', () => {
            let action = {
                parameters: [],
                interactions: []
            };
            let method = {
                name: 'method',
                returns: 'promise',
                arguments: [{}]
            };
            let element = {
                variableName: 'element',
                methods: [method]
            };

            let interactionModel = new InteractionModel(action);
            interactionModel.element = element;
            let [argument] = interactionModel.arguments;
            argument.value = 'someArgument';
            let ast = interactionModel.ast;

            expect(escodegen.generate(ast)).to.equal(dedent(`
                self.element.method('someArgument')
            `));
        });
    });
});
