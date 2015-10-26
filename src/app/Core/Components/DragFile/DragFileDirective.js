'use strict';

// Dependencies:
import angular from 'angular';

class DragFileDirective {
    constructor () {
        this.restrict = 'A';
    }

    link ($scope, $element) {
        let [element] = $element;

        element.draggable = true;
        element.addEventListener('dragstart', event => dragstart($scope, event));
        element.addEventListener('dragend', dragend);
    }
}

function dragstart ($scope, event) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('file', JSON.stringify($scope.item));
    this.classList.add('drag');
    return false;
}

function dragend () {
    this.classList.remove('drag');
    return false;
}

export default angular.module('tractorDragFile', [])
.directive('tractorDragFile', DragFileDirective);
