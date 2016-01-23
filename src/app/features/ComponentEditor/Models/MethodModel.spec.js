/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';

// Test setup:
const expect = chai.expect;

// Testing:
import './MethodModel';
let MethodModel;

describe('MethodModel.js:', () => {
    let ArgumentModel;

    beforeEach(() => {
        angular.mock.module('tractor.methodModel');

        angular.mock.inject((
            _MethodModel_,
            _ArgumentModel_
        ) => {
            MethodModel = _MethodModel_;
            ArgumentModel = _ArgumentModel_;
        });
    });

    describe('MethodModel constructor:', () => {
        it('should create a new `MethodModel`:', () => {
            let methodModel = new MethodModel({}, {});
            expect(methodModel).to.be.an.instanceof(MethodModel);
        });

        it('should have default properties:', () => {
            let interaction = {};
            let method = {};

            let methodModel = new MethodModel(interaction, method);

            expect(methodModel.interaction).to.equal(interaction);
        });
    });

    describe('MethodModel.arguments:', () => {
        it('should return the Arguments of the Method:', () => {
            let method = {
                arguments: [{
                    name: 'argument'
                }]
            };

            let methodModel = new MethodModel({}, method);

            expect(methodModel.arguments.length).to.equal(1);
            let [argument] = methodModel.arguments;
            expect(argument).to.be.an.instanceof(ArgumentModel);
            expect(argument.name).to.equal('argument');
        });
    });

    describe('MethodModel.name:', () => {
        it('should return the name of the Method:', () => {
            let method = {
                name: 'method'
            };

            let methodModel = new MethodModel({}, method);

            expect(methodModel.name).to.equal('method');
        });
    });

    describe('MethodModel.description:', () => {
        it('should return the description of the Method:', () => {
            let method = {
                description: 'description'
            };

            let methodModel = new MethodModel({}, method);

            expect(methodModel.description).to.equal('description');
        });
    });

    describe('MethodModel.returns:', () => {
        it('should return the type of the return value of the Method:', () => {
            let method = {
                returns: 'string'
            };

            let methodModel = new MethodModel({}, method);

            expect(methodModel.returns).to.equal('string');
        });
    });

    describe('MethodModel[returns]:', () => {
        it('should return the return value of the Method:', () => {
            let method = {
                returns: 'string',
                string: 'returnValue'
            };

            let methodModel = new MethodModel({}, method);

            expect(methodModel[methodModel.returns]).to.equal('returnValue');
        });
    });
});
