'use strict';

// Dependencies:
import angular from 'angular';
import ArgumentModel from '../Models/ArgumentModel';

class ArgumentParserService {
    constructor (
        ArgumentModel
    ) {
        this.ArgumentModel = ArgumentModel
    }

    parse (method, argument, astObject) {
        argument = new this.ArgumentModel(method, argument);
        argument.value = astObject.name || astObject.value;

        return argument;
    }
}

export default angular.module('argumentParserService', [
    ArgumentModel.name
])
.service('argumentParserService', ArgumentParserService);
