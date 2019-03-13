const createGetMiniappQRCode = BaaS => ({urlParam, queryParam, describe}) => {
  const API = BaaS._config.API
  return BaaS._baasRequest({
    url: API.ALIPAY.MINIAPP_QR_CODE,
    method: 'POST',
    data: {
      url_param: urlParam,
      query_param: queryParam,
      describe,
    },
  }).then(res => {
    return res.data
  })
}

module.exports = function (BaaS) {
  BaaS.getMiniappQRCode = createGetMiniappQRCode(BaaS)
}
