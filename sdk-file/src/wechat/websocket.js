class WebSocket {
  constructor(url, protocols) {
    wx.connectSocket({
      url,
      protocols,
    })
    wx.onSocketOpen(() => {
      this.onopen()
    })
    wx.onSocketMessage((res) => {
      this.onmessage({data: res.data})
    })
    wx.onSocketClose((res) => {
      this.onclose({
        code: res.code,
        reason: res.reason,
      })
    })
  }
  send(payload) {
    wx.sendSocketMessage({data: payload})
  }
  close(code, reason) {
    wx.closeSocket({code, reason})
  }
  onopen() {}
  onclose() {}
  onmessage() {}
}

module.exports = WebSocket
