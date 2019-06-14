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
global.URL = require('url').URL

describe('PopupIframe', () => {
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
    handler: 'login',
    onClose,
  }
  const PopupIframe = rewire('../../../sdk-file/src/web/windowManager/PopupIframe')
  const clearTimeoutSpy = sinon.spy()
  const authPageUrl = 'http://test.html/?a=10&b=20'
  const composeUrlStub = sinon.stub().returns(authPageUrl)
  PopupIframe.__set__({
    window: dom.window,
    document: dom.window.document,
    composeUrl: composeUrlStub,
  })
  const popupIframe = new PopupIframe(options)
  const openStub = sinon.stub(dom.window, 'open').returns(newDom.window)
  const {container, iframe, closeBtn} = rewire('../../../sdk-file/src/web/windowManager/getAuthModalElement')()
  const addEventListenerSpy = sinon.spy(closeBtn, 'addEventListener')
  const removeEventListenerSpy = sinon.spy(closeBtn, 'removeEventListener')

  it('should show modal', () => {
    expect(container.style.display).to.be.equal('none')
    popupIframe.open()
    expect(iframe.src).to.be.equal(authPageUrl)
    expect(container.style.display).to.be.equal('block')
    expect(addEventListenerSpy).to.have.been.calledOnce
  })

  it('should hide modal', () => {
    popupIframe.close()
    expect(iframe.src).to.be.equal('')
    expect(container.style.display).to.be.equal('none')
    expect(removeEventListenerSpy).to.have.been.calledOnce
    expect(addEventListenerSpy.getCall(0).args).to.be.deep.equal(removeEventListenerSpy.getCall(0).args)
  })
})
