const constants = require('../constants')

const getCurrentUserInfoUrl = (BaaS, uid) => {
  const getId = () => {
    if (uid) {
      return Promise.resolve(uid)
    }
    return BaaS.storageAsync.get(constants.STORAGE_KEY.UID)
  }
  return getId().then(id => {
    return BaaS._config.API.USER_DETAIL.replace(/:userID/, id)
  })
}

module.exports = function getResendPayload(BaaS, payload, uid) {
  return getCurrentUserInfoUrl(BaaS, uid).then(currentUserInfoUrl => {
    let getUrl
    if (payload.url === currentUserInfoUrl) {
      getUrl = Promise.resolve(currentUserInfoUrl)
    } else {
      getUrl = getCurrentUserInfoUrl(BaaS)
    }
    return getUrl.then(url => {
      return Object.assign({}, payload, {url})
    })
  })
}
