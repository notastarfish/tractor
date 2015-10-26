'use strict';

// Dependencies:
import angular from 'angular';
import PersistentStateService from '../../Services/PersistentStateService';

class PanelHandleDirective {
    constructor (
        persistentStateService
    ) {
        this.persistentStateService = persistentStateService;

        this.restrict = 'E';
    }

    link ($scope, $element, $attrs) {
        let $handle = $element;
        let [handle] = $handle;
        let $parent = $handle.parent();
        let [parent] = $parent;
        let $children = $parent.children();
        let $siblings = [].filter.call($children, element => element !== handle);
        let panelName = $attrs.panelName;

        let [beforeElement] = $siblings;
        let [afterElement] = $siblings.reverse();

        $handle.data('parent', parent);
        $handle.data('beforeElement', beforeElement);
        $handle.data('afterElement', afterElement);
        $handle.data('panelName', panelName);

        handle.addEventListener('mousedown', mousedown.bind(this.$handle));

        let panelHandlePosition = this.persistentStateService.get(panelName);
        if (panelHandlePosition) {
            beforeElement.style.width = panelHandlePosition.before;
            afterElement.style.width = panelHandlePosition.after;
        }
    }
}

function mousedown ($handle) {
    angular.element(document.body).data('handle', $handle);
    document.body.classList.add('resizing');
    document.body.addEventListener('mousemove', mousemove);
    document.body.addEventListener('mouseup', mouseup.bind(this));
}

function mousemove (event) {
    let $body = angular.element(document.body);
    let $handle = $body.data('handle');
    let parent = $handle.data('parent');
    let beforeElement = $handle.data('beforeElement');
    let afterElement = $handle.data('afterElement');
    let containerWidth = parseFloat(window.getComputedStyle(parent).width);
    let percent = Math.max(10, event.clientX / containerWidth * 100);
    percent = Math.min(percent, 70);
    beforeElement.style.width = `${percent}%`;
    afterElement.style.width = `${100 - 0.25 - percent}%`;
}

function mouseup () {
    let $body = angular.element(document.body);
    let $handle = $body.data('handle');
    let beforeElement = $handle.data('beforeElement');
    let afterElement = $handle.data('afterElement');
    let panelName = $handle.data('panelName');
    document.body.classList.remove('resizing');
    document.body.removeEventListener('mousemove', mousemove);
    document.body.removeEventListener('mouseup', mouseup);
    let before = beforeElement.style.width;
    let after = afterElement.style.width;
    this.persistentStateService.set(panelName, { before, after });
}

export default angular.module('tractorPanelHandle', [
    PersistentStateService.name
])
.directive('tractorPanelHandle', PanelHandleDirective);
