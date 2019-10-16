const BaaS = require('core-module/baas')
const utils = require('core-module/utils')

const API = BaaS._config.API

/**
 * 上报模板消息所需 formID
 * @function
 * @memberof BaaS
 * @param {string} formID formID
 * @return {Promise<BaaS.Response<any>>}
 */
const wxReportTicket = (formID) => {
  let paramsObj = utils.makeReportTicketParam(formID)

  return BaaS._baasRequest({
    url: API.WECHAT.TEMPLATE_MESSAGE,
    method: 'POST',
    data: paramsObj,
  })
}

module.exports = utils.ticketReportThrottle(wxReportTicket)
