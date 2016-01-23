/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';
import sinon from 'sinon';

// Test setup:
const expect = chai.expect;

// Testing:
import './PersistentStateService';
let persistentStateService;

describe('PersistentStateService.js:', () => {
    let localStorageService;

    beforeEach(() => {
        angular.mock.module('tractor.persistentStateService');

        angular.mock.module($provide => {
            $provide.factory('localStorageService', () => {
                localStorageService = {};
                return localStorageService;
            });
        });

        angular.mock.inject((_$httpBackend_, _persistentStateService_) => {
            persistentStateService = _persistentStateService_;
        });
    });

    describe('persistentStateService.get:', () => {
        it('should get a value from the current saved state:', () => {
            let state = {
                key: 'value'
            };

            localStorageService.get = angular.noop;
            sinon.stub(localStorageService, 'get').returns(state);

            let value = persistentStateService.get('key');

            expect(value).to.equal('value');
        });

        it('should return an empty object when the current saved state is empty:', () => {
            localStorageService.get = angular.noop;
            sinon.stub(localStorageService, 'get').returns(null);

            let value = persistentStateService.get('key');

            expect(value).to.deep.equal({});
        });

        it('should return an empty object when there is not an associated key on the saved state:', () => {
            let state = {};

            localStorageService.get = angular.noop;
            sinon.stub(localStorageService, 'get').returns(state);

            let value = persistentStateService.get('key');

            expect(value).to.deep.equal({});

            localStorageService.get.restore();
        });
    });

    describe('persistentStateService.set:', () => {
        it('should set a value on the current saved state:', () => {
            let state = {};

            localStorageService.get = angular.noop;
            localStorageService.set = angular.noop;
            sinon.stub(localStorageService, 'get').returns(state);
            sinon.stub(localStorageService, 'set');

            persistentStateService.set('key', 'value');

            let call = localStorageService.set.getCall(0);
            let newState = call.args[1];
            expect(newState).to.deep.equal({ key: 'value' });
        });

        it('should create an object to represent the saved state and set a value to it:', () => {
            localStorageService.get = angular.noop;
            localStorageService.set = angular.noop;
            sinon.stub(localStorageService, 'get').returns(null);
            sinon.stub(localStorageService, 'set');

            persistentStateService.set('key', 'value');

            let call = localStorageService.set.getCall(0);
            let newState = call.args[1];
            expect(newState).to.deep.equal({ key: 'value' });
        });
    });

    describe('persistentStateService.remove:', () => {
        it('should remove a value from the current saved state:', () => {
            let state = {
                key: 'value'
            };

            localStorageService.get = angular.noop;
            localStorageService.set = angular.noop;
            sinon.stub(localStorageService, 'get').returns(state);
            sinon.stub(localStorageService, 'set');

            persistentStateService.remove('key');

            let call = localStorageService.set.getCall(0);
            let newState = call.args[1];
            expect(newState).to.deep.equal({});
        });

        it('should still work if there is no saved state:', () => {
            localStorageService.get = angular.noop;
            localStorageService.set = angular.noop;
            sinon.stub(localStorageService, 'get').returns(null);
            sinon.stub(localStorageService, 'set');

            persistentStateService.remove('key');

            let call = localStorageService.set.getCall(0);
            let newState = call.args[1];
            expect(newState).to.deep.equal({});
        });
    });
});
