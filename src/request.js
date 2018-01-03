const BaaS = require('./baas')
const constants = require('./constants')
const extend = require('node.extend')
const Promise = require('./promise')
const utils = require('./utils')


/**
 * 设置请求头
 * @param  {Object} header 自定义请求头
 * @return {Object}        扩展后的请求
 */
const builtInHeader = ['X-Hydrogen-Client-ID', 'X-Hydrogen-Client-Version', 'X-Hydrogen-Client-Platform', 'Authorization']

const setHeader = (header) => {
  let extendHeader = {
    'X-Hydrogen-Client-ID': BaaS._config.CLIENT_ID,
    'X-Hydrogen-Client-Version': BaaS._config.VERSION,
    'X-Hydrogen-Client-Platform': utils.getSysPlatform(),
  }

  let getAuthToken = BaaS.getAuthToken()
  if (getAuthToken) {
    extendHeader['Authorization'] = BaaS._config.AUTH_PREFIX + ' ' + getAuthToken
  }

  if (header) {
    builtInHeader.map(key => {
      if (header.hasOwnProperty(key)) {
        delete header[key]
      }
    })
  }

  return extend(extendHeader, header || {})
}

const request = ({ url, method = 'GET', data = {}, header = {}, dataType = 'json' }) => {

  return new Promise((resolve, reject) => {

    if (!BaaS._config.CLIENT_ID) {
      reject('未初始化客户端')
    }

    let headers = setHeader(header)

    if (!/https:\/\//.test(url)) {
      url = BaaS._config.API_HOST + url
    }

    wx.request({
      method: method,
      url: url,
      data: data,
      header: headers,
      dataType: dataType,
      success: res => {
        if (res.statusCode == constants.STATUS_CODE.UNAUTHORIZED) {
          BaaS.clearSession()
        }
        resolve(res)
      },
      fail: (err) => {
        throw new Error(err.errMsg)
      }
    })

    utils.log('Request => ' + url)
  })
}

module.exports = request
