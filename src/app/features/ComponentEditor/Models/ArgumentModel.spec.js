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

// Dependencies:
import escodegen from 'escodegen';

// Testing:
import './ArgumentModel';
let ArgumentModel;

describe('ArgumentModel.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.argumentModel');

        angular.mock.inject(_ArgumentModel_ => {
            ArgumentModel = _ArgumentModel_;
        });
    });

    describe('ArgumentModel constructor:', () => {
        it('should create a new `ArgumentModel`:', () => {
            let actionModel = new ArgumentModel();
            expect(actionModel).to.be.an.instanceof(ArgumentModel);
        });

        it('should have default properties:', () => {
            let method = {};
            let argumentModel = new ArgumentModel(method);

            expect(argumentModel.method).to.equal(method);
            expect(argumentModel.name).to.be.false();
            expect(argumentModel.description).to.be.false();
            expect(argumentModel.type).to.be.false();
            expect(argumentModel.required).to.be.false();
            expect(argumentModel.value).to.equal('');
        });
    });

    describe('ArgumentModel.method:', () => {
        it('should return the Method that this Argument belongs to:', () => {
            let method = {};
            let argumentModel = new ArgumentModel(method);

            expect(argumentModel.method).to.equal(method);
        });

        it('should return `null` if there is not a Method:', () => {
            let argumentModel = new ArgumentModel();

            expect(argumentModel.method).to.be.null();
        });
    });

    describe('ArgumentModel.name:', () => {
        it('should return the name of the Argument:', () => {
            let argument = {
                name: 'argument'
            };
            let argumentModel = new ArgumentModel({}, argument);

            expect(argumentModel.name).to.equal('argument');
        });
    });

    describe('ArgumentModel.description:', () => {
        it('should return the description of the Argument:', () => {
            let argument = {
                description: 'description'
            };
            let argumentModel = new ArgumentModel({}, argument);

            expect(argumentModel.description).to.equal('description');
        });
    });

    describe('ArgumentModel.type:', () => {
        it('should return the type of the Argument:', () => {
            let argument = {
                type: 'type'
            };
            let argumentModel = new ArgumentModel({}, argument);

            expect(argumentModel.type).to.equal('type');
        });
    });

    describe('ArgumentModel.required:', () => {
        it('should return the type of the Argument:', () => {
            let argument = {
                required: true
            };
            let argumentModel = new ArgumentModel({}, argument);

            expect(argumentModel.required).to.be.true();
        });
    });

    describe('ArgumentModel.ast:', () => {
        it('should return a literal value for JavaScript literals:', () => {
            let argumentModel = new ArgumentModel();
            argumentModel.value = 'true';
            let ast = argumentModel.ast;

            expect(escodegen.generate(ast)).to.equal('true');
        });

        it('should return an identifier if the Argument value matches a parameter of the action:', () => {
            let parameter = {
                name: 'parameter',
                variableName: 'parameter'
            };
            let interaction = {
                method: {}
            };
            let method = {
                interaction: {
                    action: {
                        parameters: [parameter],
                        interactions: [interaction]
                    }
                }
            };

            let argumentModel = new ArgumentModel(method);
            argumentModel.value = 'parameter';
            let ast = argumentModel.ast;

            expect(escodegen.generate(ast)).to.equal('parameter');
        });

        it('should return an identifier if the Argument value matches the return value of an interaction:', () => {
            let interaction = {
                method: {
                    string: {
                        name: 'returnValue'
                    },
                    returns: 'string'
                }
            };
            let method = {
                interaction: {
                    action: {
                        parameters: [],
                        interactions: [interaction]
                    }
                }
            };

            let argumentModel = new ArgumentModel(method);
            argumentModel.value = 'returnValue';
            let ast = argumentModel.ast;

            expect(escodegen.generate(ast)).to.equal('returnValue');
        });

        it('should return null if the Argument has no value:', () => {
            let argumentModel = new ArgumentModel();
            argumentModel.value = '';
            let ast = argumentModel.ast;

            expect(escodegen.generate(ast)).to.equal('null');
        });
    });
});
