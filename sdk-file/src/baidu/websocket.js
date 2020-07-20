let SocketTask
class WebSocket {
  constructor(url, protocols) {
    SocketTask = swan.connectSocket({
      url,
      protocols,
    })
    swan.onSocketOpen(() => {
      this.onopen()
    })
    swan.onSocketMessage((res) => {
      this.onmessage({data: res.data})
    })
    swan.onSocketClose((res) => {
      this.onclose({
        code: res.code,
        reason: res.reason,
      })
    })
  }
  send(payload) {
    SocketTask.send({data: payload})
  }
  close(code, reason) {
    SocketTask.close({code, reason})
  }
  onopen() {}
  onclose() {}
  onmessage() {}
}

module.exports = WebSocket
