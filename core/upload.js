const BaaS = require('./baas')
const constants = require('./constants')
const storage = require('./storage')
const utils = require('./utils')

// get the upload config for upyun from sso
const getUploadFileConfig = (fileName, metaData) => {
  metaData.filename = fileName

  return BaaS._baasRequest({
    url:
      BaaS._polyfill.getAPIHost().replace(/\/$/, '') +
      '/' +
      BaaS._config.API.UPLOAD.replace(/^\//, ''),
    method: 'POST',
    data: metaData,
  })
}

const getUploadHeaders = ({async = true} = {}) => {
  if (!async) {
    const authToken = storage.get(constants.STORAGE_KEY.AUTH_TOKEN)
    return {
      Authorization: constants.UPLOAD.HEADER_AUTH_VALUE + authToken,
      'X-Hydrogen-Client-Version': BaaS._config.VERSION,
      'X-Hydrogen-Client-Platform': utils.getSysPlatform(),
      'X-Hydrogen-Client-ID': BaaS._config.CLIENT_ID,
      'User-Agent': constants.UPLOAD.UA,
    }
  }

  return BaaS.getAuthToken().then(authToken => {
    return {
      Authorization: constants.UPLOAD.HEADER_AUTH_VALUE + authToken,
      'X-Hydrogen-Client-Version': BaaS._config.VERSION,
      'X-Hydrogen-Client-Platform': utils.getSysPlatform(),
      'X-Hydrogen-Client-ID': BaaS._config.CLIENT_ID,
      'User-Agent': constants.UPLOAD.UA,
    }
  })
}

const multipartUpload = {
  init: (params, metaData) => {
    return BaaS._baasRequest({
      url:
        BaaS._polyfill.getAPIHost().replace(/\/$/, '') +
        '/' +
        BaaS._config.API.MULTIPART_UPLOAD.replace(/^\//, ''),
      method: 'POST',
      data: {...params, ...metaData},
    })
  },
  getAuthorization: id => {
    return BaaS._baasRequest({
      url:
        BaaS._polyfill.getAPIHost().replace(/\/$/, '') +
        '/' +
        BaaS._config.API.MULTIPART_UPLOAD.replace(/^\//, '') +
        id + '/',
      method: 'GET',
    })
  },
  complete: (id, multi_uuid) => {
    return BaaS._baasRequest({
      url:
        BaaS._polyfill.getAPIHost().replace(/\/$/, '') +
        '/' +
        BaaS._config.API.MULTIPART_UPLOAD.replace(/^\//, '') +
        id + '/',
      method: 'PUT',
      data: {multi_uuid},
    })
  },
}

module.exports = {
  getUploadFileConfig,
  getUploadHeaders,
  multipartUpload,
}
