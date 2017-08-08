'use strict';
const extend = require('node.extend');

let config;
try {
  config = require('sdk-config');
} catch (e) {
  config = require('./config.dev');
}

/**
 * 获取 SDK 配置信息
 * @return {Object}
 */
const getConfig = () => {
  return config;
};

/**
 * 获取系统 Platform 信息
 * @return {String}
 */
const getSysPlatform = () => {
  var platform = 'UNKNOWN';
  try {
    var res = wx.getSystemInfoSync();
    platform = res.platform;
  } catch (e) {
    // pass for now
  }
  return platform;
};

/**
 * 日志记录
 * @param  {String} msg 日志信息
 */
const log = (msg) => {
  if (typeof BaaS !== 'undefined' && BaaS.test || !getConfig().DEBUG) { // 测试环境
    return;
  }
  // 记录日志到日志文件
  console.log('BaaS LOG: ' + msg);
};

/**
 * 转换 API 参数
 * @param  {String} url    API URL
 * @param  {Object} params API 参数
 * @return {String}        转换参数后的 API URL
 */
const format = (url, params) => {
  params = params || {};
  for (var key in params) {
    var reg = new RegExp(':' + key, 'g');
    url = url.replace(reg, params[key]);
  }
  return url.replace(/([^:])\/\//g, (m, m1) => {
    return m1 + '/';
  });
};

/**
 * 把 URL 中用于 format URL 的参数移除掉
 * @param  {String} URL    URL 链接
 * @param  {Object} params 参数对象
 * @return {Object}
 */
const excludeParams = (URL, params) => {
  URL.replace(/:(\w*)/g, (match, m1) => {
    if (params[m1] !== undefined) {
      delete params[m1];
    }
  });
  return params;
};

/**
 * 将 URL 中的查询字符串替换为服务端可接受的参数
 * @param  {String} URL    URL 链接
 * @param  {Object} params 参数对象
 * @return {Object}
 */
const replaceQueryParams = (URL, params = {}) => {
  const paramsMap = {
    contentGroupID: 'content_group_id',
    categoryID: 'category_id',
    recordID: 'id',
  }

  let copiedParams = extend({}, params)

  Object.keys(params).map(key => {
    Object.keys(paramsMap).map(mapKey => {
      if (key.startsWith(mapKey)) {
        var newKey = key.replace(mapKey, paramsMap[mapKey])
        delete copiedParams[key]
        copiedParams[newKey] = params[key]
      }
    })
  })

  return copiedParams
}

module.exports = {
  log,
  format,
  excludeParams,
  getConfig,
  getSysPlatform,
  replaceQueryParams,
};
