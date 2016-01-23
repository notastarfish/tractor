/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import socket from 'socket.io-client';

// Testing:
import './RealTimeService';
let realTimeService;

describe('RealTimeService.js:', () => {
    let config;

    beforeEach(() => {
        angular.mock.module('tractor.realTimeService');

        angular.mock.module($provide => {
            $provide.factory('config', () => {
                config = {};
                return config;
            });
        });

        angular.mock.inject(_realTimeService_ => {
            realTimeService = _realTimeService_;
        });
    });

    describe('RealTimeService.connect:', () => {
        it('should connect to the given room via the port in the config:', () => {
            let connection = {};
            let events = {};

            config.port = 1234;
            sinon.stub(socket, 'connect').returns(connection);

            let connected = realTimeService.connect('room', events);

            expect(connected).to.equal(connection);
            expect(socket.connect).to.have.been.calledWith('http://localhost:1234/room');

            socket.connect.restore();
        });

        it('should attach the given events to the connection:', () => {
            let connection = {
                on: angular.noop
            };
            let events = {
                event: angular.noop
            };

            sinon.stub(socket, 'connect').returns(connection);
            sinon.spy(connection, 'on');

            realTimeService.connect('room', events);

            expect(connection.on).to.have.been.calledWith('event', angular.noop);

            socket.connect.restore();
        });
    });
});
