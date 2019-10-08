const utils = require('core-module/utils')

const createReportTicket = BaaS => (formID) => {
  const API = BaaS._config.API
  let paramsObj = utils.makeReportTicketParam(formID)
  paramsObj.platform = 'baidu_miniapp'

  return BaaS._baasRequest({
    url: API.BAIDU.TEMPLATE_MESSAGE,
    method: 'POST',
    data: paramsObj,
  })
}

module.exports = function (BaaS) {
  BaaS.reportTicket = utils.ticketReportThrottle(createReportTicket(BaaS))
}
