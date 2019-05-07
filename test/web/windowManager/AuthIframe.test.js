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

describe('AuthIframe', () => {
  const url = 'http://localhost:3000/index.html'
  const html = '<!DOCTYPE html><html><head></head><body><div>test</div></body></html>'
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
  const AuthIframe = rewire('../../../sdk-file/src/web/windowManager/AuthIframe')
  const clearTimeoutSpy = sinon.spy()
  AuthIframe.__set__({
    window: dom.window,
    document: dom.window.document,
  })
  const authIframe = new AuthIframe(options)
  const openStub = sinon.stub(dom.window, 'open').returns(newDom.window)
  const {container, iframe, closeBtn} = rewire('../../../sdk-file/src/web/windowManager/getAuthModalElement')()
  const addEventListenerSpy = sinon.spy(closeBtn, 'addEventListener')
  const removeEventListenerSpy = sinon.spy(closeBtn, 'removeEventListener')

  it('should show modal', () => {
    expect(container.style.display).to.be.equal('none')
    authIframe.open()
    expect(iframe.src).to.be.equal(`${options.authPageUrl}?` + 
      `provider=${encodeURIComponent(options.provider)}&` +
      `referer=${encodeURIComponent(dom.window.location.href)}&` +
      `iframe=true`
    )
    expect(container.style.display).to.be.equal('block')
    expect(addEventListenerSpy).to.have.been.calledOnce
  })

  it('should hide modal', () => {
    authIframe.close()
    expect(iframe.src).to.be.equal('')
    expect(container.style.display).to.be.equal('none')
    expect(removeEventListenerSpy).to.have.been.calledOnce
    expect(addEventListenerSpy.getCall(0).args).to.be.deep.equal(removeEventListenerSpy.getCall(0).args)
  })
})
