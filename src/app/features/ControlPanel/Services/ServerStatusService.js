'use strict';

// Dependencies:
import angular from 'angular';
import NotifierService from '../../../Core/Components/Notifier/NotifierService';
import RealTimeService from '../../../Core/Services/RealTimeService';

class ServerStatusService {
    constructor (
        $rootScope,
        notifierService,
        realTimeService
    ) {
        this.$rootScope = $rootScope;
        this.notifierService = notifierService;
        this.realTimeService = realTimeService;

        this.isServerRunning = false;
        this.monitorServerStatus();
    }

    monitorServerStatus () {
        this.realTimeService.connect('server-status', {
            connect: onConnect.bind(this),
            disconnect: onDisconnect.bind(this)
        });
    }
}

function onConnect () {
    this.isServerRunning = true;
    this.$rootScope.$apply();
}

function onDisconnect () {
    this.isServerRunning = false;
    this.$rootScope.$apply();
    this.notifierService.error('Tractor server stalled...');
}

export default angular.module('serverStatusService', [
    NotifierService.name,
    RealTimeService.name
])
.service('serverStatusService', ServerStatusService);
