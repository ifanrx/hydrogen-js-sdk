class WebSocket {
  constructor(url) {
    my.connectSocket({
      url,
    })
    my.onSocketOpen(() => {
      this.onopen()
    })
    my.onSocketMessage((res) => {
      this.onmessage({data: res.data})
    })
    my.onSocketClose((res) => {
      this.onclose({
        code: res.code,
        reason: res.reason,
      })
    })
  }
  send(payload) {
    my.sendSocketMessage({data: payload})
  }
  close() {
    my.closeSocket()
  }
  onopen() {}
  onclose() {}
  onmessage() {}
}

module.exports = WebSocket
