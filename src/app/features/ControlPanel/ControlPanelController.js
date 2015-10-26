'use strict';

// Dependencies:
import angular from 'angular';
import RunnerService from './Services/RunnerService';
import ServerStatusService from './Services/ServerStatusService';

class ControlPanelController {
    constructor (
        runnerService,
        serverStatusService,
        config
    ) {
        this.runnerService = runnerService;
        this.serverStatusService = serverStatusService;
        this.environments = config.environments;
        let [environment] = this.environments
        this.environment = environment;
    }

    runProtractor () {
        this.runnerService.runProtractor({
            baseUrl: this.environment
        });
    }

    isServerRunning () {
        return this.serverStatusService.isServerRunning();
    }
}

export default angular.module('controlPanelController', [
    RunnerService.name,
    ServerStatusService.name
])
.controller('ControlPanelController', ControlPanelController);
