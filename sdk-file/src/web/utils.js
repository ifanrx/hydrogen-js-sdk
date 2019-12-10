function getWeixinJSBridge(timeout = 10 * 1000) {
  return new Promise((resolve, reject) => {
    // 超时可能是由于开发者在非公众号环境使用 JSAPI 支付
    let timerId = setTimeout(() => reject(), timeout)
    function onBridgeReady(){
      clearTimeout(timerId)
      resolve(WeixinJSBridge) // eslint-disable-line no-undef
    }
    if (typeof WeixinJSBridge == 'undefined'){
      if(document.addEventListener){
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
      } else if (document.attachEvent){
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
      }
    } else {
      onBridgeReady()
    }
  })
}

module.exports = {
  getWeixinJSBridge,
}
