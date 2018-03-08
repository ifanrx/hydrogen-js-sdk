const API_HOST = 'https://xiaoapp.io'

const API = {
  LOGIN: '/hserve/v1.4/session/init/',
  AUTHENTICATE: '/hserve/v1.4/session/authenticate/',
  LOGOUT: '/hserve/v1/session/destroy/',
  PAY: '/hserve/v1/wechat/pay/order/',
  ORDER: '/hserve/v1/wechat/pay/order/:transactionID/',
  UPLOAD: '/hserve/v1/upload/',
  TEMPLATE_MESSAGE: '/hserve/v1/template-message-ticket/',
  DECRYPT: '/hserve/v1/wechat/decrypt/',
  WXACODE: '/hserve/v1.3/miniappcode/',

  USER_DETAIL: '/hserve/v1.3/user/info/:userID/',
  USER_LIST: '/hserve/v1.3/user/info/',
  UPDATE_USER: '/hserve/v1.3/user/info/',

  TABLE_LIST: '/hserve/v1.4/table/',
  TABLE_DETAIL: '/hserve/v1.4/table/:tableID/',
  RECORD_LIST: '/hserve/v1.4/table/:tableID/record/',
  QUERY_RECORD_LIST: '/hserve/v1.4/table/:tableID/record/',
  RECORD_DETAIL: '/hserve/v1.4/table/:tableID/record/:recordID/',
  CREATE_RECORD: '/hserve/v1.4/table/:tableID/record/',
  UPDATE_RECORD: '/hserve/v1.4/table/:tableID/record/:recordID/',
  DELETE_RECORD: '/hserve/v1.4/table/:tableID/record/:recordID/',

  LAGECY_CONTENT_LIST: '/hserve/v1/content/detail/',
  CONTENT_LIST: '/hserve/v1.3/content/detail/',
  CONTENT_GROUP_LIST: '/hserve/v1/content/group/',
  CONTENT_DETAIL: '/hserve/v1.3/content/detail/:richTextID/',
  CONTENT_GROUP_DETAIL: '/hserve/v1/content/category/',
  CONTENT_CATEGORY_LIST: '/hserve/v1/content/category/',
  CONTENT_CATEGORY_DETAIL: '/hserve/v1/content/category/:categoryID/',

  FILE_DETAIL: '/hserve/v1.3/uploaded-file/:fileID/',
  FILE_LIST: '/hserve/v1.3/uploaded-file/',
  DELETE_FILE: '/hserve/v1.3/uploaded-file/:fileID/',
  DELETE_FILES: '/hserve/v1.3/uploaded-file/',
  FILE_CATEGORY_DETAIL: '/hserve/v1.3/file-category/:categoryID/',
  FILE_CATEGORY_LIST: '/hserve/v1.3/file-category/',
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
  updateRecord: {
    url: API.UPDATE_RECORD,
    method: 'PUT'
  },
  deleteRecord: {
    url: API.DELETE_RECORD,
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
},]

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
}

module.exports = {
  API_HOST: API_HOST,
  API: API,
  AUTH_PREFIX: 'Hydrogen-r1',
  METHOD_MAP_LIST: methodMapList,
  DEBUG: false,
  RANDOM_OPTION: RANDOM_OPTION,
  REQUEST_PARAMS_MAP: requestParamsMap,
  VERSION: 'v1.2.0'
}
