const utils = require('core-module/utils')
const constants = require('core-module/constants')
const WindowManager = require('./WindowManager/Manager')

let getThirdPartyAuthToken = ({authPageUrl, provider, iframe}) => {
  // TODO: 兼容 IE
  return new Promise((resolve, reject) => {
    let authWindow
    let handleRecieveMessage
    const removeListener = () => {
      window.removeEventListener('message', handleRecieveMessage, false)
      authWindow.close()
    }
    handleRecieveMessage = event => {
      if (event.data && event.data.status === 'success' && event.data.token) {
        resolve(event.data.token)
        removeListener()
      }
      if (event.data && event.data.status === 'access_denied') {
        reject(new HError(603))
        removeListener()
      }
    }
    window.addEventListener('message', handleRecieveMessage, false)
    utils.log(constants.LOG_LEVEL.DEBUG, `<third-party-auth> open window`)
    authWindow = new WindowManager({authPageUrl, provider, iframe})
  })
}

module.exports = getThirdPartyAuthToken
