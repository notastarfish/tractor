'use strict';

// Dependencies:
import angular from 'angular';
import NotifierService from '../../../Core/Components/Notifier/NotifierService';
import RealTimeService from '../../../Core/Services/RealTimeService';

class RunnerService {
    constructor (
        notifierService,
        realTimeService
    ) {
        this.notifierService = notifierService;
        this.realTimeService = realTimeService;
    }

    runProtractor (options) {
        let connection = this.realTimeService.connect('run-protractor', {
            'protractor-out': notify.bind(this),
            'protractor-err': notify.bind(this)
        });
        connection.emit('run', options);
    }
}

function notify (data) {
    let { type, message } = data;
    this.notifierService[type](message);
}

export default angular.module('tractor.runnerService', [
    NotifierService.name,
    RealTimeService.name
])
.service('runnerService', RunnerService);
