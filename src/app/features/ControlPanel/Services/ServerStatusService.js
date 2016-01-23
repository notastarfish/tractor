'use strict';

// Constants:
const DISCONNECT_MESSAGE = 'Tractor server disconnected...';

// Dependencies:
import angular from 'angular';
import NotifierService from '../../../Core/Components/Notifier/NotifierService';
import RealTimeService from '../../../Core/Services/RealTimeService';

// Symbols:
const isServerRunning = Symbol();

class ServerStatusService {
    constructor (
        $rootScope,
        notifierService,
        realTimeService
    ) {
        this.$rootScope = $rootScope;
        this.notifierService = notifierService;
        this.realTimeService = realTimeService;

        this[isServerRunning] = false;
    }

    get isServerRunning () {
        return this[isServerRunning];
    }

    monitorServerStatus () {
        this.realTimeService.connect('server-status', {
            connect: onConnect.bind(this),
            disconnect: onDisconnect.bind(this)
        });
    }
}

function onConnect () {
    this[isServerRunning] = true;
    this.$rootScope.$apply();
}

function onDisconnect () {
    this[isServerRunning] = false;
    this.$rootScope.$apply();
    this.notifierService.error(DISCONNECT_MESSAGE);
}

export default angular.module('tractor.serverStatusService', [
    NotifierService.name,
    RealTimeService.name
])
.service('serverStatusService', ServerStatusService);
