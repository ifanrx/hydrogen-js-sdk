const utils = require('core-module/utils')
const HError = require('core-module/HError')
const constants = require('core-module/constants')
const windowManager = require('./windowManager')

let getThirdPartyAuthToken = (options = {}) => {
  // TODO: 兼容 IE
  return new Promise((resolve, reject) => {
    let authWindow
    let handleRecieveMessage
    const removeListener = () => {
      window.removeEventListener('message', handleRecieveMessage, false)
      authWindow.close()
    }
    handleRecieveMessage = event => {
      if (event.data && event.data.status === constants.THIRD_PARTY_AUTH_STATUS.ACCESS_ALLOWED && event.data.token) {
        utils.log(constants.LOG_LEVEL.DEBUG, `<third-party-auth> token: ${event.data.token}`)
        removeListener()
        return resolve(event.data.token)
      }
      if (event.data && event.data.status === constants.THIRD_PARTY_AUTH_STATUS.ACCESS_DINIED) {
        removeListener()
        return reject(new HError(603))
      }
    }
    const onClose = () => {
      utils.log(constants.LOG_LEVEL.DEBUG, '<third-party-auth> close window, access_dinied')
      return reject(new HError(603))
    }
    window.addEventListener('message', handleRecieveMessage, false)
    const windowType = options.iframe ? constants.AUTH_WINDOW_TYPE.IFRAME : constants.AUTH_WINDOW_TYPE.WINDOW
    authWindow = windowManager.create(windowType, {...options, onClose})
    authWindow.open()
  })
}

module.exports = getThirdPartyAuthToken
