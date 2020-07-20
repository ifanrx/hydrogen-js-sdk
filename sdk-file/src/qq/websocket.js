class WebSocket {
  constructor(url, protocols) {
    qq.connectSocket({
      url,
      protocols,
    })
    qq.onSocketOpen(() => {
      this.onopen()
    })
    qq.onSocketMessage((res) => {
      this.onmessage({data: res.data})
    })
    qq.onSocketClose((res) => {
      this.onclose({
        code: res.code,
        reason: res.reason,
      })
    })
  }
  send(payload) {
    qq.sendSocketMessage({data: payload})
  }
  close(code, reason) {
    qq.closeSocket({code, reason})
  }
  onopen() {}
  onclose() {}
  onmessage() {}
}

module.exports = WebSocket
