class WebSocket {
  constructor (url, protocols) {
    my.connectSocket({
      url,
      header: {
        'sec-webSocket-protocol': protocols[0],
      },
    })
    my.onSocketOpen(() => {
      this.onopen()
    })
    my.onSocketMessage((res) => {
      this.onmessage({data: res.data})
    })
    my.onSocketClose((res) => {
      if (res) {
        this.onclose({
          code: res.code,
          reason: res.reason,
        })
      }
    })
  }
  send (payload) {
    my.sendSocketMessage({data: payload})
  }
  close () {
    my.closeSocket()
  }
  onopen () {}
  onclose () {}
  onmessage () {}
}

module.exports = WebSocket
