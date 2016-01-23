'use strict';

// Dependencies:
import angular from 'angular';

// Symbols:
const json = Symbol();
const options = Symbol();

function createMockDataModelConstructor () {
    return class MockDataModel {
        constructor (_json = '{}', _options = {}) {
            this[json] = _json;
            this[options] = _options;

            this.name = '';
        }

        get isSaved () {
            return !!this[options].isSaved;
        }

        get path () {
            return this[options].path;
        }

        get json () {
            let formatted;
            try {
                formatted = JSON.stringify(JSON.parse(this[json]), null, '    ');
            } catch (e) {
                formatted = this[json];
            }
            return formatted;
        }

        set json (newJSON) {
            this[json] = newJSON;
        }

        get data () {
            return this.json;
        }
    };
}

export default angular.module('tractor.mockDataModel', [])
.factory('MockDataModel', createMockDataModelConstructor);
