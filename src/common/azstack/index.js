import * as logLevelConstants from './constant/logLevel';
import * as serviceTypes from './constant/serviceTypes';

import Logger from './helper/logger';
import Authentication from './core/authentication';

class AZStack {
    constructor() {
        this.chatProxy = 'https://www.azhub.xyz:9199';
        this.logLevelConstants = logLevelConstants;
        this.serviceTypes = serviceTypes;
        this.logLevel = this.logLevelConstants.LOG_LEVEL_NONE;

        this.slaveSocket = null;
        this.authenticatingData = {};
        this.authenticatedUser = {};
    };

    config(options) {
        if (options.logLevel) {
            this.logLevel = options.logLevel;
        }
    };

    init() {
        this.Logger = new Logger();
        this.Logger.setLogLevel(this.logLevel);
        this.Authentication = new Authentication({ logLevelConstants: this.logLevelConstants, serviceTypes: this.serviceTypes, Logger: this.Logger });
    };

    connect() {
        this.init();
        this.Authentication.getSlaveSocket({
            chatProxy: this.chatProxy
        }, (slaveSocket) => {
            console.log(slaveSocket);
        });
    };
};

export default AZStack;