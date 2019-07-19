const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const rewire = require('rewire')
const jsdom = require('jsdom')
const utils = require('../utils')
const JSDOM = jsdom.JSDOM
chai.use(sinonChai)
let expect = chai.expect

describe('# getWeixinJSBridge', () => {
  it('should reject', () => {
    let dom = new JSDOM()
    let utilsModule = rewire('../../sdk-file/src/web/utils.js')
    return utils.assertWithRewireMocks(utilsModule, {
      document: dom.window.document,
    })(() => {
      const getWeixinJSBridge = utilsModule.__get__('getWeixinJSBridge')
      let successSpy = sinon.spy()
      let failSpy = sinon.spy()
      return getWeixinJSBridge(1)
        .then(successSpy)
        .catch(failSpy)
        .then(() => {
          expect(successSpy).to.have.not.been.called
          expect(failSpy).to.have.been.calledOnce
        })
    })
  })

  it('should return WeixinJSBridge immediately', () => {
    let dom = new JSDOM()
    let WeixinJSBridge_001 = 'fake-WeixinJSBridge-001'
    let WeixinJSBridge_002 = 'fake-WeixinJSBridge-002'
    let event = dom.window.document.createEvent('Event')
    event.initEvent('WeixinJSBridgeReady', true, true)
    let utilsModule = rewire('../../sdk-file/src/web/utils.js')
    return utils.assertWithRewireMocks(utilsModule, {
      document: dom.window.document,
      WeixinJSBridge: WeixinJSBridge_002,
    })(() => {
      const getWeixinJSBridge = utilsModule.__get__('getWeixinJSBridge')
      setTimeout(() => {
        utilsModule.__set__({
          WeixinJSBridge: WeixinJSBridge_001,
        })
        dom.window.document.dispatchEvent(event)
      }, 300)
      return getWeixinJSBridge(320)
        .then(result => {
          expect(result).to.be.equal(WeixinJSBridge_002)
        })
    })
  })

  it('should return WeixinJSBridge after "WeixinJSBridgeReady"', () => {
    let dom = new JSDOM()
    let WeixinJSBridge_001 = 'fake-WeixinJSBridge-001'
    let WeixinJSBridge_002 = 'fake-WeixinJSBridge-002'
    let event = dom.window.document.createEvent('Event')
    event.initEvent('WeixinJSBridgeReady', true, true)
    let utilsModule = rewire('../../sdk-file/src/web/utils.js')
    return utils.assertWithRewireMocks(utilsModule, {
      document: dom.window.document,
    })(() => {
      const getWeixinJSBridge = utilsModule.__get__('getWeixinJSBridge')
      setTimeout(() => {
        utilsModule.__set__({
          WeixinJSBridge: WeixinJSBridge_001,
        })
        dom.window.document.dispatchEvent(event)
      }, 300)
      return getWeixinJSBridge(320)
        .then(result => {
          expect(result).to.be.equal(WeixinJSBridge_001)
        })
    })
  })
})
