module.exports = {
  QUERY_LIMITATION_DEFAULT: 20,

  // 存储信息
  STORAGE_KEY: {
    AUTH_TOKEN: 'auth_token',
    USERINFO: 'userinfo',
    UID: 'uid',
    OPENID: 'openid',
    UNIONID: 'unionid',
    IS_LOGINED_BAAS: 'is_logined_baas',
    IS_ANONYMOUS_USER: 'is_anonymous_user',
    EXPIRES_AT: 'session_expires_at',
    ALIPAY_USER_ID: 'alipay_user_id',
    LATEST_VERSION_CHECK_MILLISECONDS: 'latest_version_check_milliseconds',
    REPORT_TICKET_INVOKE_RECORD: 'report_ticket_invoke_record',
  },
  VERSION_MIN_CHECK_INTERVAL: '86400000',

  STATUS_CODE: {
    CREATED: 201,
    SUCCESS: 200,
    UPDATE: 200,
    PATCH: 200,
    DELETE: 204,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
  },

  UPLOAD: {
    UPLOAD_FILE_KEY: 'file',
    HEADER_AUTH: 'Authorization',
    HEADER_CLIENT: 'X-Hydrogen-Client-ID',
    HEADER_AUTH_VALUE: 'Hydrogen-r1 ',
    UA: 'Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
  },

  USER_PROFILE_BUILD_IN_FIELDS: [
    // 原有内置字段
    'id',
    'created_at',
    'created_by',
    'updated_at',
    'country',
    'nickname',
    'province',
    'city',
    'language',
    'openid',
    'unionid',
    'avatar',
    'is_authorized',
    'gender',
  ],

  httpMethodCodeMap: {
    GET: 200,
    POST: 201,
    PUT: 200,
    PATCH: 200,
    DELETE: 204,
  },

  LOG_LEVEL: {
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
  },

  UPDATE_USERPROFILE_VALUE: {
    OVERWRITE: 'overwrite',
    SETNX: 'setnx',
    FALSE: 'false',
  },

  TICKET_REPORT_INVOKE_LIMIT: {
    MIN_INTERVAL_PRE_TIME: 1 * 1000,
    TIMES_LIMIT: {
      MAX_TIMES_PER_CYCLE: 20,
      CYCLE: 24 * 60 * 60 * 1000,
    }
  },

  THIRD_PARTY_AUTH_MODE: {
    POPUP_IFRAME: 'popup-iframe',
    POPUP_WINDOW: 'popup-window',
    REDIRECT: 'redirect',
  },

  THIRD_PARTY_AUTH_STATUS: {
    SUCCESS: 'success',
    FAIL: 'fail',
  },

  THIRD_PARTY_AUTH_HANDLER: {
    LOGIN: 'login',
    ASSOCIATE: 'associate',
  },

  THIRD_PARTY_AUTH_PROVIDER: {
    WECHAT_MP: 'oauth-wechat-mp',
    WECHAT_WEB: 'oauth-wechat-web',
    WEIBO: 'oauth-weibo',
  },

  THIRD_PARTY_AUTH_URL_PARAM: {
    PROVIDER: 'provider',
    REFERER: 'referer',
    MODE: 'mode',
    DEBUG: 'debug',
    CREATE_USER: 'create_user',
    UPDATE_USER_PROFILE: 'update_userprofile',
    WECHAT_IFRAME_CONTENT_STYLE: 'wechat_iframe_content_style',
    HANDLER: 'handler',
    TOKEN: 'token',
    AUTH_RESULT: 'auth-result',
  },

  PLATFORM: {
    WECHAT: 'wechat_miniapp',
    ALIPAY: 'alipay_miniapp',
    QQ: 'qq_miniapp',
    BAIDU: 'baidu_miniapp',
  },

  ENV_HEADER_KEY: 'HTTP_X_HYDROGEN_ENV_ID'
}
