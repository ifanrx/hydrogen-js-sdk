const BaaS = require('./baas')
const baasRequest = require('./baasRequest').baasRequest
const HError = require('./HError')

const API = BaaS._config.API

const wxDecryptData = (...params) => {
  if(!validateParams(params)) {
    throw new HError(605)
  }

  let paramsObj = {
    encryptedData: params[0],
    iv: params[1]
  }

  return new Promise((resolve, reject) => {
    baasRequest({
      url: API.DECRYPT + params[2] + '/',
      method: 'POST',
      data: paramsObj,
    }).then(res => {
      let status = res.statusCode
      if(status === 401) return reject(new HError(401, res.data.message))
      if(status === 403) return reject(new HError(403, '微信解密插件未开启'))
      if(status === 400) return reject(new HError(400, res.data.message))
      return resolve(res.data)
    }, err => {
      reject(err)
    })
  })
}

const validateParams = (params) => {
  if (!(params instanceof Array) || params.length < 3) return false

  const requiredDataKeys = ['we-run-data', 'open-gid', 'phone-number']

  return requiredDataKeys.indexOf(params[2]) !== -1
}

module.exports = wxDecryptData
