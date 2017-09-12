const BaaS = require('./baas')
const baasRequest = require('./baasRequest').baasRequest
const constants = require('./constants')
const Promise = require('./promise')

const API = BaaS._config.API

const wxDecryptData = (...params) => {
  if(!validateParams(params)) {
    throw new Error(constants.MSG.ARGS_ERROR)
  }

  let paramsObj = {
    encryptedData: params[0],
    iv: params[1]
  }

  return baasRequest({
    url: API.DECRYPT + params[2] + '/',
    method: 'POST',
    data: paramsObj,
  }).then(function (res) {
    let status = res.statusCode
    return new Promise((resolve, reject) => {
      if(status === 401) return reject(new Error('用户未登录 or session_key 过期'))
      if(status === 403) return reject(new Error('微信解密插件未开启'))
      if(status === 400) return reject(new Error('提交的解密信息有错'))
      return resolve(res.data)
    })
  })
};

const validateParams = (params) => {
  if (!params instanceof Array || params.length < 3) return false

  const requiredDataKeys = ['we-run-data', 'open-gid', 'phone-number']

  return requiredDataKeys.includes(params[2])
}

module.exports = wxDecryptData
