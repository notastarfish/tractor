'use strict';

// Constants:
const TEN_SECONDS = 10000;

// Dependencies:
import angular from 'angular';
import NotificationTypes from './NotificationTypes';

class NotifierService {
    constructor (
        $interval
    ) {
        this.$interval = $interval;
        this.notifications = [];
    }

    success (message) {
        addNotification.call(this, {
            message,
            type: NotificationTypes.SUCCESS
        });
    }

    info (message) {
        addNotification.call(this, {
            message,
            type: NotificationTypes.INFO
        });
    }

    error (message) {
        addNotification.call(this, {
            message,
            type: NotificationTypes.ERROR
        });
    }

    dismiss (toRemove) {
        this.notifications.splice(this.notifications.indexOf(toRemove), 1);
    }
}

function addNotification (notification) {
    this.notifications.push(notification);
    this.$interval(() => {}, 0, 1);
    this.$interval(() => {
        this.dismiss(notification);
    }, TEN_SECONDS, 1);
}

export default angular.module('notifierService', [])
.service('notifierService', (
    $interval
) => new NotifierService($interval));
