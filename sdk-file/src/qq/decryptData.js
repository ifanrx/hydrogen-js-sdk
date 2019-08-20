const HError = require('core-module/HError')

const createDecryptDataFn = BaaS => (...params) => {
  const API = BaaS._config.API

  if (!validateParams(params)) {
    throw new HError(605)
  }

  let paramsObj = {
    encryptedData: params[0],
    iv: params[1]
  }

  return BaaS._baasRequest({
    url: API.QQ.DECRYPT + params[2] + '/',
    method: 'POST',
    data: paramsObj,
  }).then(res => {
    return res.data
  }, err => {
    let code = err.code
    if (code === 403) throw new HError(403, 'QQ 解密插件未开启')
    throw err
  })
}

const validateParams = (params) => {
  if (!(params instanceof Array) || params.length < 3) return false
  const requiredDataKeys = ['open-gid']
  return requiredDataKeys.indexOf(params[2]) !== -1
}

module.exports = function (BaaS) {
  BaaS.decryptData = createDecryptDataFn(BaaS)
}
