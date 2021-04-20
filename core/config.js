const API_HOST = 'https://api.myminapp.com'
const WS_HOST = 'wss://api.ws.myminapp.com'
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
  ACCOUNT_INFO: '/hserve/v2.2/user/account/',
  PASSWORD_RESET: '/hserve/v2.0/user/password/reset/',
  ANONYMOUS_LOGIN: '/hserve/v2.0/login/anonymous/',
  LOGOUT: '/hserve/v2.0/session/destroy/',
  SERVER_TIME: '/hserve/v2.2/server/time/',
  NATIVE_OAUTH_AUTH: '/hserve/v2.3/idp/oauth/:provider/authenticate/',
  NATIVE_OAUTH_ASSOCIATION: '/hserve/v2.3/idp/oauth/:provider/user-association/',

  UPLOAD: '/hserve/v2.1/upload/',
  CLOUD_FUNCTION: '/hserve/v1/cloud-function/job/',

  USER_DETAIL: '/hserve/v2.5/user/info/:userID/',
  USER_LIST: '/hserve/v2.2/user/info/',
  UPDATE_USER: '/hserve/v2.5/user/info/',

  TABLE_LIST: '/hserve/v2.0/table/',
  TABLE_DETAIL: '/hserve/v2.0/table/:tableID/',
  RECORD_LIST: '/hserve/v2.4/table/:tableID/record/',
  QUERY_RECORD_LIST: '/hserve/v2.4/table/:tableID/record/',
  CREATE_RECORD_LIST: '/hserve/v2.4/table/:tableID/record/?enable_trigger=:enable_trigger',
  RECORD_DETAIL: '/hserve/v2.5/table/:tableID/record/:recordID/',
  CREATE_RECORD: '/hserve/v2.4/table/:tableID/record/?expand=:expand',
  UPDATE_RECORD: '/hserve/v2.5/table/:tableID/record/:recordID/?enable_trigger=:enable_trigger&expand=:expand',
  UPDATE_RECORD_LIST: '/hserve/v2.4/table/:tableID/record/?limit=:limit&offset=:offset&where=:where&enable_trigger=:enable_trigger&return_total_count=:return_total_count',
  DELETE_RECORD: '/hserve/v2.5/table/:tableID/record/:recordID/',
  DELETE_RECORD_LIST: '/hserve/v2.4/table/:tableID/record/?limit=:limit&offset=:offset&where=:where&enable_trigger=:enable_trigger&return_total_count=:return_total_count',

  LAGECY_CONTENT_LIST: '/hserve/v1/content/detail/',
  CONTENT_LIST: '/hserve/v2.2/content/detail/',
  CONTENT_GROUP_LIST: '/hserve/v2.2/content/group/',
  CONTENT_DETAIL: '/hserve/v2.0/content/detail/:richTextID/',
  CONTENT_GROUP_DETAIL: '/hserve/v2.2/content/group/:contentGroupID/',
  CONTENT_CATEGORY_LIST: '/hserve/v2.2/content/category/',
  CONTENT_CATEGORY_DETAIL: '/hserve/v2.0/content/category/:categoryID/',

  FILE_DETAIL: '/hserve/v2.1/uploaded-file/:fileID/',
  FILE_LIST: '/hserve/v2.2/uploaded-file/',
  DELETE_FILE: '/hserve/v2.1/uploaded-file/:fileID/',
  DELETE_FILES: '/hserve/v2.1/uploaded-file/',
  FILE_CATEGORY_DETAIL: '/hserve/v1.3/file-category/:categoryID/',
  FILE_CATEGORY_LIST: '/hserve/v2.2/file-category/',
  CENSOR_IMAGE: '/hserve/v1.7/censor-image/',
  CENSOR_MSG: '/hserve/v1.7/censor-msg/',
  SEND_SMS_CODE: '/hserve/v2.2/sms-verification-code/',
  VERIFY_SMS_CODE: '/hserve/v1.8/sms-verification-code/verify/',

  PAY: '/hserve/v2.2/idp/pay/order/',
  ORDER: '/hserve/v2.0/idp/pay/order/:transactionID/',

  TEMPLATE_MESSAGE_EVENT_REPORT: '/hserve/v2.0/template-message/event-report/',

  WEB: {
    THIRD_PARTY_ASSOCIATE: '/hserve/v2.0/idp/:provider/user-association/',
    THIRD_PARTY_AUTH: '/hserve/v2.0/idp/:provider/redirect/',
    THIRD_PARTY_LOGIN: '/hserve/v2.0/idp/:provider/authenticate/',
    THIRD_PARTY_SILENT_LOGIN: '/hserve/v2.5/idp/:provider/silent-login/',
  },

  WECHAT: {
    SILENT_LOGIN: '/hserve/v2.5/idp/wechat/silent-login/',
    AUTHENTICATE: '/hserve/v2.5/idp/wechat/authenticate/',
    USER_ASSOCIATE: '/hserve/v2.4/idp/wechat/user-associate/',
    TEMPLATE_MESSAGE: '/hserve/v2.0/template-message-ticket/',
    SUBSCRIBE_MESSAGE: '/hserve/v2.2/subscription-message/relationship-report/',
    DECRYPT: '/hserve/v1/wechat/decrypt/',
    WXACODE: '/hserve/v2.4/miniappcode/',
    CENSOR_IMAGE: '/hserve/v1.7/censor-image/',
    CENSOR_MSG: '/hserve/v1.7/censor-msg/',
    CENSOR_ASYNC: '/hserve/v2.2/async-censor/',
    JSSDK_CREDENTIALS: '/hserve/v2.4/idp/wechat/jssdk-credentials/',
    PHONE_LOGIN: '/hserve/v2.5/idp/wechat/phone-login/',
    UPDATE_PHONE: '/hserve/v2.5/idp/wechat/phone-verification/',
    UPDATE_USER_INFO: '/hserve/v2.5/idp/wechat/user/info/', // 适用于基础库小于 2.16.0，大于 2.10.4
    UPDATE_USER_INFO_UPGRADED: '/hserve/v2.6/idp/wechat/user/info/', // 适用于基础库 2.16.0 及以上
    USER_RISK_RANK: '/hserve/v2.5/user-riskrank/',
  },

  QQ: {
    SILENT_LOGIN: '/hserve/v2.5/idp/qq/silent-login/',
    AUTHENTICATE: '/hserve/v2.5/idp/qq/authenticate/',
    USER_ASSOCIATE: '/hserve/v2.0/idp/qq/user-association/',
    TEMPLATE_MESSAGE: '/hserve/v2.0/template-message-ticket/',
    SUBSCRIBE_MESSAGE: '/hserve/v2.2/subscription-message/relationship-report/',
    DECRYPT: '/hserve/v2.0/qq/decrypt/',
    CENSOR_IMAGE: '/hserve/v2.2/qq/censor-image/',
    CENSOR_MSG: '/hserve/v2.2/qq/censor-msg/',
  },

  BAIDU: {
    SILENT_LOGIN: '/hserve/v2.5/idp/baidu/silent-login/',
    AUTHENTICATE: '/hserve/v2.5/idp/baidu/authenticate/',
    USER_ASSOCIATE: '/hserve/v2.1/idp/baidu/user-association/',
    TEMPLATE_MESSAGE: '/hserve/v2.0/template-message-ticket/',
  },

  ALIPAY: {
    SILENT_LOGIN: '/hserve/v2.5/idp/alipay/silent-login/',
    AUTHENTICATE: '/hserve/v2.5/idp/alipay/authenticate/',
    USER_ASSOCIATE: '/hserve/v2.0/idp/alipay/user-associate/',
    TEMPLATE_MESSAGE: '/hserve/v2.0/template-message-ticket/',
    MINIAPP_QR_CODE: '/hserve/v2.0/idp/alipay/miniapp-qr-code/',
    CENSOR_MSG: '/hserve/v2.4/alipay/censor-msg/',
  },

  BYTEDANCE: {
    SILENT_LOGIN: '/hserve/v2.5/idp/bytedance/silent-login/',
    AUTHENTICATE: '/hserve/v2.5/idp/bytedance/authenticate/',
    USER_ASSOCIATE: '/hserve/v2.4/idp/bytedance/user-association/',
    TEMPLATE_MESSAGE: '/hserve/v2.0/template-message-ticket/',
    MINIAPP_QR_CODE: '/hserve/v2.4/idp/bytedance/miniapp-qr-code/',
  },

  JINGDONG: {
    SILENT_LOGIN: '/hserve/v2.5/idp/jd/silent-login/',
    AUTHENTICATE: '/hserve/v2.5/idp/jd/authenticate/',
    USER_ASSOCIATE: '/hserve/v2.4/idp/jd/user-association/',
  },

  KUAISHOU: {
    SILENT_LOGIN: '/hserve/v2.5/idp/kuaishou/silent-login/',
    AUTHENTICATE: '/hserve/v2.5/idp/kuaishou/authenticate/',
    USER_ASSOCIATE: '/hserve/v2.5/idp/kuaishou/user-association/',
    SUBSCRIBE_MESSAGE: '/hserve/v2.2/subscription-message/relationship-report/',
    PHONE_LOGIN: '/hserve/v2.5/idp/kuaishou/phone-login/',
    UPDATE_PHONE: '/hserve/v2.5/idp/kuaishou/phone-verification/',
  },

  VIDEO_SNAPSHOT: '/hserve/v1/media/video-snapshot/',
  M3U8_CONCAT: '/hserve/v1/media/m3u8-concat/',
  M3U8_CLIP: '/hserve/v1/media/m3u8-clip/',
  M3U8_META: '/hserve/v1/media/m3u8-meta/',
  VIDEO_AUDIO_META: '/hserve/v1/media/audio-video-meta/',

  GET_ASYNC_JOB_RESULT: '/hserve/v1/bulk-operation/:id/',
  LATEST_VERSION: '/hserve/v1/latest-sdk-version/',
}

const methodMapList = [{
  getUserInfo: {
    url: API.USER_DETAIL,
    defaultParams: {
      userID: '',
    },
  },
  getUserDetail: {
    url: API.USER_DETAIL,
  },
  getUserList: {
    url: API.USER_LIST,
  },
  updateUser: {
    url: API.UPDATE_USER,
    method: 'PUT',
  },
}, {
  getTableList: {
    url: API.TABLE_LIST,
  },
  getTable: {
    url: API.TABLE_DETAIL,
  },
  getRecordList: {
    url: API.RECORD_LIST,
  },
  queryRecordList: {
    url: API.QUERY_RECORD_LIST,
  },
  getRecord: {
    url: API.RECORD_DETAIL,
  },
  createRecord: {
    url: API.CREATE_RECORD,
    method: 'POST',
  },
  createRecordList: {
    url: API.CREATE_RECORD_LIST,
    method: 'POST',
  },
  updateRecord: {
    url: API.UPDATE_RECORD,
    method: 'PUT',
  },
  updateRecordList: {
    url: API.UPDATE_RECORD_LIST,
    method: 'PUT',
  },
  deleteRecord: {
    url: API.DELETE_RECORD,
    method: 'DELETE',
  },
  deleteRecordList: {
    url: API.DELETE_RECORD_LIST,
    method: 'DELETE',
  },
}, {
  getContentList: {
    url: API.LAGECY_CONTENT_LIST,
  },
  getContentListV2: {
    url: API.CONTENT_LIST,
  },
  getContent: {
    url: API.CONTENT_DETAIL,
  },
  getContentGroupList: {
    url: API.CONTENT_GROUP_LIST,
  },
  getContentGroup: {
    url: API.CONTENT_GROUP_DETAIL,
  },
  getContentCategoryList: {
    url: API.CONTENT_CATEGORY_LIST,
  },
  getContentCategory: {
    url: API.CONTENT_CATEGORY_DETAIL,
  },
}, {
  getFileDetail: {
    url: API.FILE_DETAIL,
  },
  getFileList: {
    url: API.FILE_LIST,
  },
  deleteFile: {
    url: API.DELETE_FILE,
    method: 'DELETE',
  },
  deleteFiles: {
    url: API.DELETE_FILES,
    method: 'DELETE',
  },
  getFileCategoryDetail: {
    url: API.FILE_CATEGORY_DETAIL,
  },
  getFileCategoryList: {
    url: API.FILE_CATEGORY_LIST,
  },
  sendSmsCode: {
    url: API.SEND_SMS_CODE,
    method: 'POST',
  },
  verifySmsCode: {
    url: API.VERIFY_SMS_CODE,
    method: 'POST',
  },
}, {
  getOrderList: {
    url: API.PAY,
  },
}]

const RANDOM_OPTION = {
  max: 100,
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
  /**
   * SDK 版本号
   *
   * @type string
   * @memberof BaaS._config
   */
  VERSION: VERSION, // package.json 中的 version 也需要同步修改。
  WS_HOST: WS_HOST,
  WS_PATH: 'ws/hydrogen/',
  WS_REALM: 'com.ifanrcloud',
  WS_BASE_TOPIC: 'com.ifanrcloud.schema_event',
}
