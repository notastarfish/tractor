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
import './ASTCreatorService';
let astCreatorService;

describe('ASTCreatorService.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.astCreatorService');

        angular.mock.inject((_astCreatorService_) => {
            astCreatorService = _astCreatorService_;
        });
    });

    describe('ASTCreatorService.expressionStatement:', () => {
        it('should create a new `expressionStatement` object:', () => {
            let expression = {};

            let expressionStatement = astCreatorService.expressionStatement(expression);

            expect(expressionStatement.type).to.equal('ExpressionStatement');
            expect(expressionStatement.expression).to.equal(expression);
        });
    });

    describe('ASTCreatorService.identifier:', () => {
        it('should create a new `identifier` object:', () => {
            let name = {};

            let identifier = astCreatorService.identifier(name);

            expect(identifier.type).to.equal('Identifier');
            expect(identifier.name).to.equal(name);
        });
    });

    describe('ASTCreatorService.literal:', () => {
        it('should create a new `literal` object:', () => {
            let value = {};

            let literal = astCreatorService.literal(value);

            expect(literal.type).to.equal('Literal');
            expect(literal.value).to.equal(value);
        });

        it('should have the `raw` value if the literal is a RegExp:', () => {
            let value = /RegExp/;

            let literal = astCreatorService.literal(value);

            expect(literal.raw).to.equal('/RegExp/');
        });
    });
});
