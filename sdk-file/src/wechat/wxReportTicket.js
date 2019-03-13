const BaaS = require('core-module/baas')
const utils = require('core-module/utils')

const API = BaaS._config.API

const wxReportTicket = (formID) => {
  let paramsObj = utils.makeReportTicketParam(formID)

  return BaaS._baasRequest({
    url: API.WECHAT.TEMPLATE_MESSAGE,
    method: 'POST',
    data: paramsObj,
  })
}

module.exports = wxReportTicket
