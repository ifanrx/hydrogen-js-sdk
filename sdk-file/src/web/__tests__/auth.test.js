const HError = require('core-module/HError')
const auth = require('../auth.js')

const createBaaSMockObj = ({requestStub, getCurrentUserStub} = {}) => ({
  request: requestStub,
  _polyfill: {
    handleLoginSuccess: jest.fn(),
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
    const getHandler = auth._getHandler

    test('should return handler', () => {
      expect(getHandler('login')).toBe('login')
      expect(getHandler('associate')).toBe('associate')
    })

    test('should throw error', () => {
      expect(() => getHandler('login-a')).toThrow()
      expect(() => getHandler('associate-a')).toThrow()
      expect(() => getHandler()).toThrow()
      expect(() => getHandler(undefined)).toThrow()
      expect(() => getHandler(null)).toThrow()
      expect(() => getHandler({})).toThrow()
    })
  })

  describe('# getErrorMsg', () => {
    const getErrorMsg = auth._getErrorMsg
    test('should return correct message', () => {
      let err
      expect(getErrorMsg(err)).toBe('')
      err = {data: 'test-error'}
      expect(getErrorMsg(err)).toBe(err.data)
      err = {data: '', statusText: 'test-error'}
      expect(getErrorMsg(err)).toBe(err.statusText)
      err = {data: {error_msg: 'test-error'}}
      expect(getErrorMsg(err)).toBe(err.data.error_msg)
      err = {data: {error_message: 'test-error'}}
      expect(getErrorMsg(err)).toBe(err.data.error_message)
      err = new Error('test-error')
      expect(getErrorMsg(err)).toBe(err.message)
      err = {
        data: {
          error_message: 'data-error-message',  // 后端框架返回
          error_msg: 'data-error-msg',  // 后端返回
        },
        statusText: 'staus-text-error',
      }
      expect(getErrorMsg(err)).toBe(err.data.error_msg)
    })
  })

  describe('# loginWithThirdPartyRequest', () => {
    const loginWithThirdPartyRequest = auth._loginWithThirdPartyRequest
    const result = {
      status: 200,
      data: {
        foo: 'bar',
      },
    }

    const BaaS = createBaaSMockObj({
      requestStub: jest.fn().mockResolvedValue(result),
    })

    it('should call request with correct params', () => {
      return loginWithThirdPartyRequest(BaaS, {
        provider: 'provider-test',
        token: 'token-test',
        create_user: '',
        update_userprofile: '',
      }).then(() => {
        expect(BaaS.request).toHaveBeenCalledTimes(1)
        expect(BaaS.request).toHaveBeenCalledWith({
          url: '/foo/provider-test/bar/baz/login/',
          method: 'POST',
          data: {
            auth_token: 'token-test',
            create_user: false,
            update_userprofile: 'setnx',
          },
        })
        expect(BaaS._polyfill.handleLoginSuccess).toHaveBeenCalledTimes(1)
        expect(BaaS._polyfill.handleLoginSuccess).toHaveBeenCalledWith(result)
      })
    })
  })

  describe('# linkThirdPartyRequest', () => {
    const linkThirdPartyRequest = auth._linkThirdPartyRequest
    const result = {
      status: 200,
      data: {
        foo: 'bar',
      },
    }

    const BaaS = createBaaSMockObj({
      requestStub: jest.fn().mockResolvedValue(result),
    })

    it('should call request with correct params', () => {
      return linkThirdPartyRequest(BaaS, {
        provider: 'provider-test',
        token: 'token-test',
        create_user: '',
        update_userprofile: '',
      }).then(() => {
        expect(BaaS.request).toHaveBeenCalledTimes(1)
        expect(BaaS.request).toHaveBeenCalledWith({
          url: '/foo/provider-test/bar/baz/associate/',
          method: 'POST',
          data: {
            auth_token: 'token-test',
            update_userprofile: 'setnx'
          },
        })
        expect(BaaS._polyfill.handleLoginSuccess).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('# setExtraUrlParams', () => {
    const setExtraUrlParams = auth._setExtraUrlParams
    it('should set extra params if provider is "oauth-wechat-web" and mode is "popup-iframe"', () => {
      const url = 'http://test.com/index.html'
      let result = setExtraUrlParams(url, {
        provider: 'oauth-wechat-web',
        mode: 'popup-iframe',
        wechatIframeContentStyle: {style: 'bar', href: 'http://foo.com'},
      })
      expect(result).toBe(`${url}?self_redirect=true&style=bar&href=${encodeURIComponent('http://foo.com')}`)

      result = setExtraUrlParams(url, {
        provider: 'others',
        mode: 'popup-iframe',
        wechatIframeContentStyle: {style: 'bar', href: 'http://foo.com'},
      })
      expect(result).toBe(url)

      result = setExtraUrlParams(url, {
        provider: 'oauth-wechat-web',
        mode: 'others',
        wechatIframeContentStyle: {style: 'bar', href: 'http://foo.com'},
      })
      expect(result).toBe(url)

      result = setExtraUrlParams(url, {
        provider: 'oauth-wechat-web',
        mode: 'popup-iframe',
        wechatIframeContentStyle: {foo: 'bar', baz: 'http://foo.com'},
      })
      expect(result).toBe(`${url}?self_redirect=true`)

      result = setExtraUrlParams(url, {
        provider: 'oauth-wechat-web',
        mode: 'popup-iframe',
      })
      expect(result).toBe(`${url}?self_redirect=true`)
    })
  })

  describe('# sendMessage', () => {
    const sendMessage = auth._sendMessage
    const parentWindow = {
      postMessage: jest.fn(),
    }
    const openerWindow = {
      postMessage: jest.fn(),
    }
    delete window.parent
    delete window.opener
    delete window.location
    window.parent = parentWindow
    window.opener = openerWindow
    window.location = {}

    it('should send message to parent', () => {
      let result = {foo: 'bar'}
      sendMessage('popup-window', 'test-referer', result)
      expect(openerWindow.postMessage).toHaveBeenCalledTimes(1)
      expect(openerWindow.postMessage).toHaveBeenCalledWith(result, 'test-referer')
      sendMessage('popup-iframe', 'test-referer-1', result)
      expect(parentWindow.postMessage).toHaveBeenCalledTimes(1)
      expect(parentWindow.postMessage).toHaveBeenCalledWith(result, 'test-referer-1')
      sendMessage('redirect', 'http://test.com/index.html', result)
      expect(window.location.href).toBe('http://test.com/index.html?auth-result='  + encodeURIComponent(JSON.stringify(result)))
    })
  })

  describe('# getRedirectResult', () => {
    it('should throw err', () => {
      delete window.location
      window.location = {
        href: 'http://test.com/index.html?bar=foo',
      }
      const BaaS = createBaaSMockObj()
      auth(BaaS)
      const getRedirectResult = BaaS.auth.getRedirectResult
      return getRedirectResult().catch(err => {
        expect(err).toEqual(new HError(614, 'third party auth result not found'))
      })
    })

    it('should return result with user info', () => {
      const user = {
        name: 'fake-user',
        id: 'fake-user-id',
      }
      const result = {
        status: 'success',
        action: 'login',
      }
      const baseUrl = 'http://test.com/index.html?a=foo&b=bar'
      delete window.location
      delete window.history
      window.location = {
        href: baseUrl + '&auth-result=' + encodeURIComponent(JSON.stringify(result)),
      }
      window.history = {
        replaceState: jest.fn()
      }
      const BaaS = createBaaSMockObj({
        getCurrentUserStub: jest.fn().mockResolvedValue(user),
      })
      auth(BaaS)
      const getRedirectResult = BaaS.auth.getRedirectResult
      return getRedirectResult().then(res => {
        expect(res).toEqual({
          ...result,
          user,
        })
        expect(window.history.replaceState).toHaveBeenCalledTimes(1)
        expect(window.history.replaceState).toHaveBeenCalledWith(null, '', baseUrl)
      })
    })

    it('should return result without user info', () => {
      const result = {
        status: 'success',
        action: 'associate',
      }
      const baseUrl = 'http://test.com/index.html?a=foo&b=bar'
      delete window.location
      delete window.history
      window.location = {
        href: baseUrl + '&auth-result=' + encodeURIComponent(JSON.stringify(result)),
      }
      window.history = {
        replaceState: jest.fn()
      }
      const BaaS = createBaaSMockObj()
      auth(BaaS)
      const getRedirectResult = BaaS.auth.getRedirectResult
      return getRedirectResult().then(res => {
        expect(res).toEqual(result)
        expect(window.history.replaceState).toHaveBeenCalledTimes(1)
        expect(window.history.replaceState).toHaveBeenCalledWith(null, '', baseUrl)
      })
    })
  })

  describe('# thirdPartyAuth', () => {
    it('should redirect to auth page', () => {
      delete window.location
      window.location = {
        href: 'http://test.html/?provider=provider-mock&handler=login',
      }
      const BaaS = createBaaSMockObj({
        requestStub: jest.fn().mockResolvedValue({
          status: 200,
          data: {
            status: 'ok',
            redirect_url: 'http://test.com/?a=10&b=20',
          },
        })
      })
      auth(BaaS)
      const thirdPartyAuth = BaaS.auth.thirdPartyAuth
      return thirdPartyAuth().then(() => {
        expect(window.location.href).toBe('http://test.com/?a=10&b=20')
        expect(BaaS.request).toHaveBeenCalledTimes(1)
        expect(BaaS.request).toHaveBeenCalledWith({
          url: '/foo/provider-mock/bar/baz/redirect/',
          method: 'POST',
          data: {
            callback_url: 'http://test.html/?provider=provider-mock&handler=login',
          }
        })
      })
    })

    it('should redirect to auth page with "selt_redirect" param', () => {
      delete window.location
      window.location = {
        href: 'http://test.html/?provider=oauth-wechat-web&mode=popup-iframe&handler=login',
      }
      const BaaS = createBaaSMockObj({
        requestStub: jest.fn().mockResolvedValue({
          status: 200,
          data: {
            status: 'ok',
            redirect_url: 'http://test.com/?a=10&b=20',
          },
        })
      })
      auth(BaaS)
      const thirdPartyAuth = BaaS.auth.thirdPartyAuth
      return thirdPartyAuth().then(() => {
        expect(window.location.href).toBe('http://test.com/?a=10&b=20&self_redirect=true')
      })
    })

    it('should redirect to auth page without "selt_redirect" param', () => {
      delete window.location
      window.location = {
        href: 'http://test.html/?provider=oauth-wechat-web&mode=popup-window&handler=login',
      }
      const BaaS = createBaaSMockObj({
        requestStub: jest.fn().mockResolvedValue({
          status: 200,
          data: {
            status: 'ok',
            redirect_url: 'http://test.com/?a=10&b=20',
          },
        })
      })
      auth(BaaS)
      const thirdPartyAuth = BaaS.auth.thirdPartyAuth
      return thirdPartyAuth().then(() => {
        expect(window.location.href).toBe('http://test.com/?a=10&b=20')
      })
    })
  })
})
