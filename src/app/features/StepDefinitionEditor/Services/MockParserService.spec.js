/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Testing:
import './MockParserService';
let mockParserService;

describe('MockParserService.js:', () => {
    let MockModel;

    beforeEach(() => {
        angular.mock.module('tractor.mockParserService');

        angular.mock.inject((
            _mockParserService_,
            _MockModel_
        ) => {
            mockParserService = _mockParserService_;
            MockModel = _MockModel_;
        });
    });

    describe('MockParserService.parse', () => {
        it('should return an MockModel:', () => {
            let step = {
                stepDefinition: {
                    mockDataInstances: [{}]
                }
            };

            let ast = {
                expression: {
                    callee: {
                        object: {
                            arguments: [{
                                raw: '/some\/url/'
                            }],
                            callee: {
                                property: {
                                    name: 'whenGET'
                                }
                            }
                        },
                        property: {
                            name: 'passThrough'
                        }
                    }
                }
            };

            let mockModel = mockParserService.parse(step, ast);

            expect(mockModel).to.be.an.instanceof(MockModel);
        });

        it('should parse the correct action', () => {
            let step = {
                stepDefinition: {
                    mockDataInstances: [{}]
                }
            };

            let ast = {
                expression: {
                    callee: {
                        object: {
                            arguments: [{
                                raw: '/some\/url/'
                            }],
                            callee: {
                                property: {
                                    name: 'whenGET'
                                }
                            }
                        },
                        property: {
                            name: 'passThrough'
                        }
                    }
                }
            };

            let mockModel = mockParserService.parse(step, ast);

            expect(mockModel.action).to.equal('GET');
        });

        it('should parse the correct url', () => {
            let step = {
                stepDefinition: {
                    mockDataInstances: [{}]
                }
            };

            let ast = {
                expression: {
                    callee: {
                        object: {
                            arguments: [{
                                raw: '/some\/url/'
                            }],
                            callee: {
                                property: {
                                    name: 'whenGET'
                                }
                            }
                        },
                        property: {
                            name: 'passThrough'
                        }
                    }
                }
            };

            let mockModel = mockParserService.parse(step, ast);

            expect(mockModel.url).to.equal('some\\/url');
        });

        it('should parse the correct data', () => {
            let mockData1 = {};
            let mockData2 = {
                variableName: 'mockData2'
            };

            let step = {
                stepDefinition: {
                    mockDataInstances: [mockData1, mockData2]
                }
            };

            let ast = {
                expression: {
                    arguments: [{
                        name: 'mockData2'
                    }],
                    callee: {
                        object: {
                            arguments: [{
                                raw: '/some\/url/'
                            }],
                            callee: {
                                property: {
                                    name: 'whenGET'
                                }
                            }
                        }
                    }
                }
            };

            let mockModel = mockParserService.parse(step, ast);

            expect(mockModel.data).to.equal(mockData2);
        });

        it('should parse that it is a pass-through', () => {
            let step = {
                stepDefinition: {
                    mockDataInstances: [{}]
                }
            };

            let ast = {
                expression: {
                    callee: {
                        object: {
                            arguments: [{
                                raw: '/some\/url/'
                            }],
                            callee: {
                                property: {
                                    name: 'whenGET'
                                }
                            }
                        },
                        property: {
                            name: 'passThrough'
                        }
                    }
                }
            };

            let mockModel = mockParserService.parse(step, ast);

            expect(mockModel.passThrough).to.equal(true);
        });

        it('should bail out and return `null` when it cannot parse', () => {
            let step = {
                stepDefinition: {
                    mockDataInstances: [{}]
                }
            };

            let ast = {
                expression: {
                    callee: {
                        object: {
                            arguments: [{
                                raw: '/some\/url/'
                            }],
                            callee: {
                                property: {
                                    name: 'whenGET'
                                }
                            }
                        }
                    }
                }
            };

            sinon.stub(console, 'warn');

            let mockModel = mockParserService.parse(step, ast);

            expect(mockModel).to.equal(null);

            console.warn.restore();
        });
    });
});
