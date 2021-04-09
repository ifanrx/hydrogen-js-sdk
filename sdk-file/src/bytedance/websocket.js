let socketTask
class WebSocket {
  constructor(url, protocols) {
    socketTask = tt.connectSocket({
      url,
      protocols,
    })
    socketTask.onOpen(() => {
      this.onopen()
    })
    socketTask.onMessage(res => {
      this.onmessage({data: res.data})
    })
    socketTask.onClose(res => {
      this.onclose({
        code: res.code,
        reason: res.reason,
      })
    })
  }
  send(payload) {
    socketTask.send({data: payload})
  }
  close(code, reason) {
    socketTask.close({code, reason})
  }
  onopen() {}
  onclose() {}
  onmessage() {}
}

module.exports = WebSocket
