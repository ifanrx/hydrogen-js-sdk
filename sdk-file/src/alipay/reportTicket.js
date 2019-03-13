const utils = require('core-module/utils')

const createReportTicket = BaaS => (formID) => {
  const API = BaaS._config.API
  let paramsObj = utils.makeReportTicketParam(formID)

  return BaaS._baasRequest({
    url: API.ALIPAY.TEMPLATE_MESSAGE,
    method: 'POST',
    data: paramsObj,
  })
}

module.exports = function (BaaS) {
  BaaS.reportTicket = createReportTicket(BaaS)
}
