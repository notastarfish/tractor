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
import './ExpectationParserService';
let expectationParserService;

describe('ExpectationParserService.js:', () => {
    let ExpectationModel;

    beforeEach(() => {
        angular.mock.module('tractor.expectationParserService');

        angular.mock.inject((
            _expectationParserService_,
            _ExpectationModel_
        ) => {
            expectationParserService = _expectationParserService_;
            ExpectationModel = _ExpectationModel_;
        });
    });

    describe('ExpectationParserService.parse', () => {
        it('should return an ExpectationModel:', () => {
            let step = {
                stepDefinition: {
                    componentInstances: [{
                        variableName: 'component',
                        component: {
                            actions: [{
                                variableName: 'action',
                                parameters: [{
                                    name: 'argument'
                                }]
                            }]
                        }
                    }]
                }
            };

            let ast = {
                arguments: [{
                    value: 'value'
                }],
                callee: {
                    object: {
                        object: {
                            object: {
                                arguments: [{
                                    callee: {
                                        object: {
                                            name: 'component'
                                        },
                                        property: {
                                            name: 'action'
                                        }
                                    },
                                    arguments: []
                                }]
                            }
                        }
                    },
                    property: {
                        name: 'equal'
                    }
                }
            };

            let expectationModel = expectationParserService.parse(step, ast);

            expect(expectationModel).to.be.an.instanceof(ExpectationModel);
        });

        it('should parse the correct value', () => {
            let step = {
                stepDefinition: {
                    componentInstances: [{
                        variableName: 'component',
                        component: {
                            actions: [{
                                variableName: 'action',
                                parameters: [{
                                    name: 'argument'
                                }]
                            }]
                        }
                    }]
                }
            };

            let ast = {
                arguments: [{
                    value: 'value'
                }],
                callee: {
                    object: {
                        object: {
                            object: {
                                arguments: [{
                                    callee: {
                                        object: {
                                            name: 'component'
                                        },
                                        property: {
                                            name: 'action'
                                        }
                                    },
                                    arguments: []
                                }]
                            }
                        }
                    },
                    property: {
                        name: 'equal'
                    }
                }
            };

            let expectationModel = expectationParserService.parse(step, ast);

            expect(expectationModel.value).to.equal('value');
        });

        it('should parse the correct component', () => {
            let componentInstance = {
                variableName: 'component',
                component: {
                    actions: [{
                        variableName: 'action',
                        parameters: [{
                            name: 'argument'
                        }]
                    }]
                }
            };
            let step = {
                stepDefinition: {
                    componentInstances: [componentInstance]
                }
            };

            let ast = {
                arguments: [{
                    value: 'value'
                }],
                callee: {
                    object: {
                        object: {
                            object: {
                                arguments: [{
                                    callee: {
                                        object: {
                                            name: 'component'
                                        },
                                        property: {
                                            name: 'action'
                                        }
                                    },
                                    arguments: []
                                }]
                            }
                        }
                    },
                    property: {
                        name: 'equal'
                    }
                }
            };

            let expectationModel = expectationParserService.parse(step, ast);

            expect(expectationModel.component).to.equal(componentInstance);
        });

        it('should parse the correct action', () => {
            let action = {
                variableName: 'action',
                parameters: [{
                    name: 'argument'
                }]
            };
            let step = {
                stepDefinition: {
                    componentInstances: [{
                        variableName: 'component',
                        component: {
                            actions: [action]
                        }
                    }]
                }
            };

            let ast = {
                arguments: [{
                    value: 'value'
                }],
                callee: {
                    object: {
                        object: {
                            object: {
                                arguments: [{
                                    callee: {
                                        object: {
                                            name: 'component'
                                        },
                                        property: {
                                            name: 'action'
                                        }
                                    },
                                    arguments: []
                                }]
                            }
                        }
                    },
                    property: {
                        name: 'equal'
                    }
                }
            };

            let expectationModel = expectationParserService.parse(step, ast);

            expect(expectationModel.action).to.equal(action);
        });

        it('should parse the correct condition', () => {
            let step = {
                stepDefinition: {
                    componentInstances: [{
                        variableName: 'component',
                        component: {
                            actions: [{
                                variableName: 'action',
                                parameters: [{
                                    name: 'argument'
                                }]
                            }]
                        }
                    }]
                }
            };

            let ast = {
                arguments: [{
                    value: 'value'
                }],
                callee: {
                    object: {
                        object: {
                            object: {
                                arguments: [{
                                    callee: {
                                        object: {
                                            name: 'component'
                                        },
                                        property: {
                                            name: 'action'
                                        }
                                    },
                                    arguments: []
                                }]
                            }
                        }
                    },
                    property: {
                        name: 'equal'
                    }
                }
            };

            let expectationModel = expectationParserService.parse(step, ast);

            expect(expectationModel.condition).to.equal('equal');
        });

        it('should parse the correct values for each action argument', () => {
            let step = {
                stepDefinition: {
                    componentInstances: [{
                        variableName: 'component',
                        component: {
                            actions: [{
                                variableName: 'action',
                                parameters: [{
                                    name: 'argument1'
                                }, {
                                    name: 'argument2'
                                }]
                            }]
                        }
                    }]
                }
            };

            let ast = {
                arguments: [{
                    value: 'value'
                }],
                callee: {
                    object: {
                        object: {
                            object: {
                                arguments: [{
                                    callee: {
                                        object: {
                                            name: 'component'
                                        },
                                        property: {
                                            name: 'action'
                                        }
                                    },
                                    arguments: [{
                                        value: 'argument1'
                                    }, {
                                        value: 'argument2'
                                    }]
                                }]
                            }
                        }
                    },
                    property: {
                        name: 'equal'
                    }
                }
            };

            let expectationModel = expectationParserService.parse(step, ast);

            let [argument1, argument2] = expectationModel.arguments;
            expect(argument1.value).to.equal('argument1');
            expect(argument2.value).to.equal('argument2');
        });

        it('should bail out and return `null` when it cannot parse', () => {
            let step = {};
            let ast = {};

            sinon.stub(console, 'warn');

            let expectationModel = expectationParserService.parse(step, ast);

            expect(expectationModel).to.equal(null);

            console.warn.restore();
        });
    });
});
