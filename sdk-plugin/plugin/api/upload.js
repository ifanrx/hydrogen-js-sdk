const BaaS = require('./baas')
const constants = require('./constants')
const utils = require('./utils')

// get the upload config for upyun from sso
const getUploadFileConfig = (fileName, metaData) => {
  metaData.filename = fileName

  return BaaS._baasRequest({
    url: BaaS._config.API_HOST + BaaS._config.API.UPLOAD,
    method: 'POST',
    data: metaData
  })
}

const getUploadHeaders = () => {
  return {
    'Authorization': constants.UPLOAD.HEADER_AUTH_VALUE + BaaS.getAuthToken(),
    'X-Hydrogen-Client-Version': BaaS._config.VERSION,
    'X-Hydrogen-Client-Platform': utils.getSysPlatform(),
    'X-Hydrogen-Client-ID': BaaS._config.CLIENT_ID,
    'User-Agent': constants.UPLOAD.UA,
  }
}

module.exports = {
  getUploadFileConfig,
  getUploadHeaders,
}
