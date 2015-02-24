'use strict';

// Module:
var StepDefinitionEditor = require('../StepDefinitionEditor');

// Depenedencies:
require('../../../Core/Services/ASTCreatorService');

var createComponentInstanceModelConstructor = function (ASTCreatorService) {
    var ComponentInstanceModel = function ComponentInstanceModel (component) {
        Object.defineProperties(this, {
            component: {
                get: function () {
                    return component;
                }
            },
            name: {
                get: function () {
                    return component.name.charAt(0).toLowerCase() + component.name.slice(1);
                }
            },
            ast: {
                get: function () {
                    return toAST.call(this);
                }
            }
        });
    };

    return ComponentInstanceModel;

    function toAST () {
        var ast = ASTCreatorService;

        var componentNameIdentifier = ast.identifier(this.component.name);
        var requirePathLiteral = ast.literal('../components/' + this.component.name + '.component');
        var requireCallExpression = ast.callExpression(ast.identifier('require'), [requirePathLiteral]);
        var importDeclarator = ast.variableDeclarator(componentNameIdentifier, requireCallExpression);
        var importDeclaration = ast.variableDeclaration([importDeclarator]);

        var newComponentNewStatement = ast.newExpression(componentNameIdentifier);
        var newComponentIdentifier = ast.identifier(this.name);
        var newComponentDeclarator = ast.variableDeclarator(newComponentIdentifier, newComponentNewStatement);
        var newComponentDeclaration = ast.variableDeclaration([newComponentDeclarator]);
        return [importDeclaration, newComponentDeclaration];
    }
};

StepDefinitionEditor.factory('ComponentInstanceModel', function (ASTCreatorService) {
    return createComponentInstanceModelConstructor(ASTCreatorService);
});
