'use strict';

// Dependencies:
import angular from 'angular';
import ParameterModel from '../Models/ParameterModel';

class ParameterParserService {
    constructor (
        ParameterModel
    ) {
        this.ParameterModel = ParameterModel
    }

    parse (action) {
        return new this.ParameterModel(action);
    }
}

export default angular.module('tractor.parameterParserService', [
    ParameterModel.name
])
.service('parameterParserService', ParameterParserService);
