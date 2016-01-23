/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Testing:
import './RunnerService';
let runnerService;

describe('RunnerService.js:', () => {
    let notifierService;
    let realTimeService;

    beforeEach(() => {
        angular.mock.module('tractor.runnerService');

        angular.mock.module($provide => {
            $provide.factory('notifierService', () => {
                notifierService = {};
                return notifierService;
            })
            $provide.factory('realTimeService', () => {
                realTimeService = {};
                return realTimeService;
            });
        });

        angular.mock.inject((_runnerService_) => {
            runnerService = _runnerService_;
        });
    });

    describe('RunnerService.runProtractor:', () => {
        it('should watch connect to the "run-protractor" room', () => {
            let connection = {};
            let options = {};

            connection.emit = angular.noop;
            realTimeService.connect = angular.noop;
            sinon.stub(realTimeService, 'connect').returns(connection);

            runnerService.runProtractor(options);

            expect(realTimeService.connect).to.have.been.calledWith('run-protractor');
        });

        it('should emit a "run" event to the server', () => {
            let connection = {};
            let options = {};

            connection.emit = angular.noop;
            sinon.stub(connection, 'emit');
            realTimeService.connect = angular.noop;
            sinon.stub(realTimeService, 'connect').returns(connection);

            runnerService.runProtractor(options);

            expect(connection.emit).to.have.been.calledWith('run', options);
        });

        it('should listen for a "protractor-out" event and notify the user', () => {
            let connection = {
                emit: angular.noop
            };
            let options = {};
            let data = {
                message: 'message',
                type: 'info'
            };

            notifierService.info = angular.noop;
            sinon.stub(notifierService, 'info');
            realTimeService.connect = angular.noop;
            sinon.stub(realTimeService, 'connect').returns(connection);

            runnerService.runProtractor(options);
            let [, handlers] = realTimeService.connect.getCall(0).args;

            expect(handlers['protractor-out']).not.to.be.undefined();
            handlers['protractor-out'](data);

            expect(notifierService.info).to.have.been.calledWith('message');
        });

        it('should listen for a "protractor-err" event and notify the user', () => {
            let connection = {
                emit: angular.noop
            };
            let options = {};
            let data = {
                message: 'message',
                type: 'error'
            };

            notifierService.error = angular.noop;
            sinon.stub(notifierService, 'error');
            realTimeService.connect = angular.noop;
            sinon.stub(realTimeService, 'connect').returns(connection);

            runnerService.runProtractor(options);
            let [, handlers] = realTimeService.connect.getCall(0).args;

            expect(handlers['protractor-err']).not.to.be.undefined();
            handlers['protractor-err'](data);

            expect(notifierService.error).to.have.been.calledWith('message');
        });
    });
});
