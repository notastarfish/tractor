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
import './InteractionParserService';
let interactionParserService;

describe('InteractionParserService.js:', () => {
    let argumentParserService;

    beforeEach(() => {
        angular.mock.module('tractor.interactionParserService');

        angular.mock.module($provide => {
            $provide.factory('argumentParserService', () => {
                argumentParserService = {};
                return argumentParserService;
            });
        });

        angular.mock.inject((
            _interactionParserService_
        ) => {
            interactionParserService = _interactionParserService_;
        });
    });

    describe('InteractionParserService.parse', () => {
        it('should parse an interaction', () => {
            let get = {
                name: 'get'
            };
            let browser = {
                methods: [get]
            };
            let action = {
                component: { browser }
            };
            let ast = {
                argument: {
                    arguments: [{
                        body: {
                            body: [{
                                expression: {
                                    arguments: [{
                                        arguments: [],
                                        callee: {
                                            object: {
                                                name: 'browser'
                                            },
                                            property: {
                                                name: 'get'
                                            }
                                        }
                                    }]
                                }
                            }]
                        }
                    }]
                }
            };

            action.addInteraction = angular.noop;
            sinon.stub(action, 'addInteraction');

            interactionParserService.parse(action, ast);

            expect(action.addInteraction).to.have.been.called();
        });

        it('should recursively parse nested interactions', () => {
            let get = {
                name: 'get'
            };
            let browser = {
                methods: [get]
            };
            let action = {
                component: { browser }
            };
            let ast = {
                argument: {
                    arguments: [{
                        body: {
                            body: [{
                                argument: {
                                    arguments: [],
                                    callee: {
                                        object: {
                                            name: 'browser'
                                        },
                                        property: {
                                            name: 'get'
                                        }
                                    }
                                }
                            }]
                        }
                    }],
                    callee: {
                        object: {
                            arguments: [{
                                body: {
                                    body: [{
                                        expression: {
                                            arguments: [{
                                                arguments: [],
                                                callee: {
                                                    object: {
                                                        name: 'browser'
                                                    },
                                                    property: {
                                                        name: 'get'
                                                    }
                                                }
                                            }]
                                        }
                                    }]
                                }
                            }],
                            callee: {}
                        }
                    }
                }
            };

            action.addInteraction = angular.noop;
            sinon.stub(action, 'addInteraction');

            interactionParserService.parse(action, ast);

            expect(action.addInteraction).to.have.been.calledTwice();
        });

        it('should parse an `return new Promise()` interaction', () => {
            let get = {
                name: 'get'
            };
            let browser = {
                methods: [get]
            };
            let action = {
                component: { browser }
            };
            let ast = {
                argument: {
                    arguments: [{
                        body: {
                            body: [{
                                expression: {
                                    arguments: [{
                                        arguments: [],
                                        callee: {
                                            object: {
                                                name: 'browser'
                                            },
                                            property: {
                                                name: 'get'
                                            }
                                        }
                                    }]
                                }
                            }]
                        }
                    }]
                }
            };

            action.addInteraction = angular.noop;
            sinon.stub(action, 'addInteraction');

            interactionParserService.parse(action, ast);
            let [interaction] = action.addInteraction.getCall(0).args;

            expect(interaction.element).to.equal(browser);
            expect(interaction.method).to.equal(get);
        });

        it('should parse a `return element.method()` interaction', () => {
            let get = {
                name: 'get'
            };
            let browser = {
                methods: [get]
            };
            let action = {
                component: { browser }
            };
            let ast = {
                argument: {
                    arguments: [],
                    callee: {
                        object: {
                            name: 'browser'
                        },
                        property: {
                            name: 'get'
                        }
                    }
                }
            };

            action.addInteraction = angular.noop;
            sinon.stub(action, 'addInteraction');

            interactionParserService.parse(action, ast);
            let interaction = action.addInteraction.getCall(0).args[0];

            expect(interaction.element).to.equal(browser);
            expect(interaction.method).to.equal(get);
        });

        it('should parse a `.then(() => new Promise()` interaction', () => {
            let get = {
                name: 'get'
            };
            let browser = {
                methods: [get]
            };
            let action = {
                component: { browser }
            };
            let ast = {
                argument: {
                    arguments: [{
                        body: {
                            body: [{
                                argument: {
                                    arguments: [{
                                        body: {
                                            body: [{
                                                expression: {
                                                    arguments: [{
                                                        arguments: [],
                                                        callee: {
                                                            object: {
                                                                name: 'browser'
                                                            },
                                                            property: {
                                                                name: 'get'
                                                            }
                                                        }
                                                    }]
                                                }
                                            }]
                                        }
                                    }]
                                }
                            }]
                        }
                    }]
                }
            };

            action.addInteraction = angular.noop;
            sinon.stub(action, 'addInteraction');

            interactionParserService.parse(action, ast);
            let interaction = action.addInteraction.getCall(0).args[0];

            expect(interaction.element).to.equal(browser);
            expect(interaction.method).to.equal(get);
        });

        it('should parse a `.then(() => element.method())` interaction', () => {
            let get = {
                name: 'get'
            };
            let browser = {
                methods: [get]
            };
            let action = {
                component: { browser }
            };
            let ast = {
                argument: {
                    arguments: [{
                        body: {
                            body: [{
                                argument: {
                                    arguments: [],
                                    callee: {
                                        object: {
                                            name: 'browser'
                                        },
                                        property: {
                                            name: 'get'
                                        }
                                    }
                                }
                            }]
                        }
                    }]
                }
            };

            action.addInteraction = angular.noop;
            sinon.stub(action, 'addInteraction');

            interactionParserService.parse(action, ast);
            let interaction = action.addInteraction.getCall(0).args[0];

            expect(interaction.element).to.equal(browser);
            expect(interaction.method).to.equal(get);
        });

        it('should get the `element` from the `action`', () => {
            let method = {
                name: 'method'
            };
            let element = {
                variableName: 'element',
                methods: [method]
            };
            let action = {
                component: {
                    elements: [element]
                }
            };
            let ast = {
                argument: {
                    arguments: [{
                        body: {
                            body: [{
                                expression: {
                                    arguments: [{
                                        arguments: [],
                                        callee: {
                                            object: {
                                                property: {
                                                    name: 'element'
                                                }
                                            },
                                            property: {
                                                name: 'method'
                                            }
                                        }
                                    }]
                                }
                            }]
                        }
                    }]
                }
            };

            action.addInteraction = angular.noop;
            sinon.stub(action, 'addInteraction');

            interactionParserService.parse(action, ast);
            let [interaction] = action.addInteraction.getCall(0).args;

            expect(interaction.element).to.equal(element);
            expect(interaction.method).to.equal(method);
        });

        it('should parse any arguments of the interaction', () => {
            let get = {
                name: 'get',
                arguments: [{}]
            };
            let browser = {
                methods: [get]
            };
            let action = {
                component: { browser },
                parameters: []
            };
            let ast = {
                argument: {
                    arguments: [{
                        body: {
                            body: [{
                                expression: {
                                    arguments: [{
                                        arguments: [{}],
                                        callee: {
                                            object: {
                                                name: 'browser'
                                            },
                                            property: {
                                                name: 'get'
                                            }
                                        }
                                    }]
                                }
                            }]
                        }
                    }]
                }
            };

            let argument = {};
            action.addInteraction = angular.noop;
            sinon.stub(action, 'addInteraction');
            argumentParserService.parse = angular.noop;
            sinon.stub(argumentParserService, 'parse').returns(argument);

            interactionParserService.parse(action, ast);
            let [interaction] = action.addInteraction.getCall(0).args;
            let [argumentModel] = interaction.methodInstance.arguments

            expect(argumentModel).to.equal(argument);
        });

        it('should find any `arguments` with the same name as a `parameter` of the `action`', () => {
            let get = {
                name: 'get',
                arguments: [{}]
            };
            let browser = {
                methods: [get]
            };
            let action = {
                component: { browser },
                parameters: [{
                    name: 'argument',
                    variableName: 'argument'
                }]
            };
            let ast = {
                argument: {
                    arguments: [{
                        body: {
                            body: [{
                                expression: {
                                    arguments: [{
                                        arguments: [{}],
                                        callee: {
                                            object: {
                                                name: 'browser'
                                            },
                                            property: {
                                                name: 'get'
                                            }
                                        }
                                    }]
                                }
                            }]
                        }
                    }]
                }
            };

            let argument = {
                value: 'argument'
            };
            action.addInteraction = angular.noop;
            sinon.stub(action, 'addInteraction');
            argumentParserService.parse = angular.noop;
            sinon.stub(argumentParserService, 'parse').returns(argument);

            interactionParserService.parse(action, ast);
            let [interaction] = action.addInteraction.getCall(0).args;
            let [argumentModel] = interaction.methodInstance.arguments

            expect(argumentModel.value).to.equal('argument');
        });

        it('should bail out and return `null` when it cannot parse', () => {
            let action = {};
            let ast = {};

            sinon.stub(console, 'warn');
            let interaction = interactionParserService.parse(action, ast);

            expect(interaction).to.equal(null);

            console.warn.restore();
        });
    });
});
