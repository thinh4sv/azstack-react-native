export const PING = 1;

export const AUTHENTICATION_GET_SERVER_ADDR = 29;
export const AUTHENTICATION_SEND_AUTHENTICATE = 179;
export const AUTHENTICATION_RECEIVE_AUTHENTICATE = 162;

export const CALLOUT_START_SEND = 500;
export const CALLOUT_START_INITIAL = 610;
export const CALLOUT_START_DONE = 504;
export const CALLOUT_DATA_SEND = 501;
export const CALLOUT_STOP_SEND = 502;
export const CALLOUT_DATA_STATUS_CHANGED = 503;

export const CALLIN_START = 505;
export const CALLIN_STATUS_CHANGED = 506;
export const CALLIN_STATUS_CHANGED_BY_ME = 508;

export const PAID_CALL_LOG_RETURN = 601;
export const PAID_CALL_LOGS_GET = 509;

export const CONVERSATION_GET_LIST_MODIFIED = 170;

export const MESSAGE_GET_LIST_UNREAD = 173;
export const MESSAGE_GET_LIST_MODIFIED = 169;

export const MESSAGE_SERVER_WITH_USER_TYPE_TEXT = 5;
export const MESSAGE_NEW_WITH_USER_TYPE_TEXT = 72;
export const MESSAGE_HAS_NEW_WITH_USER_TYPE_TEXT = 73;
export const MESSAGE_WITH_USER_TYPE_STICKER = 104;
export const MESSAGE_WITH_USER_TYPE_FILE = 121;

export const MESSAGE_FROM_ME_WITH_USER = 174;
export const MESSAGE_FROM_ME_WITH_USER_JSON = 175;

export const MESSAGE_STATUS_CHANGE_DELIVERED_WITH_USER = 167;
export const MESSAGE_STATUS_CHANGE_SEEN = 153;
export const MESSAGE_STATUS_CHANGE_CANCELLED_WITH_USER = 127;

export const MESSAGE_TYPING_WITH_USER = 142; 

export const USER_GET_INFO_BY_IDS = 164;
export const USER_GET_INFO_BY_USERNAMES = 165;