'use strict';

// Dependencies:
import angular from 'angular';
import ExpectationModel from '../Models/ExpectationModel';

class ExpectationParserService {
    constructor (
        ExpectationModel
    ) {
        this.ExpectationModel = ExpectationModel;
    }

    parse (step, ast) {
        try {
            let expectation = new this.ExpectationModel(step);
            let [firstArgument] = ast.arguments;
            expectation.value = firstArgument.value;

            let [expectationCallExpression] = ast.callee.object.object.object.arguments;

            expectation.component = parseComponent(expectation, expectationCallExpression);
            expectation.action = parseAction(expectation, expectationCallExpression);
            expectation.condition = ast.callee.property.name;
            parseArguments(expectation, expectationCallExpression);

            return expectation;
        } catch (e) {
            console.log(e.message);
            console.warn('Invalid expectation:', ast);
            return null;
        }
    }
}

function parseComponent (expectation, expectationCallExpression) {
    return expectation.step.stepDefinition.componentInstances.find(componentInstance => {
        return expectationCallExpression.callee.object.name === componentInstance.variableName;
    });
}

function parseAction (expectation, expectationCallExpression) {
    return expectation.component.component.actions.find(action => {
        return expectationCallExpression.callee.property.name === action.variableName;
    });
}

function parseArguments (expectation, expectationCallExpression) {
    expectationCallExpression.arguments.forEach((argument, index) => {
        expectation.arguments[index].value = argument.value;
    });
}

export default angular.module('tractor.expectationParserService', [
    ExpectationModel.name
])
.service('expectationParserService', ExpectationParserService);
