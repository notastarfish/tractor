'use strict';

// Constants:
const PERSISTENT_STATE_KEY = 'PERSISTENT_STATE';

// Dependencies:
import angular from 'angular';

class PersistentStateService {
    constructor (
        localStorageService
    ) {
        this.localStorageService = localStorageService;
    }

    get (name) {
        let state = this.localStorageService.get(PERSISTENT_STATE_KEY) || {};
        return state[name] || {};
    }

    set (name, value) {
        let state = this.localStorageService.get(PERSISTENT_STATE_KEY) || {};
        state[name] = value;
        this.localStorageService.set(PERSISTENT_STATE_KEY, state);
    }

    remove (name) {
        let state = this.localStorageService.get(PERSISTENT_STATE_KEY) || {};
        delete state[name];
        this.localStorageService.set(PERSISTENT_STATE_KEY, state);
    }
}

export default angular.module('persistentStateService', [])
.service('persistentStateService', PersistentStateService);
