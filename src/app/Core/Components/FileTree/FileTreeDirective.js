'use strict';

// Dependencies:
import angular from 'angular';
import FileTreeController from './FileTreeController';
import template from './FileTree.html';

class FileTreeDirective {
    constructor () {
        this.restrict = 'E';

        this.scope = {
            model: '=',
            type: '@'
        };

        this.template = template;

        this.controller = 'FileTreeController';
        this.controllerAs = 'fileTree';
        this.bindToController = true;

        this.link = $scope => {
            if (angular.isUndefined($scope.fileTree.model)) {
                throw new Error('The <tractor-file-tree> directive requires a "model" attribute.');
            }

            if (angular.isUndefined($scope.fileTree.type)) {
                throw new Error('The <tractor-file-tree> directive requires a "type" attribute.');
            }
        };
    }
}

export default angular.module('tractor.fileTree', [
    FileTreeController.name
])
.directive('tractorFileTree', () => new FileTreeDirective());
