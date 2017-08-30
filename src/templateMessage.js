const baasRequest = require('./baasRequest').baasRequest
const constants = require('./constants')
const BaaS = require('./baas')
const Promise = require('./promise')

const API = BaaS._config.API

function makeParams(formID) {
  if (!formID) {
    throw new Error(constants.MSG.ARGS_ERROR)
  }

  var paramsObj = {}
  paramsObj['submission_type'] = 'form_id'
  paramsObj['submission_value'] = formID

  return paramsObj
}

const wxReportTicket = (formID) => {
  var paramsObj = makeParams(formID)

  return baasRequest({
    url: API.TEMPLATE_MESSAGE,
    method: 'POST',
    data: paramsObj,
  }).then((res) => {
    return new Promise((resolve, reject) => {
      return resolve(res)
    }, (err) => {
      return reject(err)
    })
  }, (err) => {
    throw new Error(err)
  })
}

module.exports = {
  makeParams,
  wxReportTicket
}