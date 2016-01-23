'use strict';

// Dependencies:
import angular from 'angular';
import BrowserMethods from './BrowserMethods';

// Symbols:
const name = Symbol();

function createBrowserModelConstructor () {
    return class BrowserModel {
        constructor () {
            this[name] = 'browser';

            this.methods = [
                BrowserMethods.GET,
                BrowserMethods.REFRESH,
                BrowserMethods.SET_LOCATION,
                BrowserMethods.GET_LOCATION_ABS_URL,
                BrowserMethods.WAIT_FOR_ANGULAR
            ];
        }

        get name () {
            return this[name];
        }

        get variableName () {
            return this[name];
        }
    }
}

export default angular.module('tractor.browserModel', [])
.factory('BrowserModel', createBrowserModelConstructor);
