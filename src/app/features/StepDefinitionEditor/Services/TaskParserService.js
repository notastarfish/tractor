'use strict';

// Utilities:
import assert from 'assert';

// Dependencies:
import angular from 'angular';
import TaskModel from '../Models/TaskModel';

class TaskParserService {
    constructor (
        TaskModel
    ) {
        this.TaskModel = TaskModel;
    }

    parse (step, ast) {
        try {
            this.parseNextTask(step, ast);

            let parsers = [parseFirstTask, parseSubsequentTask];
            let taskCallExpression = parseTaskCallExpression(ast, parsers);

            try {
                return parseTask(step, taskCallExpression);
            } catch (e) {}

            throw new Error();
        } catch (e) {
            console.warn('Invalid task:', ast);
            return null;
        }
    }

    parseNextTask (step, ast) {
        try {
            assert(ast.callee.object.callee);
            this.parse(step, ast.callee.object);
        } catch (e) {}
    }
}

function parseTaskCallExpression (ast, parsers) {
    let taskCallExpression = null;
    parsers.filter(parser => {
        try {
            taskCallExpression = parser(ast);
        } catch (e) {}
    });
    if (!taskCallExpression) {
        throw new Error();
    }
    return taskCallExpression;
}

function parseFirstTask (ast) {
    assert(ast.callee.object.name && ast.callee.property.name);
    return ast;
}

function parseSubsequentTask (ast) {
    let [thenFunctionExpression] = ast.arguments;
    let [taskReturnStatement] = thenFunctionExpression.body.body;
    return taskReturnStatement.argument;
}

function parseTask (step, taskCallExpression) {
    let task = new TaskModel(step);
    task.component = task.step.stepDefinition.componentInstances.find(componentInstance => {
        return taskCallExpression.callee.object.name === componentInstance.variableName;
    });
    task.action = task.component.component.actions.find(action => {
        return taskCallExpression.callee.property.name === action.variableName;
    });
    taskCallExpression.arguments.forEach((argument, index) => {
        task.arguments[index].value = argument.value;
    });
    task.step.tasks.push(task);
    return true;
}

export default angular.module('taskParserService', [
    TaskModel.name
])
.service('TaskParserService', TaskParserService);
