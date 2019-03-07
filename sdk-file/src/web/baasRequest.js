module.exports = BaaS => {
  // web 端没有 silentLogin，所以 baasRequest 的逻辑与 wechat、alipay 不同，
  // 这里为了接口统一，依然保留 baasRequest 模块
  BaaS._baasRequest = BaaS.request
}
