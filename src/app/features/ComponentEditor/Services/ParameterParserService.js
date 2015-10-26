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
        return new ParameterModel(action);
    }
}

export default angular.module('parameterParserService', [
    ParameterModel.name
])
.service('parameterParserService', ParameterParserService);
