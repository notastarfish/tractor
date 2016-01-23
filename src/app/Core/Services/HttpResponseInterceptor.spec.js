/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Testing:
import './HttpResponseInterceptor';
let httpResponseInterceptor;

describe('HttpResponseInterceptor.js:', () => {
    let notifierService;

    beforeEach(() => {
        angular.mock.module('tractor.httpResponseInterceptor');

        angular.mock.module((_$httpProvider_, $provide) => {
            $provide.factory('notifierService', () => {
                notifierService = {};
                return notifierService;
            });
        });

        angular.mock.inject(_httpResponseInterceptor_ => {
            httpResponseInterceptor = _httpResponseInterceptor_;
        });
    });

    describe('HttpResponseInterceptor.response:', () => {
        it('should return the `data` property off the `response` object:', () => {
            let originalResponse = {
                data: 'data',
                config: {
                    url: ''
                }
            };

            return httpResponseInterceptor.response(originalResponse)
            .then(interceptedResponse => {
                expect(interceptedResponse).to.equal('data');
            });
        });

        it('should return the original `response` if the URL ends in ".html":', () => {
            let originalResponse = {
                data: 'data',
                config: {
                    url: '.html'
                }
            };

            return httpResponseInterceptor.response(originalResponse)
            .then(interceptedResponse => {
                expect(interceptedResponse).to.equal(originalResponse);
            });
        });
    });

    describe('HttpResponseInterceptor.responseError:', () => {
        it('should pass any `error` property on the `response.data` to the `NotifierService`:', () => {
            let originalResponse = {
                data: {
                    error: 'error'
                }
            };

            notifierService.error = angular.noop;
            sinon.stub(notifierService, 'error');

            return httpResponseInterceptor.responseError(originalResponse)
            .catch(() => {
                expect(notifierService.error).to.have.been.calledWith('error');
            })
        });
    });
});
