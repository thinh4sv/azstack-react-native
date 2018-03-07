class Notification {
    constructor(options) {
        this.logLevelConstants = options.logLevelConstants;
        this.serviceTypes = options.serviceTypes;
        this.errorCodes = options.errorCodes;
        this.Logger = options.Logger;
        this.sendPacketFunction = options.sendPacketFunction;
    };

    sendChangeApplicationState(options, callback) {

        return new Promise((resolve, reject) => {

            const changeApplicationStatePacket = {
                service: this.serviceTypes.APPLICATION_CHANGE_STATE,
                body: JSON.stringify({
                    state: options.state
                })
            };
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                message: 'Send change application state'
            });
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_DEBUG, {
                message: 'Change application state packet',
                payload: changeApplicationStatePacket
            });
            this.sendPacketFunction(changeApplicationStatePacket).then(() => {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                    message: 'Send change application state successfully'
                });
                resolve();
            }).catch((error) => {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Cannot send change application state, change application state fail'
                });
                reject({
                    code: error.code,
                    message: 'Cannot send change application state, change application state fail'
                });
            });
        });
    };
    receiveChangeApplicationState(body) {
        return new Promise((resolve, reject) => {

            this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                message: 'Got change application state'
            });
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_DEBUG, {
                message: 'Change application state data',
                payload: body
            });

            resolve({});
        });
    };

    sendNotificationRegisterDevice(options, callback) {

        return new Promise((resolve, reject) => {

            const pushNotificationRegisterDevicePacket = {
                service: this.serviceTypes.PUSH_NOTIFICATION_REGISTER_DEVICE_SEND,
                body: JSON.stringify({
                    id: options.deviceToken,
                    type: options.devicePlatform,
                    appBundleId: options.applicationBundleId
                })
            };
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                message: 'Send push notification register device'
            });
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_DEBUG, {
                message: 'Push notification register device packet',
                payload: pushNotificationRegisterDevicePacket
            });
            this.sendPacketFunction(pushNotificationRegisterDevicePacket).then(() => {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                    message: 'Send push notification register device data successfully'
                });
                resolve();
            }).catch((error) => {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Cannot send push notification register device data, notification register device fail'
                });
                reject({
                    code: error.code,
                    message: 'Cannot send push notification register device data, notification register device fail'
                });
            });
        });
    };
    receiveNotificationRegisterDevice(body) {
        return new Promise((resolve, reject) => {

            if (!body) {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Cannot detect notification register device result, ignored'
                });
                reject({
                    code: this.errorCodes.ERR_UNEXPECTED_RECEIVED_DATA,
                    message: 'Cannot detect notification register device result'
                });
                return;
            }

            this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                message: 'Got notification register device result'
            });
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_DEBUG, {
                message: 'Notification register device result',
                payload: body
            });

            if (body.r !== this.errorCodes.REQUEST_SUCCESS_FROM_SERVER) {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Server response with error, notification register device fail'
                });
                reject({
                    code: this.errorCodes.ERR_UNEXPECTED_RECEIVED_DATA,
                    message: 'Server response with error, notification register device fail'
                });
                return;
            }

            resolve({});
        });
    };
};

export default Notification;