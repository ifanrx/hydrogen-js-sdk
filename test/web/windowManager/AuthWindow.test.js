const moduleAlias = require('module-alias')
moduleAlias.addAlias('core-module', __dirname + '../../../../core')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const proxyquire = require('proxyquire')
const rewire = require('rewire')
const jsdom = require('jsdom')
const JSDOM = jsdom.JSDOM
chai.use(sinonChai)
let expect = chai.expect

describe('AuthWindow', () => {
  const url = 'http://localhost:3000/index.html'
  const html = '<!DOCTYPE html><html><head></head><body></body></html>'
  const dom = new JSDOM(html, {
    url,
  })
  const newDom = new JSDOM()
  const onClose = sinon.spy()
  const options = {
    authPageUrl: 'http://localhost:8000/',
    provider: 'test-wechat',
    windowFeatures: 'top=100,left=100',
    onClose,
  }
  const AuthWindow = rewire('../../../sdk-file/src/web/windowManager/AuthWindow')
  const clearTimeoutSpy = sinon.spy()
  AuthWindow.__set__({
    window: dom.window,
    clearTimeout: clearTimeoutSpy,
  })
  const authWindow = new AuthWindow(options)
  const openStub = sinon.stub(dom.window, 'open').returns(newDom.window)
  authWindow.open()

  it('should invoke window.open', () => {
    expect(openStub.getCall(0).args[0]).to.be.equal(`${options.authPageUrl}?` + 
      `provider=${encodeURIComponent(options.provider)}&` +
      `referer=${encodeURIComponent(dom.window.location.href)}&` +
      `iframe=false`
    )
    expect(openStub.getCall(0).args[2]).to.be.equal(options.windowFeatures)
  })

  it('should invoke onClose callback', () => {
    newDom.window.closed = true  // mock window.close()
    return new Promise(resolve => {
      setTimeout(resolve, 600)
    }).then(() => {
      expect(onClose).to.have.been.calledOnce
    })
  })

  it('close', () => {
    authWindow.timer = 100
    const closeSpy = sinon.spy(newDom.window, 'close')
    authWindow.close()
    expect(clearTimeoutSpy).to.have.been.calledBefore(closeSpy)
  })
})
