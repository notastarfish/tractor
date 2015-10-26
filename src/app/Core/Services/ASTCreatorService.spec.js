/*global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
var angular = require('angular');
require('angular-mocks');

// Test Utilities:
var chai = require('chai');

// Test setup:
var expect = chai.expect;

// Testing:
require('./ASTCreatorService');
var astCreatorService;

describe('ASTCreatorService.js:', function () {
    beforeEach(function () {
        angular.mock.module('Core');

        angular.mock.inject(function (_astCreatorService_) {
            astCreatorService = _astCreatorService_;
        });
    });

    describe('ASTCreatorService.expressionStatement:', function () {
        it('should create a new `expressionStatement` object:', function () {
            var expression = {};
            var expressionStatement = astCreatorService.expressionStatement(expression);
            expect(expressionStatement.type).to.equal('ExpressionStatement');
            expect(expressionStatement.expression).to.equal(expression);
        });
    });

    describe('ASTCreatorService.identifier:', function () {
        it('should create a new `identifier` object:', function () {
            var name = {};
            var identifier = astCreatorService.identifier(name);
            expect(identifier.type).to.equal('Identifier');
            expect(identifier.name).to.equal(name);
        });
    });

    describe('ASTCreatorService.literal:', function () {
        it('should create a new `literal` object:', function () {
            var value = {};
            var literal = astCreatorService.literal(value);
            expect(literal.type).to.equal('Literal');
            expect(literal.value).to.equal(value);
        });

        it('should have the `raw` value if the literal is a RegExp:', function () {
            var value = /RegExp/;
            var literal = astCreatorService.literal(value);
            expect(literal.raw).to.equal('/RegExp/');
        });
    });
});
