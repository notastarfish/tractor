/* global describe:true, it:true */
'use strict';

// Utilities:
import _ from 'lodash';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(sinonChai);

// Dependencies:
import config from '../config';

// Under test:
import getConfig from './get-config';

describe('server/api: get-config', () => {
    it('should respond with the current config:', () => {
        let request = { };
        let response = {
            send: _.noop
        };
        let oldConfig = config.config;
        config.config = {};

        sinon.stub(response, 'send');

        getConfig.handler(request, response);

        expect(response.send).to.have.been.calledWith({});

        config.config = oldConfig;
    });
});
