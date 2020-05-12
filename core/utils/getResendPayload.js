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
    // 确认需要重新发起请求的 url 是否跟 uid 匹配（匹配的 uid 会在 url 中）
    if (payload.url === currentUserInfoUrl) {
      getUrl = getCurrentUserInfoUrl(BaaS)
    } else {
      getUrl = Promise.resolve(payload.url)
    }
    return getUrl.then(url => {
      return Object.assign({}, payload, {url})
    })
  })
}
