const util = require('./util')

class JSONSerializer {
  constructor(replacer, reviver) {
    this.replacer = replacer
    this.reviver = reviver
    this.SERIALIZER_ID = 'json'
    this.BINARY = false
  }
  serialize(obj) {
    try {
      let payload = JSON.stringify(obj, this.replacer)
      return payload
    } catch (e) {
      util.warn('JSON encoding error', e)
      throw e
    }
  }
  unserialize(payload) {
    try {
      let obj = JSON.parse(payload, this.reviver)
      return obj
    } catch (e) {
      util.warn('JSON decoding error', e)
      throw e
    }
  }
}

module.exports = {
  JSONSerializer,
}
