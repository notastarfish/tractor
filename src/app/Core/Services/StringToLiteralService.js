'use strict';

// Utilities:
import isNumber from 'lodash.isnumber';

// Dependencies:
import angular from 'angular';

class StringToLiteralService {
    toLiteral (value) {
        let boolean = toBoolean(value);
        let number = toNumber(value);
        let nil = toNull(value);
        if (boolean != null) {
            return boolean;
        } else if (number != null) {
            return number;
        } else if (nil === null) {
            return nil;
        } else {
            return value;
        }
    }
}

function toBoolean (value) {
    if (value === 'true') {
        return true;
    } else if (value === 'false') {
        return false;
    }
}

function toNumber (value) {
    let number = +value;
    if (value === 'NaN') {
        return NaN;
    } else if (value && isNumber(number) && !Number.isNaN(number)) {
        return number;
    }
}

function toNull (value) {
    if (value === 'null') {
        return null;
    }
}

export default angular.module('stringToLiteralService', [])
.service('stringToLiteralService', StringToLiteralService);
