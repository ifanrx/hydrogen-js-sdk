const utils = require('core-module/utils')
const HError = require('core-module/HError')
const constants = require('core-module/constants')
let windowManager = require('./windowManager')

let thirdPartyAuthRequest = (options = {}) => {
  if (!options.mode) options.mode = constants.THIRD_PARTY_AUTH_MODE.POPUP_WINDOW
  return new Promise((resolve, reject) => {
    let authWindow
    let handleRecieveMessage
    handleRecieveMessage = event => {
      if (event.origin !== window.location.origin) return  // 只处理同域页面传来的 message
      if (event.data && event.data.status === constants.THIRD_PARTY_AUTH_STATUS.SUCCESS) {
        utils.log(constants.LOG_LEVEL.DEBUG, `<third-party-auth> success, result: ${JSON.stringify(event.data)}`)
        window.removeEventListener('message', handleRecieveMessage, false)
        authWindow.close()
        return resolve(event.data)
      }
      if (event.data && event.data.status === constants.THIRD_PARTY_AUTH_STATUS.FAIL) {
        utils.log(constants.LOG_LEVEL.DEBUG, `<third-party-auth> fail, result: ${JSON.stringify(event.data)}`, )
        if (!options.debug) {
          window.removeEventListener('message', handleRecieveMessage, false)
          authWindow.close()
        }
        return reject(new HError(613, event.data.error))
      }
    }
    const onClose = () => {
      utils.log(constants.LOG_LEVEL.DEBUG, '<third-party-auth> close window, access_dinied')
      return reject(new HError(613, 'access_dinied'))
    }
    window.addEventListener('message', handleRecieveMessage, false)
    authWindow = windowManager.create(options.mode, {...options, onClose})
    authWindow.open()
  })
}

module.exports = thirdPartyAuthRequest
