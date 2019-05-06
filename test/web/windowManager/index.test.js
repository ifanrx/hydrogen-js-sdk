const moduleAlias = require('module-alias')
moduleAlias.addAlias('core-module', __dirname + '../../../../core')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const proxyquire = require('proxyquire')
const rewire = require('rewire')
const constants = require('core-module/constants')
chai.use(sinonChai)
let expect = chai.expect

describe('windowManager', () => {
  it('should return iframe', () => {
    const modal = {
      type: 'iframe',
    }
    const AuthIframeStub = sinon.stub().returns(modal)
    const windowManager = proxyquire('../../../sdk-file/src/web/windowManager', {
      './AuthIframe': AuthIframeStub,
    })
    const options = {
      foo: 'bar',
      bar: 'baz',
    }
    const result = windowManager.create(constants.AUTH_WINDOW_TYPE.IFRAME, options)
    expect(AuthIframeStub).to.have.been.calledWithNew
    expect(AuthIframeStub).to.have.been.calledWith(options)
    expect(result).to.be.deep.equal(modal)
  })
  
  it('should return window', () => {
    const modal = {
      type: 'window',
    }
    const AuthWindowStub = sinon.stub().returns(modal)
    const windowManager = proxyquire('../../../sdk-file/src/web/windowManager', {
      './AuthWindow': AuthWindowStub,
    })
    const options = {
      foo: 'bar',
      bar: 'baz',
    }
    const result = windowManager.create(constants.AUTH_WINDOW_TYPE.WINDOW, options)
    expect(AuthWindowStub).to.have.been.calledWithNew
    expect(AuthWindowStub).to.have.been.calledWith(options)
    expect(result).to.be.deep.equal(modal)
  })
})
