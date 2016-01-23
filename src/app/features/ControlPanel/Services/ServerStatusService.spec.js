/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';
import sinon from 'sinon';
import dirtyChai from 'dirty-chai';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Testing:
import './ServerStatusService';
let serverStatusService;

describe('ServerStatusService.js:', () => {
    let $rootScope;
    let notifierService;
    let realTimeService;

    beforeEach(() => {
        angular.mock.module('tractor.serverStatusService');

        angular.mock.module($provide => {
            $provide.factory('notifierService', () => {
                notifierService = {};
                return notifierService;
            });
            $provide.factory('realTimeService', () => {
                realTimeService = {};
                return realTimeService;
            });
        });

        angular.mock.inject((_$rootScope_, _serverStatusService_) => {
            $rootScope = _$rootScope_;
            serverStatusService = _serverStatusService_;
        });
    });

    describe('ServerStatusService.monitorServerStatus:', () => {
        it('should watch connect to the "server-status" room', () => {
            let options = {};

            realTimeService.connect = angular.noop;
            sinon.stub(realTimeService, 'connect');

            serverStatusService.monitorServerStatus(options);

            expect(realTimeService.connect).to.have.been.calledWith('server-status');
        });

        it('should listen for a "connect" event and set `isServerRunning`', () => {
            let options = {};

            sinon.spy($rootScope, '$apply');
            realTimeService.connect = angular.noop;
            sinon.stub(realTimeService, 'connect')

            serverStatusService.monitorServerStatus(options);
            let [, handlers] = realTimeService.connect.getCall(0).args;

            expect(handlers.connect).not.to.be.undefined();
            handlers.connect();

            expect(serverStatusService.isServerRunning).to.equal(true);
            expect($rootScope.$apply).to.have.been.called();
        });

        it('should listen for a "disconnect" and set `isServerRunning`', () => {
            let options = {};

            sinon.spy($rootScope, '$apply');
            notifierService.error = angular.noop;
            sinon.stub(notifierService, 'error');
            realTimeService.connect = angular.noop;
            sinon.stub(realTimeService, 'connect');

            serverStatusService.monitorServerStatus(options);
            let [, handlers] = realTimeService.connect.getCall(0).args;

            expect(handlers.disconnect).not.to.be.undefined();
            handlers.disconnect();

            expect(serverStatusService.isServerRunning).to.equal(false);
            expect(notifierService.error).to.have.been.calledWith('Tractor server disconnected...');
            expect($rootScope.$apply).to.have.been.called();
        });
    });
});
