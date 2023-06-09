const BaaS = require('./baas')
const constants = require('./constants')
const utils = require('./utils')

// get the upload config for upyun from sso
const getUploadFileConfig = (fileName, metaData) => {
  metaData.filename = fileName

  return BaaS._baasRequest({
    url: BaaS._polyfill.getAPIHost().replace(/\/$/, '') + '/' + BaaS._config.API.UPLOAD.replace(/^\//, ''),
    method: 'POST',
    data: metaData,
  })
}

const getUploadHeaders = () => {
  return BaaS.getAuthToken().then(authToken => {
    return {
      'Authorization': constants.UPLOAD.HEADER_AUTH_VALUE + authToken,
      'X-Hydrogen-Client-Version': BaaS._config.VERSION,
      'X-Hydrogen-Client-Platform': utils.getSysPlatform(),
      'X-Hydrogen-Client-ID': BaaS._config.CLIENT_ID,
      'User-Agent': constants.UPLOAD.UA,
    }
  })
}

const getMultipartUploadConfig = (method = 'POST', params) => {
  return BaaS._baasRequest({
    url: BaaS._polyfill.getAPIHost().replace(/\/$/, '') + '/' + BaaS._config.API.MULTIPART_UPLOAD.replace(/^\//, ''),
    method,
    data: params,
  })
}

module.exports = {
  getUploadFileConfig,
  getUploadHeaders,
  getMultipartUploadConfig,
}
