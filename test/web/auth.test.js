const moduleAlias = require('module-alias')
moduleAlias.addAlias('core-module', __dirname + '../../../core')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const rewire = require('rewire')
const HError = require('core-module/HError')
const utils = require('../utils')
chai.use(sinonChai)
let expect = chai.expect
global.URL = require('url').URL
global.URLSearchParams = require('url').URLSearchParams

const createBaaSMockObj = ({requestStub, getCurrentUserStub} = {}) => ({
  request: requestStub,
  _polyfill: {
    handleLoginSuccess: sinon.spy(),
  },
  _config: {
    API: {
      WEB: {
        THIRD_PARTY_LOGIN: '/foo/:provider/bar/baz/login/',
        THIRD_PARTY_ASSOCIATE: '/foo/:provider/bar/baz/associate/',
        THIRD_PARTY_AUTH: '/foo/:provider/bar/baz/redirect/',
      },
    },
  },
  auth: {
    getCurrentUser: getCurrentUserStub,
  }
})

describe('auth', () => {
  describe('# getHandler', () => {
    let authModule = rewire('../../sdk-file/src/web/auth.js')
    const getHandler = authModule.__get__('getHandler')
    it('should return handler', () => {
      expect(getHandler('login')).to.be.equal('login')
      expect(getHandler('associate')).to.be.equal('associate')
    })
    it('should return default handler', () => {
      expect(getHandler('login-foo')).to.be.equal('login')
      expect(getHandler('associate-bar')).to.be.equal('login')
      expect(getHandler()).to.be.equal('login')
      expect(getHandler(undefined)).to.be.equal('login')
      expect(getHandler(null)).to.be.equal('login')
      expect(getHandler({})).to.be.equal('login')
    })
  })

  describe('# getErrorMsg', () => {
    let authModule = rewire('../../sdk-file/src/web/auth.js')
    const getErrorMsg = authModule.__get__('getErrorMsg')
    it('should return correct message', () => {
      let err
      expect(getErrorMsg(err)).to.be.equal('')
      err = {data: 'test-error'}
      expect(getErrorMsg(err)).to.be.equal(err.data)
      err = {data: '', statusText: 'test-error'}
      expect(getErrorMsg(err)).to.be.equal(err.statusText)
      err = {data: {error_msg: 'test-error'}}
      expect(getErrorMsg(err)).to.be.equal(err.data.error_msg)
      err = {data: {error_message: 'test-error'}}
      expect(getErrorMsg(err)).to.be.equal(err.data.error_message)
      err = new Error('test-error')
      expect(getErrorMsg(err)).to.be.equal(err.message)
      err = {
        data: {
          error_message: 'data-error-message',  // 后端框架返回
          error_msg: 'data-error-msg',  // 后端返回
        },
        statusText: 'staus-text-error',
      }
      expect(getErrorMsg(err)).to.be.equal(err.data.error_msg)
    })
  })

  describe('# loginWithThirdPartyRequest', () => {
    let authModule = rewire('../../sdk-file/src/web/auth.js')
    const loginWithThirdPartyRequest = authModule.__get__('loginWithThirdPartyRequest')
    const result = {
      status: 200,
      data: {
        foo: 'bar',
      },
    }

    const BaaSMock = createBaaSMockObj({
      requestStub: sinon.stub().resolves(result),
    })

    it('should call request with correct params', () => {
      return loginWithThirdPartyRequest(BaaSMock, {
        provider: 'provider-test',
        token: 'token-test',
        create_user: '',
        update_userprofile: '',
      }).then(() => {
        expect(BaaSMock.request).to.have.been.calledOnce
        expect(BaaSMock.request).to.have.been.calledWith({
          url: '/foo/provider-test/bar/baz/login/',
          method: 'POST',
          data: {
            auth_token: 'token-test',
            create_user: false,
            update_userprofile: 'setnx',
          },
        })
        expect(BaaSMock._polyfill.handleLoginSuccess).to.have.been.calledOnce
        expect(BaaSMock._polyfill.handleLoginSuccess).to.have.been.calledWith(result)
      })
    })
  })

  describe('# linkThirdPartyRequest', () => {
    let authModule = rewire('../../sdk-file/src/web/auth.js')
    const linkThirdPartyRequest = authModule.__get__('linkThirdPartyRequest')
    const result = {
      status: 200,
      data: {
        foo: 'bar',
      },
    }

    const BaaSMock = createBaaSMockObj({
      requestStub: sinon.stub().resolves(result),
    })

    it('should call request with correct params', () => {
      return linkThirdPartyRequest(BaaSMock, {
        provider: 'provider-test',
        token: 'token-test',
        create_user: '',
        update_userprofile: '',
      }).then(() => {
        expect(BaaSMock.request).to.have.been.calledOnce
        expect(BaaSMock.request).to.have.been.calledWith({
          url: '/foo/provider-test/bar/baz/associate/',
          method: 'POST',
          data: {
            auth_token: 'token-test',
            update_userprofile: 'setnx'
          },
        })
        expect(BaaSMock._polyfill.handleLoginSuccess).to.have.not.been.called
      })
    })
  })

  describe('# sendMessage', () => {
    let authModule = rewire('../../sdk-file/src/web/auth.js')
    const sendMessage = authModule.__get__('sendMessage')
    const parentWindow = {
      postMessage: sinon.spy(),
    }
    const openerWindow = {
      postMessage: sinon.spy(),
    }
    const windowMock = {
      location: {
        href: 'mock-href',
      },
      parent: parentWindow,
      opener: openerWindow,
    }
    it('should send message to parent', () => {
      return utils.assertWithRewireMocks(authModule, {
        window: windowMock,
      })(() => {
        let result = {foo: 'bar'}
        sendMessage('popup-window', 'test-referer', result)
        expect(openerWindow.postMessage).to.have.been.calledOnce
        expect(openerWindow.postMessage).to.have.been.calledWith(result, 'test-referer')
        sendMessage('popup-iframe', 'test-referer-1', result)
        expect(parentWindow.postMessage).to.have.been.calledOnce
        expect(parentWindow.postMessage).to.have.been.calledWith(result, 'test-referer-1')
        sendMessage('redirect', 'http://test.com/index.html', result)
        expect(windowMock.location.href = 'http://test.com/index.html?auth-result=' + encodeURIComponent(JSON.stringify(result)))
      })
    })
  })

  describe('# getRedirectResult', () => {
    let authModule = rewire('../../sdk-file/src/web/auth.js')

    it('should throw err', () => {
      const windowMock = {
        location: {
          href: 'http://test.com/index.html?bar=foo',
        },
      }
      return utils.assertWithRewireMocks(authModule, {
        window: windowMock,
      })(() => {
        const createGetRedirectResultFn = authModule.__get__('createGetRedirectResultFn')
        const BaaSMock = createBaaSMockObj()
        const getRedirectResult = createGetRedirectResultFn(BaaSMock)
        return getRedirectResult().catch(err => {
          expect(err).to.be.deep.equal(new HError(613, 'auth result not found'))
        })
      })
    })

    it('should return result with user info', () => {
      const user = {
        name: 'fake-user',
        id: 'fake-user-id',
      }
      const result = {
        status: 'success',
        handler: 'login',
      }
      const baseUrl = 'http://test.com/index.html?a=foo&b=bar'
      const windowMock = {
        location: {
          href: baseUrl + '&auth-result=' + encodeURIComponent(JSON.stringify(result)),
        },
      }
      const historyMock = {
        replaceState: sinon.spy()
      }
      return utils.assertWithRewireMocks(authModule, {
        window: windowMock,
        history: historyMock,
      })(() => {
        const createGetRedirectResultFn = authModule.__get__('createGetRedirectResultFn')
        const BaaSMock = createBaaSMockObj({
          getCurrentUserStub: sinon.stub().resolves(user),
        })
        const getRedirectResult = createGetRedirectResultFn(BaaSMock)
        return getRedirectResult().then(res => {
          expect(res).to.be.deep.equal({
            ...result,
            user,
          })
          expect(historyMock.replaceState).have.been.calledOnce
          expect(historyMock.replaceState).have.been.calledWith(null, '', baseUrl)
        })
      })
    })

    it('should return result without user info', () => {
      const result = {
        status: 'success',
        handler: 'associate',
      }
      const baseUrl = 'http://test.com/index.html?a=foo&b=bar'
      const windowMock = {
        location: {
          href: baseUrl + '&auth-result=' + encodeURIComponent(JSON.stringify(result)),
        },
      }
      const historyMock = {
        replaceState: sinon.spy()
      }
      return utils.assertWithRewireMocks(authModule, {
        window: windowMock,
        history: historyMock,
      })(() => {
        const createGetRedirectResultFn = authModule.__get__('createGetRedirectResultFn')
        const BaaSMock = createBaaSMockObj()
        const getRedirectResult = createGetRedirectResultFn(BaaSMock)
        return getRedirectResult().then(res => {
          expect(res).to.be.deep.equal(result)
          expect(historyMock.replaceState).have.been.calledOnce
          expect(historyMock.replaceState).have.been.calledWith(null, '', baseUrl)
        })
      })
    })
  })

  describe('# thirdPartyAuth', () => {
    let authModule = rewire('../../sdk-file/src/web/auth.js')

    it('should redirect to auth page', () => {
      const windowMock = {
        location: {
          search: '?provider=provider-mock',
        },
      }
      const BaaSMock = createBaaSMockObj({
        requestStub: sinon.stub().resolves({
          status: 200,
          data: {
            status: 'ok',
            redirect_url: 'auth-page-url',
          },
        })
      })
      return utils.assertWithRewireMocks(authModule, {
        window: windowMock,
      })(() => {
        const createThirdPartyAuthFn = authModule.__get__('createThirdPartyAuthFn')
        const thirdPartyAuth = createThirdPartyAuthFn(BaaSMock)
        return thirdPartyAuth().then(() => {
          expect(windowMock.location.href === 'auth-page-url')
          expect(BaaSMock.request).have.been.calledOnce
          expect(BaaSMock.request).have.been.calledWith({
            url: '/foo/provider-mock/bar/baz/redirect/',
            method: 'GET',
          })
        })
      })
    })

    it('should request login and send message', () => {
      const windowMock = {
        location: {
          search: '?provider=provider-mock&token=token-mock&referer=referer-mock&mode=popup-window&handler=login&create_user&update_userprofile=false',
        },
      }
      const BaaSMock = createBaaSMockObj({
        requestStub: sinon.stub().resolves({
          status: 200,
          data: {
            status: 'ok',
            redirect_url: 'auth-page-url',
          },
        })
      })
      const loginWithThirdPartyRequestStub = sinon.stub().resolves()
      const sendMessageSpy = sinon.spy()
      return utils.assertWithRewireMocks(authModule, {
        window: windowMock,
        loginWithThirdPartyRequest: loginWithThirdPartyRequestStub,
        sendMessage: sendMessageSpy,
      })(() => {
          const createThirdPartyAuthFn = authModule.__get__('createThirdPartyAuthFn')
          const thirdPartyAuth = createThirdPartyAuthFn(BaaSMock)
          return thirdPartyAuth().then(() => {
            expect(loginWithThirdPartyRequestStub).have.been.calledWith(BaaSMock, {
              provider: 'provider-mock',
              token: 'token-mock',
              create_user: '',
              update_userprofile: 'false',
            })
            expect(sendMessageSpy).have.been.calledWith('popup-window', 'referer-mock', {
              status: 'success',
              handler: 'login',
            })
          })
      })
    })

    it('should request associate and send message', () => {
      const windowMock = {
        location: {
          search: '?provider=provider-mock&token=token-mock&referer=referer-mock&mode=popup-window&handler=associate&create_user&update_userprofile=false',
        },
      }
      const BaaSMock = createBaaSMockObj({
        requestStub: sinon.stub().resolves({
          status: 200,
          data: {
            status: 'ok',
            redirect_url: 'auth-page-url',
          },
        })
      })
      const linkThirdPartyRequestStub = sinon.stub().resolves()
      const sendMessageSpy = sinon.spy()
      return utils.assertWithRewireMocks(authModule, {
        window: windowMock,
        linkThirdPartyRequest: linkThirdPartyRequestStub,
        sendMessage: sendMessageSpy,
      })(() => {
        const createThirdPartyAuthFn = authModule.__get__('createThirdPartyAuthFn')
        const thirdPartyAuth = createThirdPartyAuthFn(BaaSMock)
        return thirdPartyAuth().then(() => {
          expect(linkThirdPartyRequestStub).have.been.calledWith(BaaSMock, {
            provider: 'provider-mock',
            token: 'token-mock',
            create_user: '',
            update_userprofile: 'false',
          })
          expect(sendMessageSpy).have.been.calledWith('popup-window', 'referer-mock', {
            status: 'success',
            handler: 'associate',
          })
        })
      })
    })
  })
})
