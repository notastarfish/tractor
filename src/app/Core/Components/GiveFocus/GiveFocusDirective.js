'use strict';

// Dependencies:
import angular from 'angular';

class GiveFocusDirective {
    constructor () {
        this.restrict = 'A';

        this.scope = {
            focusOn: '='
        };
    }

    link ($scope, $element) {
        $scope.$watch('focusOn', currentValue => {
            let [input] = $element;
            if (currentValue) {
                input.focus();
                input.select();
            } else {
                input.blur();
            }
        });
    }
}

export default angular.module('tractorGiveFocus', [])
.directive('tractorGiveFocus', GiveFocusDirective);
