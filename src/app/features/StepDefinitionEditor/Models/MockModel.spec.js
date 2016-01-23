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
import './MockModel';
let MockModel;

describe('MockModel.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.mockModel');

        angular.mock.inject((
            _MockModel_
        ) => {
            MockModel = _MockModel_;
        });
    });

    describe('MockModel constructor:', () => {
        it('should create a new `MockDataInstanceModel`', () => {
            let step = {
                stepDefinition: {
                    mockDataInstances: []
                }
            };

            let mockModel = new MockModel(step);

            expect(mockModel).to.be.an.instanceof(MockModel);
        });
    });

    describe('MockModel.actions:', () => {
        it('should have all the available HTTP actions', () => {
            let step = {
                stepDefinition: {
                    mockDataInstances: []
                }
            };

            let mockModel = new MockModel(step);

            expect(mockModel.actions).to.deep.equal(['GET', 'POST', 'DELETE', 'PUT', 'HEAD', 'PATCH']);
        });
    });

    describe('MockModel.action:', () => {
        it('should default to "GET"', () => {
            let step = {
                stepDefinition: {
                    mockDataInstances: []
                }
            };

            let mockModel = new MockModel(step);

            expect(mockModel.action).to.equal('GET');
        });
    });

    describe('MockModel.data:', () => {
        it('should default to the first `MockDataInstance`', () => {
            let mockDataInstance = {};
            let step = {
                stepDefinition: {
                    mockDataInstances: [mockDataInstance]
                }
            };

            let mockModel = new MockModel(step);

            expect(mockModel.data).to.equal(mockDataInstance);
        });
    });

    describe('MockModel.passThrough:', () => {
        it('should default to `false`', () => {
            let step = {
                stepDefinition: {
                    mockDataInstances: []
                }
            };

            let mockModel = new MockModel(step);

            expect(mockModel.passThrough).to.equal(false);
        });
    });

    describe('MockModel.url:', () => {
        it('should default to an empty string', () => {
            let step = {
                stepDefinition: {
                    mockDataInstances: []
                }
            };

            let mockModel = new MockModel(step);

            expect(mockModel.url).to.equal('');
        });
    });

    describe('MockModel.step:', () => {
        it('should have a `step`', () => {
            let step = {
                stepDefinition: {
                    mockDataInstances: []
                }
            };

            let mockModel = new MockModel(step);

            expect(mockModel.step).to.equal(step);
        });
    });

    describe('MockData.ast:', () => {
        it('should be the AST of the MockModel', () => {
            let mockDataInstance = {
                variableName: 'mockDataInstance'
            };
            let step = {
                stepDefinition: {
                    mockDataInstances: [mockDataInstance]
                }
            };

            let mockModel = new MockModel(step);
            mockModel.url = 'some/url/to/some/resource';

            let { ast } = mockModel;

            expect(escodegen.generate(ast)).to.equal(dedent(`
                httpBackend.whenGET(/some\\/url\\/to\\/some\\/resource/).respond(mockDataInstance);
            `));
        });

        it('should be the AST for a pass-through MockModel', () => {
            let mockDataInstance = {
                variableName: 'mockDataInstance'
            };
            let step = {
                stepDefinition: {
                    mockDataInstances: [mockDataInstance]
                }
            };

            let mockModel = new MockModel(step);
            mockModel.url = 'some/url/to/some/resource';
            mockModel.passThrough = true;

            let { ast } = mockModel;

            expect(escodegen.generate(ast)).to.equal(dedent(`
                httpBackend.whenGET(/some\\/url\\/to\\/some\\/resource/).passThrough();
            `));
        });
    });
});
