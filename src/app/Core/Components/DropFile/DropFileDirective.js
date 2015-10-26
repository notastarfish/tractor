'use strict';

// Dependencies:
import angular from 'angular';

class DropFileDirective {
    constructor () {
        this.restrict = 'A';

        this.scope = {
            onDrop: '&',
            dropDirectory: '='
        }
    }

    link ($scope, $element) {
        let [element] = $element;

        element.addEventListener('dragover', dragover);
        element.addEventListener('dragenter', dragenter);
        element.addEventListener('dragleave', dragleave);
        element.addEventListener('drop', event => drop($scope, event));
    }
}

function dragover (event) {
    event.dataTransfer.dropEffect = 'move';
    event.preventDefault();
    event.stopPropagation();
    [].forEach.call(document.querySelectorAll('.dragover'), element => {
        element.classList.remove('dragover');
    });
    this.classList.add('dragover');
    return false;
}

function dragenter () {
    [].forEach.call(document.querySelectorAll('.dragover'), element => {
        element.classList.remove('dragover');
    });
    this.classList.add('dragover');
    return false;
}

function dragleave () {
    this.classList.remove('dragover');
    return false;
}

function drop ($scope, event) {
    event.preventDefault();
    event.stopPropagation();
    this.classList.remove('dragover');
    let file = JSON.parse(event.dataTransfer.getData('file'));
    let directory = $scope.dropDirectory;
    let dropHandler = $scope.onDrop();
    dropHandler(file, directory);
    return false;
}

export default angular.module('tractorDropFile', [])
.directive('tractorDropFile', DropFileDirective);
