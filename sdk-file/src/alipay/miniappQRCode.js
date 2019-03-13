const createGetMiniappQRCode = BaaS => ({urlParam, queryParam, describe}) => {
  const API = BaaS._config.API
  return BaaS._baasRequest({
    url: API.ALIPAY.TEMPLATE_MESSAGE,
    method: 'POST',
    data: {
      url_param: urlParam,
      query_param: queryParam,
      describe,
    },
  })
}

module.exports = function (BaaS) {
  BaaS.getMiniappQRCode = createGetMiniappQRCode(BaaS)
}
