const Promise = require('./promise')
const extend = require('node.extend')
const utils = require('./utils')
const constants = require('./constants')
const BaaS = require('./baas')

/**
 * 设置请求头
 * @param  {Object} header 自定义请求头
 * @return {Object}        扩展后的请求
 */
const builtInHeader = ['X-Hydrogen-Client-ID', 'X-Hydrogen-Client-Version', 'X-Hydrogen-Client-Platform', 'Authorization']

const setHeader = (header) => {
  var extendHeader = {
    'X-Hydrogen-Client-ID': BaaS._config.CLIENT_ID,
    'X-Hydrogen-Client-Version': BaaS._config.VERSION,
    'X-Hydrogen-Client-Platform': utils.getSysPlatform(),
  };

  var getAuthToken = BaaS.getAuthToken();
  if (getAuthToken) {
    extendHeader['Authorization'] = BaaS._config.AUTH_PREFIX + ' ' + getAuthToken;
  }

  if (header) {
    builtInHeader.map( (key) => {
      if (header.hasOwnProperty(key)) {
        delete header[key]
      }
    })
  }

  return extend(extendHeader, header || {});
};

/**
 * 用于网络请求
 * @param  {String} url                   url地址
 * @param  {String} [method='GET']        请求方法
 * @param  {Object|String} data           请求参数
 * @param  {Object} header                请求头部
 * @param  {String} [dataType='json']     发送数据的类型
 * @return {Object}                       返回一个 Promise 对象
 */
const request = ({ url, method = 'GET', data = {}, header = {}, dataType = 'json' }) => {

  return new Promise((resolve, reject) => {

    if (!BaaS._config.CLIENT_ID) {
      reject('未初始化客户端');
    }

    let headers = setHeader(header);

    if (!/https:\/\//.test(url)) {
      url = BaaS._config.API_HOST + url;
    }

    wx.request({
      method: method,
      url: url,
      data: data,
      header: headers,
      dataType: dataType,
      success: (res) => {
        if (res.statusCode == constants.STATUS_CODE.UNAUTHORIZED) {
          BaaS.clearSession();
        }
        resolve(res);
      },
      fail: (err) => {
        throw new Error(err.errMsg);
        reject(err);
      }
    });

    utils.log('Request => ' + url);
  });
};

module.exports = request;
