const API_HOST = 'https://sso.ifanr.com';

// API 配置
const API = {
  INIT: '/hserve/v1/session/init/',
  LOGIN: '/hserve/v1/session/authenticate/',
  LOGOUT: '/hserve/v1/session/destroy/',
  PAY: '/hserve/v1/wechat/pay/order/',
  ORDER: '/hserve/v1/wechat/pay/order/:transactionID/',
  UPLOAD: '/hserve/v1/file/upload/',

  // 内容模块
  CONTENT_LIST: '/hserve/v1/content/detail/',
  CONTENT_GROUP_LIST: '/hserve/v1/content/group/',
  CONTENT_DETAIL: '/hserve/v1/content/detail/:richTextID/',
  CONTENT_GROUP_DETAIL: '/hserve/v1/content/category/',
  CONTENT_CATEGORY_DETAIL: '/hserve/v1/content/category/:categoryID/',
  // 通用存储模块
  TABLE_LIST: '/hserve/v1/table/',
  TABLE_DETAIL: '/hserve/v1/table/:tableID/',
  RECORD_LIST: '/hserve/v1.1/table/:tableID/record/',
  RECORD_DETAIL: '/hserve/v1.1/table/:tableID/record/:recordID/',
  CREATE_RECORD: '/hserve/v1.1/table/:tableID/record/',
  UPDATE_RECORD: '/hserve/v1.1/table/:tableID/record/:recordID/',
  DELETE_RECORD: '/hserve/v1.1/table/:tableID/record/:recordID/',
  COMPLEX_QUERY_LIST: '/hserve/v1/table/:tableID/query/',
  // 用户
  USER_INFO: '/hserve/v1/user/info/:userID/',
};

const methodMapList = [{
  getUserInfo: {
    url: API.USER_INFO,
    defaultParams: {
      userID: '',
    }
  }
}, {
  // 获取数据表列表
  getTableList: {
    url: API.TABLE_LIST
  },
  // 获取数据表详情
  getTable: {
    url: API.TABLE_DETAIL
  },
  // 获取记录列表
  getRecordList: {
    url: API.RECORD_LIST
  },
  // 获取记录详情
  getRecord: {
    url: API.RECORD_DETAIL
  },
  // 新增记录
  createRecord: {
    url: API.CREATE_RECORD,
    method: 'POST'
  },
  // 更新记录
  updateRecord: {
    url: API.UPDATE_RECORD,
    method: 'PUT'
  },
  // 删除记录
  deleteRecord: {
    url: API.DELETE_RECORD,
    method: 'DELETE'
  },
  // 复杂查询
  getComplexQueryList: {
    url: API.COMPLEX_QUERY_LIST,
  }
}, {
  // 获取内容列表
  getContentList: {
    url: API.CONTENT_LIST
  },
  // 获取内容详情
  getContent: {
    url: API.CONTENT_DETAIL
  },
  // 获取内容库列表
  getContentGroupList: {
    url: API.CONTENT_GROUP_LIST
  },
  // 获取内容库详情
  getContentGroup: {
    url: API.CONTENT_GROUP_DETAIL
  },
  // 获取分类详情
  getContentCategory: {
    url: API.CONTENT_CATEGORY_DETAIL
  }
},];

// 配置
module.exports = {
  API_HOST: API_HOST,
  // API 路径
  API: API,
  AUTH_PREFIX: 'Hydrogen-r1',
  METHOD_MAP_LIST: methodMapList,
  DEBUG: false,
};
