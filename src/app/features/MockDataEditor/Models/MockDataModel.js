'use strict';

// Dependencies:
import angular from 'angular';

function createMockDataModelConstructor () {
    const json = Symbol();

    return class MockDataModel {
        constructor (_json = '{}', options = {}) {
            this[json] = json;
            this.options = options;

            this.name = '';
        }

        get isSaved () {
            return !!this.options.isSaved;
        }

        get path () {
            return this.options.path;
        }

        get json () {
            let formatted;
            try {
                formatted = JSON.stringify(JSON.parse(this[json]), null, '    ');
            } catch (e) {
                formatted = json;
            }
            return formatted;
        }

        set function (newJSON) {
            this[json] = newJSON;
        }

        get data () {
            return this.json;
        }
    };
}

export default angular.module('mockDataModel', [])
.factory('MockDataModel', createMockDataModelConstructor);
