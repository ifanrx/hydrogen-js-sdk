const moduleAlias = require('module-alias')
moduleAlias.addAlias('core-module', __dirname + '../../../core')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const rewire = require('rewire')
const jsdom = require('jsdom')
const JSDOM = jsdom.JSDOM
chai.use(sinonChai)
let expect = chai.expect

const BaaS = {
  request: sinon.stub().resolves({
    status: 200,
    data: {
      status: 'ok',
      redirect_url: 'http://www.test.com'
    }
  }),
  _polyfill: require('core-module/polyfill'),
  _config: require('core-module/config'),
}

describe('thirdPartyAuth', () => {
  it('should call "redirect" api', () => {
    const provider = 'test-weibo'
    const url = `http://localhost:3000/auth.html?provider=${provider}&referer=${encodeURIComponent('http://localhost:3000')}&iframe=false`
    const html = '<!DOCTYPE html><html><head></head><body></body></html>'
    const dom = new JSDOM(html, {
      url,
    })
    var auth = rewire('../../sdk-file/src/web/auth')
    let token = 'mock-token'
    require('../../sdk-file/src/web/polyfill')(BaaS)
    auth.__set__({
      BaaS,
      window: dom.window,
      URLSearchParams: require('url').URLSearchParams,
    })
    const thirdPartyAuth = auth.__get__('createThirdPartyAuthFn')(BaaS)

    return thirdPartyAuth().then(() => {
      expect(BaaS.request.getCall(0).args[0]).to.be.deep.equal({
        url: `/hserve/v2.0/idp/oauth/${provider}/redirect/`,
        method: 'GET',
      })
    })
  })

  it('should send "token" to parent window', () => {
    const provider = 'test-weibo'
    const token = 'mock-token'
    const url = `http://localhost:3000/auth.html?provider=${provider}&referer=${encodeURIComponent('http://localhost:3000')}&iframe=false&token=${token}`
    const html = '<!DOCTYPE html><html><head></head><body></body></html>'
    const dom = new JSDOM(html, {
      url,
    })
    const parentDom = new JSDOM()
    dom.window.opener = parentDom.window
    const postMessageSpy = sinon.spy(parentDom.window, 'postMessage')
    var auth = rewire('../../sdk-file/src/web/auth')
    require('../../sdk-file/src/web/polyfill')(BaaS)
    auth.__set__({
      BaaS,
      window: dom.window,
      URLSearchParams: require('url').URLSearchParams,
    })
    const thirdPartyAuth = auth.__get__('createThirdPartyAuthFn')(BaaS)

    return thirdPartyAuth().then(() => {
      expect(postMessageSpy).have.been.calledOnce
      expect(postMessageSpy).have.been.calledWith({
        status: 'access_allowed',
        token,
      })
    })
  })

  it('should send error message to parent window', () => {
    const provider = 'test-weibo'
    const token = 'mock-token'
    const url = `http://localhost:3000/auth.html?provider=${provider}&referer=${encodeURIComponent('http://localhost:3000')}&iframe=false`
    const html = '<!DOCTYPE html><html><head></head><body></body></html>'
    const dom = new JSDOM(html, {
      url,
    })
    const parentDom = new JSDOM()
    dom.window.opener = parentDom.window
    const postMessageSpy = sinon.spy(parentDom.window, 'postMessage')
    var auth = rewire('../../sdk-file/src/web/auth')
    require('../../sdk-file/src/web/polyfill')(BaaS)
    auth.__set__({
      BaaS,
      window: dom.window,
      URLSearchParams: require('url').URLSearchParams,
    })
    const thirdPartyAuth = auth.__get__('createThirdPartyAuthFn')(BaaS)
    const error = new Error('test-error')
    BaaS.request.rejects(error)

    return thirdPartyAuth().catch(err => {
      expect(err).to.be.deep.equal(error)
      expect(postMessageSpy).have.been.calledOnce
      expect(postMessageSpy).have.been.calledWith({
        status: 'fail',
        error: error.message,
      })
    })
  })
})
