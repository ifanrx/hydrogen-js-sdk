const chai = require('chai')
const sinon = require('sinon')
const rewire = require('rewire')
const sinonChai = require('sinon-chai')
const constants = require('../../core/constants')
const config = require('../../core/config')
const utils = require('../../core/utils')
const wechatMock = rewire('./wechat-mock')
chai.use(sinonChai)
let expect = chai.expect

describe('auth', () => {
  let requestStub
  let request
  let authCode = 'mock.auth.code'
  let userId = 'mock.user.id'
  let openId = 'mock.open.id'
  let token = 'mock.token'
  let expiresIn = 2592000
  let weGetUserInfoStub

  beforeEach(() => {
    BaaS.clearSession()
    BaaS._config.updateUserprofile = ''
    request = BaaS.request
    requestStub = sinon.stub(BaaS, 'request').callsFake(options => {
      if (
        options.url === BaaS._config.API.WECHAT.SILENT_LOGIN ||
        options.url === BaaS._config.API.WEB.LOGIN_USERNAME ||
        options.url === BaaS._config.API.WECHAT.USER_ASSOCIATE ||
        options.url === BaaS._config.API.WECHAT.AUTHENTICATE
      ) {
        let status = options.url === BaaS._config.API.WECHAT.USER_ASSOCIATE
          ? 200 : 201
        return Promise.resolve({
          status,
          data: {
            user_id: userId,
            token,
            openid: openId,
            expires_in: expiresIn,
          }
        })
      } else if (
        options.url === utils.format(BaaS._config.API.USER_DETAIL, {
          userID: userId,
        })
      ) {
        return Promise.resolve({
          status: 200,
          data: {
            avatar: '',
            id : 22075549131219,
            is_authorized : false,
            openid: openId,
            _provider : {}
          }
        })
      }
      return request(options)
    })
    weGetUserInfoStub = sinon.stub(BaaS._polyfill, 'wxGetUserInfo').callsFake(({success, fail}) => {
      success({
        rawData: '',
        signature: '',
        encryptedData: '',
        iv: '',
        userInfo: {},
      })
    })
  })

  afterEach(() => {
    requestStub.restore()
    weGetUserInfoStub.restore()
  })

  it('#handleUserInfo param value is undefined', () => {
    expect(() => global.BaaS.auth.handleUserInfo()).to.throw()
  })

  it('#handleUserInfo param value invaliad', () => {
    expect(() => global.BaaS.auth.handleUserInfo({a: 'b'})).to.throw()
  })

  it('should clear session before force login', () => {
    const clearSessionSpy = sinon.spy(BaaS, 'clearSession')
    return BaaS.auth.loginWithWechat({detail: {userInfo: {}}})
      .then(() => {
        expect(clearSessionSpy).to.have.been.calledOnce
        clearSessionSpy.restore()
      })
  })
})
