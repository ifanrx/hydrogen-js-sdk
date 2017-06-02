'use strict';

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

module.exports = {
  log,
  format,
  excludeParams,
  getConfig
};
