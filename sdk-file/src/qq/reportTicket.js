const utils = require('core-module/utils')
const constants = require('core-module/constants')

const createReportTicket = BaaS => (formID) => {
  const API = BaaS._config.API
  let paramsObj = utils.makeReportTicketParam(formID)
  paramsObj.platform = constants.PLATFORM.QQ

  return BaaS._baasRequest({
    url: API.QQ.TEMPLATE_MESSAGE,
    method: 'POST',
    data: paramsObj,
  })
}

module.exports = function (BaaS) {
  BaaS.reportTicket = utils.ticketReportThrottle(createReportTicket(BaaS))
}
