const utils = require('core-module/utils')
const constants = require('core-module/constants')

/**
 * 上报模板消息所需 formID
 * @function
 * @name reportTicket
 * @since v2.9.0
 * @memberof BaaS
 * @param {string} formID formID
 * @return {Promise<any>}
 */
const createReportTicket = BaaS => (formID) => {
  const API = BaaS._config.API
  let paramsObj = utils.makeReportTicketParam(formID)
  paramsObj.platform = constants.PLATFORM.BAIDU

  return BaaS._baasRequest({
    url: API.BAIDU.TEMPLATE_MESSAGE,
    method: 'POST',
    data: paramsObj,
  })
}

module.exports = function (BaaS) {
  BaaS.reportTicket = utils.ticketReportThrottle(createReportTicket(BaaS))
}
