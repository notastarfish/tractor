'use strict';

// Dependencies:
import angular from 'angular';
import BrowserMethods from './BrowserMethods';

function createBrowserModelConstructor () {
    return class BrowserModel {
        constructor () {
            this.name = 'browser';
            this.variableName = this.name;

            this.methods = [
                BrowserMethods.GET,
                BrowserMethods.REFRESH,
                BrowserMethods.SET_LOCATION,
                BrowserMethods.GET_LOCATION_ABS_URL,
                BrowserMethods.WAIT_FOR_ANGULAR
            ];
        }
    }
}

export default angular.module('browserModel', [])
.factory('BrowserModel', createBrowserModelConstructor);
