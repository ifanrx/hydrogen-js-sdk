const BaaS = require('../baas')
const HError = require('../HError')

const API = BaaS._config.API

const wxDecryptData = (...params) => {
  if (!validateParams(params)) {
    throw new HError(605)
  }

  let paramsObj = {
    encryptedData: params[0],
    iv: params[1]
  }

  return BaaS._baasRequest({
    url: API.DECRYPT + params[2] + '/',
    method: 'POST',
    data: paramsObj,
  }).then(res => {
    return res.data
  }, err => {
    let code = err.code
    if (code === 403) throw new HError(403, '微信解密插件未开启')
    throw err
  })
}

const validateParams = (params) => {
  if (!(params instanceof Array) || params.length < 3) return false

  const requiredDataKeys = ['we-run-data', 'open-gid', 'phone-number']

  return requiredDataKeys.indexOf(params[2]) !== -1
}

module.exports = wxDecryptData
