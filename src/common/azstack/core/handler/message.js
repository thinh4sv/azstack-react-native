import { CHAT_TYPE_USER } from "../constant/chatConstants";

class Message {
    constructor(options) {
        this.logLevelConstants = options.logLevelConstants;
        this.serviceTypes = options.serviceTypes;
        this.errorCodes = options.errorCodes;
        this.listConstants = options.listConstants;
        this.chatConstants = options.chatConstants;
        this.Logger = options.Logger;
        this.sendPacketFunction = options.sendPacketFunction;
    };

    sendGetUnreadMessages(options) {
        return new Promise((resolve, reject) => {

            const getUnreadMessagesPacket = {
                service: this.serviceTypes.MESSAGE_GET_LIST_UNREAD,
                body: JSON.stringify({
                    page: options.page,
                    type: options.chatType,
                    chatId: options.chatId
                })
            };
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                message: 'Send get unread messages packet'
            });
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_DEBUG, {
                message: 'Get unread messages packet',
                payload: getUnreadMessagesPacket
            });
            this.sendPacketFunction(getUnreadMessagesPacket).then(() => {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                    message: 'Send get unread messages packet successfully'
                });
                resolve();
            }).catch((error) => {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Cannot send get unread messages data, get unread messages fail'
                });
                reject({
                    code: error.code,
                    message: 'Cannot send get unread messages data, get unread messages fail'
                });
            });
        });
    };
    receiveUnreadMessages(body) {
        return new Promise((resolve, reject) => {
            if (!body) {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Cannot detect unread messages list, ignored'
                });
                reject({
                    code: this.errorCodes.ERR_UNEXPECTED_RECEIVED_DATA,
                    message: 'Cannot detect unread messages list, get unread messages fail'
                });
                return;
            }

            this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                message: 'Got unread messages list'
            });
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_DEBUG, {
                message: 'Unread messages list data',
                payload: body
            });

            let unreadMessages = {
                chatType: body.type,
                chatId: body.chatId,
                done: body.done,
                page: body.page,
                list: []
            };
            body.list.map((message) => {
                let unreadMessage = {
                    chatType: body.type,
                    chatId: body.chatId,
                    senderId: message.senderId,
                    receiverId: message.receiverId,
                    msgId: message.msgId,
                    type: 0,
                    status: message.status,
                    deleted: message.deleted,
                    created: message.created,
                    modified: message.modified
                };
                switch (message.serviceType) {
                    case this.serviceTypes.MESSAGE_SERVER_WITH_USER_TYPE_TEXT:
                        unreadMessage.type = this.chatConstants.MESSAGE_TYPE_TEXT;
                        unreadMessage.text = message.msg;
                        break;
                    case this.serviceTypes.MESSAGE_WITH_USER_TYPE_STICKER:
                        unreadMessage.type = this.chatConstants.MESSAGE_TYPE_STICKER;
                        unreadMessage.sticker = {
                            name: message.imgName,
                            catId: message.catId,
                            url: message.url,
                            width: message.width,
                            height: message.height
                        };
                        break;
                    case this.serviceTypes.MESSAGE_WITH_USER_TYPE_FILE:
                        unreadMessage.type = this.chatConstants.MESSAGE_TYPE_FILE;
                        unreadMessage.file = {
                            name: message.fileName,
                            length: message.fileLength,
                            type: message.type,
                            url: message.url,
                            width: message.width,
                            height: message.height,
                            duration: message.duration
                        };
                        break;
                    case this.serviceTypes.MESSAGE_WITH_USER_TYPE_LOCATION:
                        unreadMessage.type = this.chatConstants.MESSAGE_TYPE_LOCATION
                        unreadMessage.location = {
                            address: message.addr,
                            longitude: message.long,
                            latitude: message.lat
                        };
                        break;
                    case this.serviceTypes.MESSAGE_HAS_NEW_WITH_GROUP:
                        if (message.msg) {
                            unreadMessage.type = this.chatConstants.MESSAGE_TYPE_TEXT;
                            unreadMessage.text = message.msg;
                        } else if (message.imgName) {
                            unreadMessage.type = this.chatConstants.MESSAGE_TYPE_STICKER;
                            unreadMessage.sticker = {
                                name: message.imgName,
                                catId: message.catId,
                                url: message.url,
                                width: message.width,
                                height: message.height
                            };
                        } else if (message.fileName) {
                            unreadMessage.type = this.chatConstants.MESSAGE_TYPE_FILE;
                            unreadMessage.file = {
                                name: message.fileName,
                                length: message.fileLength,
                                type: message.type,
                                url: message.url,
                                width: message.width,
                                height: message.height,
                                duration: message.duration
                            };
                        } else if (message.addr) {
                            unreadMessage.type = this.chatConstants.MESSAGE_TYPE_LOCATION
                            unreadMessage.location = {
                                address: message.addr,
                                longitude: message.long,
                                latitude: message.lat
                            };
                        }
                        break;
                    case this.serviceTypes.ON_GROUP_CREATED:
                        unreadMessage.type = this.chatConstants.MESSAGE_TYPE_GROUP_CREATED;
                        unreadMessage.createdGroup = {
                            type: message.typeGroup,
                            groupId: message.group,
                            adminId: message.admin,
                            name: message.name,
                            memberIds: message.members,
                            created: message.created
                        };
                        break;
                    case this.serviceTypes.ON_GROUP_INVITED:
                        unreadMessage.type = this.chatConstants.MESSAGE_TYPE_GROUP_INVITED;
                        unreadMessage.invited = {
                            groupId: message.group,
                            inviteIds: message.invited
                        };
                        break;
                    case this.serviceTypes.ON_GROUP_LEFT:
                        unreadMessage.type = this.chatConstants.MESSAGE_TYPE_GROUP_LEFT;
                        unreadMessage.left = {
                            groupId: message.group,
                            leaveId: message.leaveUser,
                            newAdminId: message.newAdmin
                        };
                        break;
                    case this.serviceTypes.ON_GROUP_RENAMED:
                        unreadMessage.type = this.chatConstants.MESSAGE_TYPE_GROUP_RENAMED;
                        unreadMessage.renamed = {
                            groupId: message.group,
                            newName: message.name
                        };
                        break;
                    case this.serviceTypes.ON_GROUP_ADMIN_CHANGED:
                        unreadMessage.type = this.chatConstants.MESSAGE_TYPE_GROUP_ADMIN_CHANGED;
                        unreadMessage.adminChanged = {
                            groupId: message.group,
                            newAdminId: message.newAdmin
                        };
                        break;
                    case this.serviceTypes.GROUP_JOIN_PUBLIC:
                        unreadMessage.type = this.chatConstants.MESSAGE_TYPE_GROUP_PUBLIC_JOINED;
                        unreadMessage.joined = {
                            groupId: message.group,
                            joinId: message.from
                        };
                    default:
                        break;
                }
                unreadMessages.list.push(unreadMessage);
            });

            resolve(unreadMessages);
        });
    };
    sendGetModifiedMessages(options) {
        return new Promise((resolve, reject) => {

            const getModifiedMessagesPacket = {
                service: this.serviceTypes.MESSAGE_GET_LIST_MODIFIED,
                body: JSON.stringify({
                    page: options.page,
                    lastCreated: options.lastCreated,
                    type: options.chatType,
                    chatId: options.chatId
                })
            };
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                message: 'Send get modified messages packet'
            });
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_DEBUG, {
                message: 'Get modified messages packet',
                payload: getModifiedMessagesPacket
            });
            this.sendPacketFunction(getModifiedMessagesPacket).then(() => {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                    message: 'Send get modified messages packet successfully'
                });
                resolve();
            }).catch((error) => {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Cannot send get modified messages data, get modified messages fail'
                });
                reject({
                    code: error.code,
                    message: 'Cannot send get modified messages data, get modified messages fail'
                });
            });
        });
    };
    receiveModifiedMessages(body) {
        return new Promise((resolve, reject) => {
            if (!body) {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Cannot detect modified messages list, ignored'
                });
                reject({
                    code: this.errorCodes.ERR_UNEXPECTED_RECEIVED_DATA,
                    message: 'Cannot detect modified messages list, get modified messages fail'
                });
                return;
            }

            this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                message: 'Got modified messages list'
            });
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_DEBUG, {
                message: 'Modified messages list data',
                payload: body
            });

            let modifiedMessages = {
                chatType: body.type,
                chatId: body.chatId,
                done: body.done,
                page: body.page,
                list: []
            };
            body.list.map((message) => {
                let modifiedMessage = {
                    chatType: body.type,
                    chatId: body.chatId,
                    senderId: message.senderId,
                    receiverId: message.receiverId,
                    msgId: message.msgId,
                    type: 0,
                    status: message.status,
                    deleted: message.deleted,
                    created: message.created,
                    modified: message.modified
                };

                switch (message.serviceType) {
                    case this.serviceTypes.MESSAGE_SERVER_WITH_USER_TYPE_TEXT:
                        modifiedMessage.type = this.chatConstants.MESSAGE_TYPE_TEXT;
                        modifiedMessage.text = message.msg;
                        break;
                    case this.serviceTypes.MESSAGE_WITH_USER_TYPE_STICKER:
                        modifiedMessage.type = this.chatConstants.MESSAGE_TYPE_STICKER;
                        modifiedMessage.sticker = {
                            name: message.imgName,
                            catId: message.catId,
                            url: message.url,
                            width: message.width,
                            height: message.height
                        };
                        break;
                    case this.serviceTypes.MESSAGE_WITH_USER_TYPE_FILE:
                        modifiedMessage.type = this.chatConstants.MESSAGE_TYPE_FILE;
                        modifiedMessage.file = {
                            name: message.fileName,
                            length: message.fileLength,
                            type: message.type,
                            url: message.url,
                            width: message.width,
                            height: message.height,
                            duration: message.duration
                        };
                        break;
                    case this.serviceTypes.MESSAGE_WITH_USER_TYPE_LOCATION:
                        modifiedMessage.type = this.chatConstants.MESSAGE_TYPE_LOCATION
                        modifiedMessage.location = {
                            address: message.addr,
                            longitude: message.long,
                            latitude: message.lat
                        };
                        break;
                    case this.serviceTypes.MESSAGE_HAS_NEW_WITH_GROUP:
                        if (message.msg) {
                            modifiedMessage.type = this.chatConstants.MESSAGE_TYPE_TEXT;
                            modifiedMessage.text = message.msg;
                        } else if (message.imgName) {
                            modifiedMessage.type = this.chatConstants.MESSAGE_TYPE_STICKER;
                            modifiedMessage.sticker = {
                                name: message.imgName,
                                catId: message.catId,
                                url: message.url,
                                width: message.width,
                                height: message.height
                            };
                        } else if (message.fileName) {
                            modifiedMessage.type = this.chatConstants.MESSAGE_TYPE_FILE;
                            modifiedMessage.file = {
                                name: message.fileName,
                                length: message.fileLength,
                                type: message.type,
                                url: message.url,
                                width: message.width,
                                height: message.height,
                                duration: message.duration
                            };
                        } else if (message.addr) {
                            modifiedMessage.type = this.chatConstants.MESSAGE_TYPE_LOCATION
                            modifiedMessage.location = {
                                address: message.addr,
                                longitude: message.long,
                                latitude: message.lat
                            };
                        }
                        break;
                    case this.serviceTypes.ON_GROUP_CREATED:
                        modifiedMessage.type = this.chatConstants.MESSAGE_TYPE_GROUP_CREATED;
                        modifiedMessage.createdGroup = {
                            type: message.typeGroup,
                            groupId: message.group,
                            adminId: message.admin,
                            name: message.name,
                            memberIds: message.members,
                            created: message.created
                        };
                        break;
                    case this.serviceTypes.ON_GROUP_INVITED:
                        modifiedMessage.type = this.chatConstants.MESSAGE_TYPE_GROUP_INVITED;
                        modifiedMessage.invited = {
                            groupId: message.group,
                            inviteIds: message.invited
                        };
                        break;
                    case this.serviceTypes.ON_GROUP_LEFT:
                        modifiedMessage.type = this.chatConstants.MESSAGE_TYPE_GROUP_LEFT;
                        modifiedMessage.left = {
                            groupId: message.group,
                            leaveId: message.leaveUser,
                            newAdminId: message.newAdmin
                        };
                        break;
                    case this.serviceTypes.ON_GROUP_RENAMED:
                        modifiedMessage.type = this.chatConstants.MESSAGE_TYPE_GROUP_RENAMED;
                        modifiedMessage.renamed = {
                            groupId: message.group,
                            newName: message.name
                        };
                        break;
                    case this.serviceTypes.ON_GROUP_ADMIN_CHANGED:
                        modifiedMessage.type = this.chatConstants.MESSAGE_TYPE_GROUP_ADMIN_CHANGED;
                        modifiedMessage.adminChanged = {
                            groupId: message.group,
                            newAdminId: message.newAdmin
                        };
                        break;
                    case this.serviceTypes.GROUP_JOIN_PUBLIC:
                        modifiedMessage.type = this.chatConstants.MESSAGE_TYPE_GROUP_PUBLIC_JOINED;
                        modifiedMessage.joined = {
                            groupId: message.group,
                            joinId: message.from
                        };
                        break;
                    default:
                        break;
                }

                modifiedMessages.list.push(modifiedMessage);
            });
            resolve(modifiedMessages);
        });
    };
    sendGetModifiedFiles(options) {
        return new Promise((resolve, reject) => {

            const getModifiedFilesPacket = {
                service: this.serviceTypes.MESSAGE_GET_LIST_MODIFIED_FILES,
                body: JSON.stringify({
                    lastCreated: options.lastCreated,
                    type: options.chatType,
                    chatId: options.chatId
                })
            };
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                message: 'Send get modified files packet'
            });
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_DEBUG, {
                message: 'Get modified files packet',
                payload: getModifiedFilesPacket
            });
            this.sendPacketFunction(getModifiedFilesPacket).then(() => {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                    message: 'Send get modified files packet successfully'
                });
                resolve();
            }).catch((error) => {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Cannot send get modified files data, get modified files fail'
                });
                reject({
                    code: error.code,
                    message: 'Cannot send get modified files data, get modified files fail'
                });
            });
        });
    };
    receiveModifiedFiles(options) {
        return new Promise((resolve, reject) => {
            if (!options.body) {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Cannot detect modified files list, ignored'
                });
                reject({
                    code: this.errorCodes.ERR_UNEXPECTED_RECEIVED_DATA,
                    message: 'Cannot detect modified files list, get modified files fail'
                });
                return;
            }

            this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                message: 'Got modified files list'
            });
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_DEBUG, {
                message: 'Modified files list data',
                payload: options.body
            });

            modifiedfiles = {
                done: options.body.done,
                list: []
            };
            options.body.list.map((file) => {
                let modifiedfile = {
                    chatType: file.chatType,
                    chatId: file.chatType === this.chatConstants.CHAT_TYPE_GROUP ? file.group : (file.senderId === options.userId ? file.receiverId : file.senderId),
                    senderId: file.senderId,
                    receiverId: file.receiverId,
                    msgId: file.msgId,
                    type: this.chatConstants.MESSAGE_TYPE_FILE,
                    status: file.status,
                    deleted: file.deleted,
                    created: file.created,
                    modified: file.modified,
                    file: {
                        name: file.fileName,
                        length: file.fileLength,
                        type: file.type,
                        url: file.url,
                        width: file.width,
                        height: file.height,
                        duration: file.duration
                    }
                }
                modifiedfiles.list.push(modifiedfile);
            });

            resolve(modifiedfiles);
        });
    };

    sendNewMessage(options) {
        return new Promise((resolve, reject) => {

            let newMessagePacketService = null;
            let newMessagePacketBody = {};
            let newMessageObj = {};

            if (options.chatType === this.chatConstants.CHAT_TYPE_USER) {
                if (options.text) {
                    newMessagePacketService = this.serviceTypes.MESSAGE_NEW_WITH_USER_TYPE_TEXT;
                    newMessagePacketBody = {
                        msgId: options.msgId,
                        to: options.chatId,
                        msg: options.text
                    };
                    let currentTimeStamp = new Date().getTime();
                    newMessageObj = {
                        chatType: options.chatType,
                        chatId: options.chatId,
                        senderId: 0,
                        receiverId: options.chatId,
                        msgId: options.msgId,
                        type: this.chatConstants.MESSAGE_TYPE_TEXT,
                        status: this.chatConstants.MESSAGE_STATUS_SENDING,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: currentTimeStamp,
                        modified: currentTimeStamp,
                        text: options.text
                    };
                } else if (options.sticker) {
                    newMessagePacketService = this.serviceTypes.MESSAGE_WITH_USER_TYPE_STICKER;
                    newMessagePacketBody = {
                        id: options.msgId,
                        to: options.chatId,
                        imgName: options.sticker.name,
                        catId: options.sticker.catId,
                        url: options.sticker.url,
                        width: options.sticker.width,
                        height: options.sticker.height
                    };
                    let currentTimeStamp = new Date().getTime();
                    newMessageObj = {
                        chatType: options.chatType,
                        chatId: options.chatId,
                        senderId: 0,
                        receiverId: options.chatId,
                        msgId: options.msgId,
                        type: this.chatConstants.MESSAGE_TYPE_STICKER,
                        status: this.chatConstants.MESSAGE_STATUS_SENDING,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: currentTimeStamp,
                        modified: currentTimeStamp,
                        sticker: {
                            name: options.sticker.name,
                            catId: options.sticker.catId,
                            url: options.sticker.url,
                            width: options.sticker.width,
                            height: options.sticker.height
                        }
                    };
                } else if (options.file) {
                    newMessagePacketService = this.serviceTypes.MESSAGE_WITH_USER_TYPE_FILE;
                    newMessagePacketBody = {
                        id: options.msgId,
                        to: options.chatId,
                        fileName: options.file.name,
                        fileLength: options.file.length,
                        type: options.file.type,
                        url: options.file.url,
                        width: options.file.width,
                        height: options.file.height,
                        duration: options.file.duration
                    };
                    let currentTimeStamp = new Date().getTime();
                    newMessageObj = {
                        chatType: options.chatType,
                        chatId: options.chatId,
                        senderId: 0,
                        receiverId: options.chatId,
                        msgId: options.msgId,
                        type: this.chatConstants.MESSAGE_TYPE_FILE,
                        status: this.chatConstants.MESSAGE_STATUS_SENDING,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: currentTimeStamp,
                        modified: currentTimeStamp,
                        file: {
                            name: options.file.name,
                            length: options.file.length,
                            type: options.file.type,
                            url: options.file.url,
                            width: options.file.width,
                            height: options.file.height,
                            duration: options.file.duration
                        }
                    };
                } else if (options.location) {
                    newMessagePacketService = this.serviceTypes.MESSAGE_WITH_USER_TYPE_LOCATION;
                    newMessagePacketBody = {
                        type: 4,
                        id: options.msgId,
                        to: options.chatId,
                        addr: options.location.address,
                        long: options.location.longitude,
                        lat: options.location.latitude
                    };
                    let currentTimeStamp = new Date().getTime();
                    newMessageObj = {
                        chatType: options.chatType,
                        chatId: options.chatId,
                        senderId: 0,
                        receiverId: options.chatId,
                        msgId: options.msgId,
                        type: this.chatConstants.MESSAGE_TYPE_LOCATION,
                        status: this.chatConstants.MESSAGE_STATUS_SENDING,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: currentTimeStamp,
                        modified: currentTimeStamp,
                        location: {
                            address: options.location.address,
                            longitude: options.location.longitude,
                            latitude: options.location.latitude
                        }
                    };
                }
            } else if (options.chatType === this.chatConstants.CHAT_TYPE_GROUP) {
                if (options.text) {
                    newMessagePacketService = this.serviceTypes.MESSAGE_NEW_WITH_GROUP;
                    newMessagePacketBody = {
                        msgId: options.msgId,
                        group: options.chatId,
                        msg: options.text
                    };
                    let currentTimeStamp = new Date().getTime();
                    newMessageObj = {
                        chatType: options.chatType,
                        chatId: options.chatId,
                        senderId: 0,
                        receiverId: options.chatId,
                        msgId: options.msgId,
                        type: this.chatConstants.MESSAGE_TYPE_TEXT,
                        status: this.chatConstants.MESSAGE_STATUS_SENDING,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: currentTimeStamp,
                        modified: currentTimeStamp,
                        text: options.text
                    };
                } else if (options.sticker) {
                    newMessagePacketService = this.serviceTypes.MESSAGE_NEW_WITH_GROUP;
                    newMessagePacketBody = {
                        type: 3,
                        msgId: options.msgId,
                        group: options.chatId,
                        imgName: options.sticker.name,
                        catId: options.sticker.catId,
                        url: options.sticker.url,
                        width: options.sticker.width,
                        height: options.sticker.height
                    };
                    let currentTimeStamp = new Date().getTime();
                    newMessageObj = {
                        chatType: options.chatType,
                        chatId: options.chatId,
                        senderId: 0,
                        receiverId: options.chatId,
                        msgId: options.msgId,
                        type: this.chatConstants.MESSAGE_TYPE_STICKER,
                        status: this.chatConstants.MESSAGE_STATUS_SENDING,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: currentTimeStamp,
                        modified: currentTimeStamp,
                        sticker: {
                            name: options.sticker.name,
                            catId: options.sticker.catId,
                            url: options.sticker.url,
                            width: options.sticker.width,
                            height: options.sticker.height
                        }
                    };
                } else if (options.file) {
                    newMessagePacketService = this.serviceTypes.MESSAGE_NEW_WITH_GROUP;
                    newMessagePacketBody = {
                        msgId: options.msgId,
                        group: options.chatId,
                        fileName: options.file.name,
                        fileLength: options.file.length,
                        type: options.file.type,
                        url: options.file.url,
                        width: options.file.width,
                        height: options.file.height,
                        duration: options.file.duration
                    };
                    let currentTimeStamp = new Date().getTime();
                    newMessageObj = {
                        chatType: options.chatType,
                        chatId: options.chatId,
                        senderId: 0,
                        receiverId: options.chatId,
                        msgId: options.msgId,
                        type: this.chatConstants.MESSAGE_TYPE_FILE,
                        status: this.chatConstants.MESSAGE_STATUS_SENDING,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: currentTimeStamp,
                        modified: currentTimeStamp,
                        file: {
                            name: options.file.name,
                            length: options.file.length,
                            type: options.file.type,
                            url: options.file.url,
                            width: options.file.width,
                            height: options.file.height,
                            duration: options.file.duration
                        }
                    };
                } else if (options.location) {
                    newMessagePacketService = this.serviceTypes.MESSAGE_NEW_WITH_GROUP;
                    newMessagePacketBody = {
                        type: 4,
                        msgId: options.msgId,
                        group: options.chatId,
                        addr: options.location.address,
                        long: options.location.longitude,
                        lat: options.location.latitude
                    };
                    let currentTimeStamp = new Date().getTime();
                    newMessageObj = {
                        chatType: options.chatType,
                        chatId: options.chatId,
                        senderId: 0,
                        receiverId: options.chatId,
                        msgId: options.msgId,
                        type: this.chatConstants.MESSAGE_TYPE_STICKER,
                        status: this.chatConstants.MESSAGE_STATUS_SENDING,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: currentTimeStamp,
                        modified: currentTimeStamp,
                        location: {
                            address: options.location.address,
                            longitude: options.location.longitude,
                            latitude: options.location.latitude
                        }
                    };
                }
            }

            const newMessagePacket = {
                service: newMessagePacketService,
                body: JSON.stringify(newMessagePacketBody)
            };
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                message: 'Send new message packet'
            });
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_DEBUG, {
                message: 'New message packet',
                payload: newMessagePacket
            });
            this.sendPacketFunction(newMessagePacket).then(() => {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                    message: 'Send new message packet successfully'
                });
                resolve(newMessageObj);
            }).catch((error) => {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Cannot send new message data, new message fail'
                });
                reject({
                    code: error.code,
                    message: 'Cannot send new message data, new message fail'
                });
            });
        });
    };
    receiveHasNewMessage(options) {
        return new Promise((resolve, reject) => {
            if (!options.body) {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Cannot detect new message, ignored'
                });
                reject({
                    code: this.errorCodes.ERR_UNEXPECTED_RECEIVED_DATA,
                    message: 'Cannot detect new message'
                });
                return;
            }

            this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                message: 'Got new message'
            });
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_DEBUG, {
                message: 'New message data',
                payload: options.body
            });

            let newMessage = {};

            if (options.chatType === this.chatConstants.CHAT_TYPE_USER) {
                if (options.messageType === this.chatConstants.MESSAGE_TYPE_TEXT) {
                    newMessage = {
                        chatType: this.chatConstants.CHAT_TYPE_USER,
                        chatId: options.body.from,
                        senderId: options.body.from,
                        receiverId: 0,
                        msgId: options.body.msgId,
                        type: this.chatConstants.MESSAGE_TYPE_TEXT,
                        status: this.chatConstants.MESSAGE_STATUS_SENT,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: options.body.time,
                        modified: options.body.time,
                        text: options.body.msg
                    };
                } else if (options.messageType === this.chatConstants.MESSAGE_TYPE_STICKER) {
                    newMessage = {
                        chatType: this.chatConstants.CHAT_TYPE_USER,
                        chatId: options.body.from,
                        senderId: options.body.from,
                        receiverId: options.body.to,
                        msgId: options.body.id,
                        type: this.chatConstants.MESSAGE_TYPE_STICKER,
                        status: this.chatConstants.MESSAGE_STATUS_SENT,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: options.body.created,
                        modified: options.body.created,
                        sticker: {
                            name: options.body.imgName,
                            catId: options.body.catId,
                            url: options.body.url,
                            width: options.body.width,
                            height: options.body.height
                        }
                    };
                } else if (options.messageType === this.chatConstants.MESSAGE_TYPE_FILE) {
                    newMessage = {
                        chatType: this.chatConstants.CHAT_TYPE_USER,
                        chatId: options.body.from,
                        senderId: options.body.from,
                        receiverId: options.body.to,
                        msgId: options.body.id,
                        type: this.chatConstants.MESSAGE_TYPE_FILE,
                        status: this.chatConstants.MESSAGE_STATUS_SENT,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: options.body.created,
                        modified: options.body.created,
                        file: {
                            name: options.body.fileName,
                            length: options.body.fileLength,
                            type: options.body.type,
                            url: options.body.url,
                            width: options.body.width,
                            height: options.body.height,
                            duration: options.body.duration
                        }
                    };
                } else if (options.messageType === this.chatConstants.MESSAGE_TYPE_LOCATION) {
                    newMessage = {
                        chatType: this.chatConstants.CHAT_TYPE_USER,
                        chatId: options.body.from,
                        senderId: options.body.from,
                        receiverId: options.body.to,
                        msgId: options.body.id,
                        type: this.chatConstants.MESSAGE_TYPE_LOCATION,
                        status: this.chatConstants.MESSAGE_STATUS_SENT,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: options.body.created,
                        modified: options.body.created,
                        location: {
                            address: options.body.addr,
                            longitude: options.body.long,
                            latitude: options.body.lat
                        }
                    };
                }
            }
            else if (options.chatType === this.chatConstants.CHAT_TYPE_GROUP) {
                if (options.body.msg) {
                    newMessage = {
                        chatType: this.chatConstants.CHAT_TYPE_GROUP,
                        chatId: options.body.group,
                        senderId: options.body.from,
                        receiverId: options.body.group,
                        msgId: options.body.msgId,
                        type: this.chatConstants.MESSAGE_TYPE_TEXT,
                        status: this.chatConstants.MESSAGE_STATUS_SENT,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: options.body.created,
                        modified: options.body.created,
                        text: options.body.msg
                    };
                } else if (options.body.imgName) {
                    newMessage = {
                        chatType: this.chatConstants.CHAT_TYPE_GROUP,
                        chatId: options.body.group,
                        senderId: options.body.from,
                        receiverId: options.body.group,
                        msgId: options.body.msgId,
                        type: this.chatConstants.MESSAGE_TYPE_STICKER,
                        status: this.chatConstants.MESSAGE_STATUS_SENT,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: options.body.created,
                        modified: options.body.created,
                        sticker: {
                            name: options.body.imgName,
                            catId: options.body.catId,
                            url: options.body.url,
                            width: options.body.width,
                            height: options.body.height
                        }
                    };
                } else if (options.body.fileName) {
                    newMessage = {
                        chatType: this.chatConstants.CHAT_TYPE_GROUP,
                        chatId: options.body.group,
                        senderId: options.body.from,
                        receiverId: options.body.group,
                        msgId: options.body.msgId,
                        type: this.chatConstants.MESSAGE_TYPE_FILE,
                        status: this.chatConstants.MESSAGE_STATUS_SENT,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: options.body.created,
                        modified: options.body.created,
                        file: {
                            name: options.body.fileName,
                            length: options.body.fileLength,
                            type: options.body.type,
                            url: options.body.url,
                            width: options.body.width,
                            height: options.body.height,
                            duration: options.body.duration
                        }
                    };
                } else if (options.body.addr) {
                    newMessage = {
                        chatType: this.chatConstants.CHAT_TYPE_GROUP,
                        chatId: options.body.group,
                        senderId: options.body.from,
                        receiverId: options.body.group,
                        msgId: options.body.msgId,
                        type: this.chatConstants.MESSAGE_TYPE_LOCATION,
                        status: this.chatConstants.MESSAGE_STATUS_SENT,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: options.body.created,
                        modified: options.body.created,
                        location: {
                            address: options.body.addr,
                            longitude: options.body.long,
                            latitude: options.body.lat
                        }
                    };
                }
            }

            resolve(newMessage);
        });
    };

    receiveMessageFromMe(options) {
        return new Promise((resolve, reject) => {
            if (!options.body) {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Cannot detect message from me, ignored'
                });
                reject({
                    code: this.errorCodes.ERR_UNEXPECTED_RECEIVED_DATA,
                    message: 'Cannot detect message from me'
                });
                return;
            }

            this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                message: 'Got message from me'
            });
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_DEBUG, {
                message: 'Message from me',
                payload: options.body
            });

            let messageFromMe = {};

            if (options.chatType === this.chatConstants.CHAT_TYPE_USER) {
                if (options.body.msg) {
                    messageFromMe = {
                        chatType: this.chatConstants.CHAT_TYPE_USER,
                        chatId: options.body.to,
                        senderId: 0,
                        receiverId: options.body.to,
                        msgId: options.body.msgId,
                        type: this.chatConstants.MESSAGE_TYPE_TEXT,
                        status: this.chatConstants.MESSAGE_STATUS_SENT,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: options.body.time,
                        modified: options.body.time,
                        text: options.body.msg
                    };
                } else if (options.body.imgName) {
                    messageFromMe = {
                        chatType: this.chatConstants.CHAT_TYPE_USER,
                        chatId: options.body.to,
                        senderId: options.body.from,
                        receiverId: options.body.to,
                        msgId: options.body.id,
                        type: this.chatConstants.MESSAGE_TYPE_STICKER,
                        status: this.chatConstants.MESSAGE_STATUS_SENT,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: options.body.created,
                        modified: options.body.created,
                        sticker: {
                            name: options.body.imgName,
                            catId: options.body.catId,
                            url: options.body.url,
                            width: options.body.width,
                            height: options.body.height
                        }
                    };
                } else if (options.body.fileName) {
                    messageFromMe = {
                        chatType: this.chatConstants.CHAT_TYPE_USER,
                        chatId: options.body.to,
                        senderId: options.body.from,
                        receiverId: options.body.to,
                        msgId: options.body.id,
                        type: this.chatConstants.MESSAGE_TYPE_FILE,
                        status: this.chatConstants.MESSAGE_STATUS_SENT,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: options.body.created,
                        modified: options.body.created,
                        file: {
                            name: options.body.fileName,
                            length: options.body.fileLength,
                            type: options.body.type,
                            url: options.body.url,
                            width: options.body.width,
                            height: options.body.height,
                            duration: options.body.duration
                        }
                    };
                } else if (options.body.addr) {
                    messageFromMe = {
                        chatType: this.chatConstants.CHAT_TYPE_USER,
                        chatId: options.body.to,
                        senderId: options.body.from,
                        receiverId: options.body.to,
                        msgId: options.body.id,
                        type: this.chatConstants.MESSAGE_TYPE_LOCATION,
                        status: this.chatConstants.MESSAGE_STATUS_SENT,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: options.body.created,
                        modified: options.body.created,
                        location: {
                            address: options.body.addr,
                            longitude: options.body.long,
                            latitude: options.body.lat
                        }
                    };
                }
            } else if (options.chatType === this.chatConstants.CHAT_TYPE_GROUP) {
                if (options.body.msg) {
                    messageFromMe = {
                        chatType: this.chatConstants.CHAT_TYPE_GROUP,
                        chatId: options.body.group,
                        senderId: options.body.from,
                        receiverId: options.body.group,
                        msgId: options.body.msgId,
                        type: this.chatConstants.MESSAGE_TYPE_TEXT,
                        status: this.chatConstants.MESSAGE_STATUS_SENT,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: options.body.created,
                        modified: options.body.created,
                        text: options.body.msg
                    };
                } else if (options.body.imgName) {
                    messageFromMe = {
                        chatType: this.chatConstants.CHAT_TYPE_GROUP,
                        chatId: options.body.group,
                        senderId: options.body.from,
                        receiverId: options.body.group,
                        msgId: options.body.msgId,
                        type: this.chatConstants.MESSAGE_TYPE_STICKER,
                        status: this.chatConstants.MESSAGE_STATUS_SENT,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: options.body.created,
                        modified: options.body.created,
                        sticker: {
                            name: options.body.imgName,
                            catId: options.body.catId,
                            url: options.body.url,
                            width: options.body.width,
                            height: options.body.height
                        }
                    };
                } else if (options.body.fileName) {
                    messageFromMe = {
                        chatType: this.chatConstants.CHAT_TYPE_GROUP,
                        chatId: options.body.group,
                        senderId: options.body.from,
                        receiverId: options.body.group,
                        msgId: options.body.msgId,
                        type: this.chatConstants.MESSAGE_TYPE_FILE,
                        status: this.chatConstants.MESSAGE_STATUS_SENT,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: options.body.created,
                        modified: options.body.created,
                        file: {
                            name: options.body.fileName,
                            length: options.body.fileLength,
                            type: options.body.type,
                            url: options.body.url,
                            width: options.body.width,
                            height: options.body.height,
                            duration: options.body.duration
                        }
                    };
                } else if (options.body.addr) {
                    messageFromMe = {
                        chatType: this.chatConstants.CHAT_TYPE_GROUP,
                        chatId: options.body.group,
                        senderId: options.body.from,
                        receiverId: options.body.group,
                        msgId: options.body.msgId,
                        type: this.chatConstants.MESSAGE_TYPE_LOCATION,
                        status: this.chatConstants.MESSAGE_STATUS_SENT,
                        deleted: this.chatConstants.MESSAGE_DELETED_FALSE,
                        created: options.body.created,
                        modified: options.body.created,
                        location: {
                            address: options.body.addr,
                            longitude: options.body.long,
                            latitude: options.body.lat
                        }
                    };
                }
            }

            resolve(messageFromMe);
        });
    };

    sendChangeStatus(options) {
        return new Promise((resolve, reject) => {

            let messageReportPacketService = null;
            let messageReportPacketBody = {};

            if (options.chatType === this.chatConstants.CHAT_TYPE_USER) {
                if (options.messageStatus === this.chatConstants.MESSAGE_STATUS_DELIVERED) {
                    messageReportPacketService = this.serviceTypes.MESSAGE_STATUS_CHANGE_DELIVERED_WITH_USER;
                    messageReportPacketBody = {
                        to: options.chatId,
                        msgId: options.msgId
                    };
                } else if (options.messageStatus === this.chatConstants.MESSAGE_STATUS_SEEN) {
                    messageReportPacketService = this.serviceTypes.MESSAGE_STATUS_CHANGE_SEEN;
                    messageReportPacketBody = {
                        type: options.chatType,
                        chatId: options.chatId,
                        senderId: options.messageSenderId,
                        msgId: options.msgId
                    };
                } else if (options.messageStatus === this.chatConstants.MESSAGE_STATUS_CANCELLED) {
                    messageReportPacketService = this.serviceTypes.MESSAGE_STATUS_CHANGE_CANCELLED_WITH_USER;
                    messageReportPacketBody = {
                        type: options.chatType,
                        chatId: options.chatId,
                        to: options.chatId,
                        id: options.msgId
                    };
                }
            } else if (options.chatType === this.chatConstants.CHAT_TYPE_GROUP) {
                if (options.messageStatus === this.chatConstants.MESSAGE_STATUS_DELIVERED) {
                    messageReportPacketService = this.serviceTypes.MESSAGE_STATUS_CHANGE_DELIVERED_WITH_GROUP;
                    messageReportPacketBody = {
                        group: options.chatId,
                        msgId: options.msgId,
                        msgSender: options.messageSenderId
                    };
                } else if (options.messageStatus === this.chatConstants.MESSAGE_STATUS_SEEN) {
                    messageReportPacketService = this.serviceTypes.MESSAGE_STATUS_CHANGE_SEEN;
                    messageReportPacketBody = {
                        type: options.chatType,
                        chatId: options.chatId,
                        senderId: options.messageSenderId,
                        msgId: options.msgId
                    };
                } else if (options.messageStatus === this.chatConstants.MESSAGE_STATUS_CANCELLED) {
                    messageReportPacketService = this.serviceTypes.MESSAGE_STATUS_CHANGE_CANCELLED_WITH_GROUP;
                    messageReportPacketBody = {
                        type: options.chatType,
                        chatId: options.chatId,
                        group: options.chatId,
                        msgId: options.msgId
                    };
                }
            }

            const changeMessageStatusPacket = {
                service: messageReportPacketService,
                body: JSON.stringify(messageReportPacketBody)
            };
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                message: 'Send change message status packet'
            });
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_DEBUG, {
                message: 'Change message status packet',
                payload: changeMessageStatusPacket
            });
            this.sendPacketFunction(changeMessageStatusPacket).then(() => {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                    message: 'Send change message status packet successfully'
                });
                resolve();
            }).catch((error) => {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Cannot send change message status data, send change message status fail'
                });
                reject({
                    code: error.code,
                    message: 'Cannot send change message status data, send change message status fail'
                });
            });
        });
    };
    receiveMessageStatusChanged(options) {
        return new Promise((resolve, reject) => {
            if (!options.body) {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Cannot detect message status changed, ignored'
                });
                reject({
                    code: this.errorCodes.ERR_UNEXPECTED_RECEIVED_DATA,
                    message: 'Cannot detect message status changed'
                });
                return;
            }

            this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                message: 'Got message status changed'
            });
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_DEBUG, {
                message: 'Message status changed',
                payload: options.body
            });

            let onMessageStatusChanged = {};

            if (options.chatType === this.chatConstants.CHAT_TYPE_USER) {
                if (options.messageStatus === this.chatConstants.MESSAGE_STATUS_SENT) {
                    if (options.body.r !== this.errorCodes.CHANGE_STATUS_MESSAGE_SUCCESS_FROM_SERVER && options.body.r !== this.errorCodes.REQUEST_SUCCESS_FROM_SERVER) {
                        this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                            message: 'Server response with error, send message fail'
                        });
                        reject({
                            code: this.errorCodes.ERR_UNEXPECTED_RECEIVED_DATA,
                            message: 'Server response with error, send message fail'
                        });
                        return;
                    }
                    onMessageStatusChanged = {
                        chatType: this.chatConstants.CHAT_TYPE_USER,
                        chatId: options.body.from,
                        senderId: 0,
                        receiverId: 0,
                        msgId: options.body.msgId,
                        messageStatus: this.chatConstants.MESSAGE_STATUS_SENT
                    };
                } else if (options.messageStatus === this.chatConstants.MESSAGE_STATUS_DELIVERED) {
                    onMessageStatusChanged = {
                        chatType: this.chatConstants.CHAT_TYPE_USER,
                        chatId: options.body.from,
                        senderId: options.body.from,
                        receiverId: 0,
                        msgId: options.body.msgId,
                        messageStatus: this.chatConstants.MESSAGE_STATUS_DELIVERED
                    };
                } else if (options.messageStatus === this.chatConstants.MESSAGE_STATUS_SEEN) {
                    if (options.body.r !== undefined && options.body.r !== this.errorCodes.CHANGE_STATUS_MESSAGE_SUCCESS_FROM_SERVER && options.body.r !== this.errorCodes.REQUEST_SUCCESS_FROM_SERVER) {
                        this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                            message: 'Server response with error, change message to seen fail'
                        });
                        reject({
                            code: this.errorCodes.ERR_UNEXPECTED_RECEIVED_DATA,
                            message: 'Server response with error, change message to seen fail',
                            msgId: options.body.msgId
                        });
                        return;
                    }
                    onMessageStatusChanged = {
                        isReturn: options.body.r === undefined ? false : true,
                        chatType: this.chatConstants.CHAT_TYPE_USER,
                        chatId: options.body.from,
                        senderId: options.body.from,
                        receiverId: options.body.senderId,
                        msgId: options.body.msgId,
                        messageStatus: this.chatConstants.MESSAGE_STATUS_SEEN
                    };
                } else if (options.messageStatus === this.chatConstants.MESSAGE_STATUS_CANCELLED) {
                    if (options.body.r !== undefined && options.body.r !== this.errorCodes.CHANGE_STATUS_MESSAGE_SUCCESS_FROM_SERVER && options.body.r !== this.errorCodes.REQUEST_SUCCESS_FROM_SERVER) {
                        this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                            message: 'Server response with error, change message to cancelled fail'
                        });
                        reject({
                            code: this.errorCodes.ERR_UNEXPECTED_RECEIVED_DATA,
                            message: 'Server response with error, change message to cancelled fail',
                            msgId: options.body.id
                        });
                        return;
                    }
                    onMessageStatusChanged = {
                        isReturn: options.body.r === undefined ? false : true,
                        chatType: this.chatConstants.CHAT_TYPE_USER,
                        chatId: options.body.from,
                        senderId: options.body.from,
                        receiverId: options.body.to,
                        msgId: options.body.id,
                        messageStatus: this.chatConstants.MESSAGE_STATUS_CANCELLED
                    };
                }
            } else if (options.chatType === this.chatConstants.CHAT_TYPE_GROUP) {
                if (options.messageStatus === this.chatConstants.MESSAGE_STATUS_SENT) {
                    if (options.body.r !== this.errorCodes.CHANGE_STATUS_MESSAGE_SUCCESS_FROM_SERVER && options.body.r !== this.errorCodes.REQUEST_SUCCESS_FROM_SERVER) {
                        this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                            message: 'Server response with error, send message fail'
                        });
                        reject({
                            code: this.errorCodes.ERR_UNEXPECTED_RECEIVED_DATA,
                            message: 'Server response with error, send message fail'
                        });
                        return;
                    }
                    onMessageStatusChanged = {
                        chatType: this.chatConstants.CHAT_TYPE_GROUP,
                        chatId: options.body.group,
                        senderId: 0,
                        receiverId: options.body.group,
                        msgId: options.body.msgId,
                        messageStatus: this.chatConstants.MESSAGE_STATUS_SENT
                    };
                } else if (options.messageStatus === this.chatConstants.MESSAGE_STATUS_DELIVERED) {
                    onMessageStatusChanged = {
                        chatType: this.chatConstants.CHAT_TYPE_GROUP,
                        chatId: options.body.group,
                        senderId: options.body.from,
                        receiverId: options.body.group,
                        msgId: options.body.msgId,
                        messageStatus: this.chatConstants.MESSAGE_STATUS_DELIVERED
                    };
                } else if (options.messageStatus === this.chatConstants.MESSAGE_STATUS_SEEN) {
                    if (options.body.r !== undefined && options.body.r !== this.errorCodes.CHANGE_STATUS_MESSAGE_SUCCESS_FROM_SERVER && options.body.r !== this.errorCodes.REQUEST_SUCCESS_FROM_SERVER) {
                        this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                            message: 'Server response with error, change message to seen fail'
                        });
                        reject({
                            code: this.errorCodes.ERR_UNEXPECTED_RECEIVED_DATA,
                            message: 'Server response with error, change message to seen fail',
                            msgId: options.body.msgId
                        });
                        return;
                    }
                    onMessageStatusChanged = {
                        isReturn: options.body.r === undefined ? false : true,
                        chatType: this.chatConstants.CHAT_TYPE_GROUP,
                        chatId: options.body.chatId,
                        senderId: options.body.from,
                        receiverId: options.body.chatId,
                        msgId: options.body.msgId,
                        messageStatus: this.chatConstants.MESSAGE_STATUS_SEEN
                    };
                } else if (options.messageStatus === this.chatConstants.MESSAGE_STATUS_CANCELLED) {
                    if (options.body.r !== undefined && options.body.r !== this.errorCodes.CHANGE_STATUS_MESSAGE_SUCCESS_FROM_SERVER && options.body.r !== this.errorCodes.REQUEST_SUCCESS_FROM_SERVER) {
                        this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                            message: 'Server response with error, change message to cancelled fail'
                        });
                        reject({
                            code: this.errorCodes.ERR_UNEXPECTED_RECEIVED_DATA,
                            message: 'Server response with error, change message to cancelled fail',
                            msgId: options.body.msgId
                        });
                        return;
                    }
                    onMessageStatusChanged = {
                        isReturn: options.body.r === undefined ? false : true,
                        chatType: this.chatConstants.CHAT_TYPE_GROUP,
                        chatId: options.body.group,
                        senderId: options.body.from,
                        receiverId: options.body.group,
                        msgId: options.body.msgId,
                        messageStatus: this.chatConstants.MESSAGE_STATUS_CANCELLED
                    };
                }
            }

            resolve(onMessageStatusChanged);
        });
    };

    sendDelete(options) {
        return new Promise((resolve, reject) => {

            const deleteMessagePacket = {
                service: this.serviceTypes.MESSAGE_DELETE,
                body: JSON.stringify({
                    type: options.chatType,
                    chatId: options.chatId,
                    senderId: options.messageSenderId,
                    msgId: options.msgId
                })
            };
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                message: 'Send delete message packet'
            });
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_DEBUG, {
                message: 'Delete message packet',
                payload: deleteMessagePacket
            });
            this.sendPacketFunction(deleteMessagePacket).then(() => {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                    message: 'Send delete message packet successfully'
                });
                resolve();
            }).catch((error) => {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Cannot send delete message data, send delete message fail'
                });
                reject({
                    code: error.code,
                    message: 'Cannot send delete message data, send delete message fail'
                });
            });
        });
    };
    receiveMessageDeleted(body) {
        return new Promise((resolve, reject) => {
            if (!body) {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Cannot detect message deleted, ignored'
                });
                reject({
                    code: this.errorCodes.ERR_UNEXPECTED_RECEIVED_DATA,
                    message: 'Cannot detect message deleted'
                });
                return;
            }

            this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                message: 'Got message deleted'
            });
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_DEBUG, {
                message: 'Message deleted',
                payload: body
            });

            if (body.r !== this.errorCodes.DELETE_MESSAGE_SUCCESS_FROM_SERVER) {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Server response with error, delete message fail'
                });
                reject({
                    code: this.errorCodes.ERR_UNEXPECTED_RECEIVED_DATA,
                    message: 'Server response with error, delete message fail'
                });
                return;
            }

            resolve();
        });
    };

    sendTyping(options) {
        return new Promise((resolve, reject) => {

            let typingPacketService = null;
            let typingPacketBody = {};

            if (options.chatType === this.chatConstants.CHAT_TYPE_USER) {
                typingPacketService = this.serviceTypes.MESSAGE_TYPING_WITH_USER;
                typingPacketBody = {
                    to: options.chatId
                };
            } else if (options.chatType === this.chatConstants.CHAT_TYPE_GROUP) {
                typingPacketService = this.serviceTypes.MESSAGE_TYPING_WITH_GROUP;
                typingPacketBody = {
                    group: options.chatId
                };
            }

            const typingPacket = {
                service: typingPacketService,
                body: JSON.stringify(typingPacketBody)
            };
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                message: 'Send typing packet'
            });
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_DEBUG, {
                message: 'Typing packet',
                payload: typingPacket
            });
            this.sendPacketFunction(typingPacket).then(() => {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                    message: 'Send typing packet successfully'
                });
                resolve();
            }).catch((error) => {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Cannot send typing data, send typing fail'
                });
                reject({
                    code: error.code,
                    message: 'Cannot send typing data, send typing fail'
                });
            });
        });
    };
    receiveTyping(options) {
        return new Promise((resolve, reject) => {
            if (!options.body) {
                this.Logger.log(this.logLevelConstants.LOG_LEVEL_ERROR, {
                    message: 'Cannot detect typing, ignored'
                });
                reject({
                    code: this.errorCodes.ERR_UNEXPECTED_RECEIVED_DATA,
                    message: 'Cannot detect typing'
                });
                return;
            }

            this.Logger.log(this.logLevelConstants.LOG_LEVEL_INFO, {
                message: 'Got typing'
            });
            this.Logger.log(this.logLevelConstants.LOG_LEVEL_DEBUG, {
                message: 'Typing data',
                payload: options.body
            });

            let typing = {};

            if (options.chatType === this.chatConstants.CHAT_TYPE_USER) {
                typing = {
                    chatType: this.chatConstants.CHAT_TYPE_USER,
                    chatId: options.body.from,
                    senderId: options.body.from,
                    receiverId: 0
                };
            } else if (options.chatType === this.chatConstants.CHAT_TYPE_GROUP) {
                typing = {
                    chatType: this.chatConstants.CHAT_TYPE_GROUP,
                    chatId: options.body.group,
                    senderId: options.body.from,
                    receiverId: options.body.group
                };
            }

            resolve(typing);
        });
    };
};

export default Message;