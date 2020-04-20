const utils = require('core-module/utils')
const appName = utils.getBytedanceAppName()

/**
 * 获取二维码
 * @function
 * @name getQRCode
 * @memberof BaaS
 * @param {BaaS.BytedanceQRCodeParams} options 参数
 * @return {Promise<any>}
 */
const createGetQRCodeFn = BaaS => ({path, platform, width, lineColor, background, setIcon, categoryName, categoryId}) => {
  const API = BaaS._config.API
  return BaaS._baasRequest({
    url: API.BYTEDANCE.MINIAPP_QR_CODE,
    method: 'POST',
    data: {
      appname: appName,
      path,
      platform,
      width,
      line_color: lineColor,
      background,
      set_icon: setIcon,
      category_name: categoryName,
      category_id: categoryId,
    },
  }).then(res => {
    return res.data
  })
}

module.exports = function (BaaS) {
  BaaS.getQRCode = createGetQRCodeFn(BaaS)
}
