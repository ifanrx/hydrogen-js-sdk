module.exports = BaaS => {
  // BaaS 网络请求，此方法能保证在已登录 BaaS 后再发起请求
  BaaS._baasRequest = function () {
    return BaaS.auth.silentLogin().then(() => {
      return BaaS.request.apply(null, arguments)
    })
  }
}