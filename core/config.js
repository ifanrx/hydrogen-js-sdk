const API_HOST = 'https://api.myminapp.com'
let VERSION = 'v2.0.1-a'
let SDK_DOWNLOAD_PAGE = 'https://doc.minapp.com/js-sdk/download-sdk.html'

const API = {
  REGISTER_USERNAME: '/hserve/v2.1/register/username/',
  REGISTER_EMAIL: '/hserve/v2.1/register/email/',
  REGISTER_PHONE: '/hserve/v2.1/register/phone/',
  LOGIN_USERNAME: '/hserve/v2.1/login/username/',
  LOGIN_EMAIL: '/hserve/v2.1/login/email/',
  LOGIN_PHONE: '/hserve/v2.1/login/phone/',
  LOGIN_SMS: '/hserve/v2.1/login/sms/',
  EMAIL_VERIFY: '/hserve/v2.0/user/email-verify/',
  VERIFY_MOBILE: '/hserve/v2.1/sms-phone-verification/',
  ACCOUNT_INFO: '/hserve/v2.1/user/account/',
  PASSWORD_RESET: '/hserve/v2.0/user/password/reset/',
  ANONYMOUS_LOGIN: '/hserve/v2.0/login/anonymous/',
  LOGOUT: '/hserve/v2.0/session/destroy/',

  UPLOAD: '/hserve/v2.1/upload/',
  CLOUD_FUNCTION: '/hserve/v1/cloud-function/job/',

  USER_DETAIL: '/hserve/v2.0/user/info/:userID/',
  USER_LIST: '/hserve/v2.0/user/info/',
  UPDATE_USER: '/hserve/v2.0/user/info/',

  TABLE_LIST: '/hserve/v2.0/table/',
  TABLE_DETAIL: '/hserve/v2.0/table/:tableID/',
  RECORD_LIST: '/hserve/v2.0/table/:tableID/record/',
  QUERY_RECORD_LIST: '/hserve/v2.0/table/:tableID/record/',
  CREATE_RECORD_LIST: '/hserve/v2.0/table/:tableID/record/?enable_trigger=:enable_trigger',
  RECORD_DETAIL: '/hserve/v2.0/table/:tableID/record/:recordID/',
  CREATE_RECORD: '/hserve/v2.0/table/:tableID/record/',
  UPDATE_RECORD: '/hserve/v2.0/table/:tableID/record/:recordID/',
  UPDATE_RECORD_LIST: '/hserve/v2.0/table/:tableID/record/?limit=:limit&offset=:offset&where=:where&enable_trigger=:enable_trigger',
  DELETE_RECORD: '/hserve/v2.0/table/:tableID/record/:recordID/',
  DELETE_RECORD_LIST: '/hserve/v2.0/table/:tableID/record/?limit=:limit&offset=:offset&where=:where&enable_trigger=:enable_trigger',

  LAGECY_CONTENT_LIST: '/hserve/v1/content/detail/',
  CONTENT_LIST: '/hserve/v2.0/content/detail/',
  CONTENT_GROUP_LIST: '/hserve/v2.0/content/group/',
  CONTENT_DETAIL: '/hserve/v2.0/content/detail/:richTextID/',
  CONTENT_GROUP_DETAIL: '/hserve/v2.0/content/group/',
  CONTENT_CATEGORY_LIST: '/hserve/v2.0/content/category/',
  CONTENT_CATEGORY_DETAIL: '/hserve/v2.0/content/category/:categoryID/',

  FILE_DETAIL: '/hserve/v2.1/uploaded-file/:fileID/',
  FILE_LIST: '/hserve/v2.1/uploaded-file/',
  DELETE_FILE: '/hserve/v2.1/uploaded-file/:fileID/',
  DELETE_FILES: '/hserve/v2.1/uploaded-file/',
  FILE_CATEGORY_DETAIL: '/hserve/v1.3/file-category/:categoryID/',
  FILE_CATEGORY_LIST: '/hserve/v1.3/file-category/',
  CENSOR_IMAGE: '/hserve/v1.7/censor-image/',
  CENSOR_MSG: '/hserve/v1.7/censor-msg/',
  SEND_SMS_CODE: '/hserve/v2.2/sms-verification-code/',
  VERIFY_SMS_CODE: '/hserve/v1.8/sms-verification-code/verify/',

  PAY: '/hserve/v2.0/idp/pay/order/',
  ORDER: '/hserve/v2.0/idp/pay/order/:transactionID/',

  TEMPLATE_MESSAGE_EVENT_REPORT: '/hserve/v2.0/template-message/event-report/',

  WEB: {
    THIRD_PARTY_AUTH: '/hserve/v2.0/idp/:provider/redirect/',
    THIRD_PARTY_LOGIN: '/hserve/v2.0/idp/:provider/authenticate/',
    THIRD_PARTY_ASSOCIATE: '/hserve/v2.0/idp/:provider/user-association/',
  },

  WECHAT: {
    SILENT_LOGIN: '/hserve/v2.1/idp/wechat/silent-login/',
    AUTHENTICATE: '/hserve/v2.1/idp/wechat/authenticate/',
    USER_ASSOCIATE: '/hserve/v2.0/idp/wechat/user-associate/',
    TEMPLATE_MESSAGE: '/hserve/v2.0/template-message-ticket/',
    DECRYPT: '/hserve/v1/wechat/decrypt/',
    WXACODE: '/hserve/v1.4/miniappcode/',
    CENSOR_IMAGE: '/hserve/v1.7/censor-image/',
    CENSOR_MSG: '/hserve/v1.7/censor-msg/',
  },

  QQ: {
    SILENT_LOGIN: '/hserve/v2.0/idp/qq/silent-login/',
    AUTHENTICATE: '/hserve/v2.0/idp/qq/authenticate/',
    USER_ASSOCIATE: '/hserve/v2.0/idp/qq/user-association/',
    TEMPLATE_MESSAGE: '/hserve/v2.0/template-message-ticket/',
    DECRYPT: '/hserve/v2.0/qq/decrypt/',
  },

  ALIPAY: {
    SILENT_LOGIN: '/hserve/v2.1/idp/alipay/silent-login/',
    AUTHENTICATE: '/hserve/v2.1/idp/alipay/authenticate/',
    USER_ASSOCIATE: '/hserve/v2.0/idp/alipay/user-associate/',
    TEMPLATE_MESSAGE: '/hserve/v2.0/template-message-ticket/',
    MINIAPP_QR_CODE: '/hserve/v2.0/idp/alipay/miniapp-qr-code/',
  },

  VIDEO_SNAPSHOT: '/hserve/v1/media/video-snapshot/',
  M3U8_CONCAT: '/hserve/v1/media/m3u8-concat/',
  M3U8_CLIP: '/hserve/v1/media/m3u8-clip/',
  M3U8_META: '/hserve/v1/media/m3u8-meta/',
  VIDEO_AUDIO_META: '/hserve/v1/media/audio-video-meta/',

  LATEST_VERSION: '/hserve/v1/latest-sdk-version/',
}

const methodMapList = [{
  getUserInfo: {
    url: API.USER_DETAIL,
    defaultParams: {
      userID: '',
    }
  },
  getUserDetail: {
    url: API.USER_DETAIL,
  },
  getUserList: {
    url: API.USER_LIST,
  },
  updateUser: {
    url: API.UPDATE_USER,
    method: 'PUT'
  },
}, {
  getTableList: {
    url: API.TABLE_LIST
  },
  getTable: {
    url: API.TABLE_DETAIL
  },
  getRecordList: {
    url: API.RECORD_LIST
  },
  queryRecordList: {
    url: API.QUERY_RECORD_LIST
  },
  getRecord: {
    url: API.RECORD_DETAIL
  },
  createRecord: {
    url: API.CREATE_RECORD,
    method: 'POST'
  },
  createRecordList: {
    url: API.CREATE_RECORD_LIST,
    method: 'POST'
  },
  updateRecord: {
    url: API.UPDATE_RECORD,
    method: 'PUT'
  },
  updateRecordList: {
    url: API.UPDATE_RECORD_LIST,
    method: 'PUT'
  },
  deleteRecord: {
    url: API.DELETE_RECORD,
    method: 'DELETE'
  },
  deleteRecordList: {
    url: API.DELETE_RECORD_LIST,
    method: 'DELETE'
  }
}, {
  getContentList: {
    url: API.LAGECY_CONTENT_LIST
  },
  getContentList2: {
    url: API.CONTENT_LIST
  },
  getContent: {
    url: API.CONTENT_DETAIL
  },
  getContentGroupList: {
    url: API.CONTENT_GROUP_LIST
  },
  getContentGroup: {
    url: API.CONTENT_GROUP_DETAIL
  },
  getContentCategoryList: {
    url: API.CONTENT_CATEGORY_LIST
  },
  getContentCategory: {
    url: API.CONTENT_CATEGORY_DETAIL
  },
}, {
  getFileDetail: {
    url: API.FILE_DETAIL
  },
  getFileList: {
    url: API.FILE_LIST
  },
  deleteFile: {
    url: API.DELETE_FILE,
    method: 'DELETE'
  },
  deleteFiles: {
    url: API.DELETE_FILES,
    method: 'DELETE'
  },
  getFileCategoryDetail: {
    url: API.FILE_CATEGORY_DETAIL
  },
  getFileCategoryList: {
    url: API.FILE_CATEGORY_LIST
  },
  sendSmsCode: {
    url: API.SEND_SMS_CODE,
    method: 'POST'
  },
  verifySmsCode: {
    url: API.VERIFY_SMS_CODE,
    method: 'POST'
  }
}, {
  getOrderList: {
    url: API.PAY,
  }
}]

const RANDOM_OPTION = {
  max: 100
}

const requestParamsMap = {
  contentGroupID: 'content_group_id',
  categoryID: 'category_id',
  recordID: 'id',
  submissionType: 'submission_type',
  submissionValue: 'submission_value',
  categoryName: 'category_name',
  signatureID: 'signature_id',
}

module.exports = {
  API_HOST: API_HOST,
  API: API,
  AUTH_PREFIX: 'Hydrogen-r1',
  METHOD_MAP_LIST: methodMapList,
  DEBUG: false,
  RANDOM_OPTION: RANDOM_OPTION,
  REQUEST_PARAMS_MAP: requestParamsMap,
  SDK_DOWNLOAD_PAGE: SDK_DOWNLOAD_PAGE,
  VERSION: VERSION  // package.json 中的 version 也需要同步修改。
}
