'use strict';

// Dependencies:
import angular from 'angular';
import socket from 'socket.io-client';

class RealTimeService {
    constructor (
        config
    ) {
        this.config = config;
    }

    connect (room, events) {
        let url = `http://localhost:${this.config.port}/${room}`;
        let connection = socket.connect(url, {
            forceNew: true
        });
        Object.entries(events).forEach(entry => {
            let [event, handler] = entry;
            connection.on(event, handler);
        });
        return connection;
    }
}

export default angular.module('realTimeService', [])
.service('realTimeService', RealTimeService);
