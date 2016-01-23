'use strict';

export default class NotifierController {
    constructor (
        notifierService
    ) {
        this.notifications = notifierService.notifications;
        this.dismiss = notifierService.dismiss;
    }
}
