'use strict';

// Utilities:
import Promise from 'bluebird';

// Dependencies:
import angular from 'angular';

class HttpResponseInterceptor {
    constructor (
        notifierService
    ) {
        this.notifierService = notifierService;
    }

    handleResponseData (response) {
        return Promise.resolve(response.config.url.match(/.html$/) ? response : response.data);
    }

    handleResponseError (response) {
        let error = new Error();
        this.notifierService.error(response.data.error);
        error.message = response.data.error;
        error.response = response;
        return Promise.reject(error);
    }
}

export default angular.module('httpResponseInterceptor', [])
.factory('httpResponseInterceptor', HttpResponseInterceptor)
.config($httpProvider => $httpProvider.interceptors.push('httpResponseInterceptor'));
