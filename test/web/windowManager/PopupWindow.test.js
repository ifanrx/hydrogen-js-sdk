const moduleAlias = require('module-alias')
moduleAlias.addAlias('core-module', __dirname + '../../../../core')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const proxyquire = require('proxyquire')
const rewire = require('rewire')
chai.use(sinonChai)
let expect = chai.expect
global.URL = require('url').URL

describe('PopupWindow', () => {
  const url = 'http://localhost:3000/index.html'
  const html = '<!DOCTYPE html><html><head></head><body></body></html>'
  const onClose = sinon.spy()
  const options = {
    authPageUrl: 'http://localhost:8000/',
    provider: 'test-wechat',
    windowFeatures: 'top=100,left=100',
    handler: 'login',
    onClose,
  }
  const PopupWindow = rewire('../../../sdk-file/src/web/windowManager/PopupWindow')
  const clearTimeoutSpy = sinon.spy()
  const originUrl = 'http://test.com/index.html'
  const authPageUrl = 'http://test.html?a=10&b=20'
  const newWindowMock = {
    location: {
      href: originUrl,
    },
    close: sinon.spy(),
    closed: false,
  }
  const windowMock = {
    location: {
      href: originUrl,
    },
    open: sinon.stub().returns(newWindowMock)
  }
  const composeUrlStub = sinon.stub().returns(authPageUrl)
  PopupWindow.__set__({
    window: windowMock,
    clearTimeout: clearTimeoutSpy,
    composeUrl: composeUrlStub,
  })
  const popupWindow = new PopupWindow(options)
  popupWindow.open()

  it('should invoke window.open', () => {
    expect(windowMock.open.getCall(0).args[0]).to.be.equal(authPageUrl)
    expect(windowMock.open.getCall(0).args[2]).to.be.equal(options.windowFeatures)
  })

  it('should invoke onClose callback', () => {
    newWindowMock.closed = true  // mock window.close()
    return new Promise(resolve => {
      setTimeout(resolve, 600)
    }).then(() => {
      expect(onClose).to.have.been.calledOnce
    })
  })

  it('close', () => {
    popupWindow.timer = 100
    popupWindow.close()
    expect(clearTimeoutSpy).to.have.been.calledBefore(newWindowMock.close)
  })
})
