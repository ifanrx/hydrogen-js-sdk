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

describe('RedirectWindow', () => {
  const originUrl = 'http://localhost:3000/index.html'
  const authPageUrl = 'http://localhost:3000/auth.html?a=10&b=20'
  const windowMock = {
    location: {
      href: originUrl,
    }
  }
  const options = {
    foo: 'bar',
    bar: 'baz',
  }
  const composeUrlStub = sinon.stub().returns(authPageUrl)
  const RedirectWindow = rewire('../../../sdk-file/src/web/windowManager/RedirectWindow')
  RedirectWindow.__set__('window', windowMock)
  RedirectWindow.__set__('composeUrl', composeUrlStub)
  const redirectWindow = new RedirectWindow(options)
  redirectWindow.open()

  it('should invoke "composeUrl"', () => {
    expect(composeUrlStub).to.have.been.calledOnce
    expect(composeUrlStub).to.have.been.calledWith(options)
  })
  
  it('should change url', () => {
    expect(windowMock.location.href).to.be.equal(authPageUrl)
  })
})
