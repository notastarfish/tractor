/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);

// Testing:
import './BrowserModel';
let BrowserModel;

describe('BrowserModel.js:', () => {
    beforeEach(() => {
        angular.mock.module('tractor.browserModel');

        angular.mock.inject(_BrowserModel_ => {
            BrowserModel = _BrowserModel_;
        });
    });

    describe('BrowserModel constructor:', () => {
        it('should create a new `BrowserModel`:', () => {
            let browserModel = new BrowserModel();
            expect(browserModel).to.be.an.instanceof(BrowserModel);
        });

        it('should have default properties:', () => {
            let browserModel = new BrowserModel();

            expect(browserModel.name).to.equal('browser');
            expect(browserModel.variableName).to.equal('browser');
        });

        it('should have data about all the browser methods from Protractor:', () => {
            let browserModel = new BrowserModel();

            let [get, refresh, setLocation, getLocationAbsUrl, waitForAngular] = browserModel.methods;

            expect(get.name).to.equal('get');
            expect(refresh.name).to.equal('refresh');
            expect(setLocation.name).to.equal('setLocation');
            expect(getLocationAbsUrl.name).to.equal('getLocationAbsUrl');
            expect(waitForAngular.name).to.equal('waitForAngular');
        });
    });
});
