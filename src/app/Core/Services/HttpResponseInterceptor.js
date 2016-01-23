'use strict';

// Utilities:
import Promise from 'bluebird';

// Dependencies:
import angular from 'angular';

const HttpResponseInterceptor = notifierService => {
    const handleResponseData = response => {
        return Promise.resolve(response.config.url.match(/.html$/) ? response : response.data);
    };

    const handleResponseError = response => {
        let error = new Error();
        notifierService.error(response.data.error);
        error.message = response.data.error;
        error.response = response;
        return Promise.reject(error);
    };

    return {
        response: handleResponseData,
        responseError: handleResponseError
    };
}

export default angular.module('tractor.httpResponseInterceptor', [])
.factory('httpResponseInterceptor', HttpResponseInterceptor)
.config($httpProvider => $httpProvider.interceptors.push('httpResponseInterceptor'));
