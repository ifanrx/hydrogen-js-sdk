const util = require('./util')
const {JSONSerializer} = require('./serializer')

const protocol = 'wamp.2.json'
const serializer = new JSONSerializer()

const transporter = WebSocket => ({url}) => {
  const transport = {}
  transport.protocol = protocol
  transport.serializer = serializer

  transport.onmessage = function () {}
  transport.onopen = function () {}
  transport.onclose = function () {}

  transport.info = {
    type: 'websocket',
    url,
    protocol: null,
  }

  const websocket = new WebSocket(url, [protocol])

  websocket.binaryType = 'arraybuffer'

  websocket.onmessage = function (evt) {
    util.debug('WebSocket#onmessage', evt)
    const msg = transport.serializer.unserialize(evt.data)
    transport.onmessage(msg)
  }

  websocket.onopen = function () {
    util.debug('WebSocket#onopen')
    transport.info.protocol = websocket.protocol
    transport.onopen()
  }

  websocket.onclose = function (evt) {
    util.debug('WebSocket#onclose', evt)
    const details = {
      code: evt.code,
      reason: evt.message,
      wasClean: evt.wasClean,
    }
    transport.onclose(details)
  }

  transport.send = function (msg) {
    let payload = transport.serializer.serialize(msg)
    util.debug('WebSocket#send', payload)
    websocket.send(payload)
  }

  transport.close = function (code, reason) {
    util.debug('WebSocket#close', code, reason)
    websocket.close(code, reason)
  }
  return transport
}

module.exports = {
  transporter,
}
