'use strict';

// Utilities:
import assert from 'assert';

// Dependencies:
import angular from 'angular';
import MockModel from '../Models/MockModel';

class MockParserService {
    constructor (
        MockModel
    ) {
        this.MockModel = MockModel;
    }

    parse (step, ast) {
        try {
            let mock = new this.MockModel(step);

            let mockCallExpression = ast.expression;

            mock.action = parseAction(mock, mockCallExpression);
            mock.url = parseUrl(mock, mockCallExpression);

            try {
                return parseData(mock, mockCallExpression);
            } catch (e) {}

            try {
                return parsePassThrough(mock, mockCallExpression);
            } catch (e) {}

            throw new Error();
        } catch (e) {
            console.warn('Invalid mock:', ast);
            return null;
        }
    }
}

function parseAction (mock, mockCallExpression) {
    let action = mockCallExpression.callee.object.callee.property.name.replace(/^when/, '');
    assert(action);
    assert(mock.actions.includes(action));
    return action;
}

function parseUrl (mock, mockCallExpression) {
    let [argument] = mockCallExpression.callee.object.arguments.reverse();
    let url = argument.raw;
    let urlRegex = new RegExp(url.replace(/^\//, '').replace(/\/$/, ''));
    assert(urlRegex);
    return urlRegex.source;
}

function parseData (mock, mockCallExpression) {
    let [argument] = mockCallExpression.arguments;
    let instanceName = argument.name;
    mock.data = mock.step.stepDefinition.mockDataInstances.find(mockDataInstance => {
        return mockDataInstance.variableName === instanceName;
    });
    return mock;
}

function parsePassThrough (mock, mockCallExpression) {
    assert(mockCallExpression.callee.property.name === 'passThrough');
    mock.passThrough = true;
    return mock;
}

export default angular.module('mockParserService', [
    MockModel.name
])
.service('MockParserService', MockParserService);
