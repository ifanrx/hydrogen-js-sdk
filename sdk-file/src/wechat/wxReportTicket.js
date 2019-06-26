const utils = require('core-module/utils')

const createReportTicket = BaaS => (formID) => {
  const API = BaaS._config.API
  let paramsObj = utils.makeReportTicketParam(formID)
  paramsObj.platform = BaaS._polyfill.TEMPLATE_MESSAGE_PLATFORM

  return BaaS._baasRequest({
    url: API.WECHAT.TEMPLATE_MESSAGE,
    method: 'POST',
    data: paramsObj,
  })
}

module.exports = function (BaaS) {
  BaaS.reportTicket = utils.ticketReportThrottle(createReportTicket(BaaS))
  BaaS.wxReportTicket = BaaS.reportTicket  // 兼容旧接口
}
