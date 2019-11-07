const constants = require('../constants')

const getCurrentUserInfoUrl = (BaaS, uid) => {
  const id = uid || BaaS.storage.get(constants.STORAGE_KEY.UID)
  return BaaS._config.API.USER_DETAIL.replace(/:userID/, id)
}

module.exports = function getResendPayload(BaaS, payload, uid) {
  const currentUserInfoUrl = getCurrentUserInfoUrl(BaaS, uid)
  return Object.assign({}, payload, {
    url: payload.url === currentUserInfoUrl
      ? getCurrentUserInfoUrl(BaaS)
      : payload.url
  })
}
