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
  let wxGetUserInfoStub

  beforeEach(() => {
    BaaS.clearSession()
    BaaS._config.updateUserprofile = ''
    request = BaaS.request
    requestStub = sinon.stub(BaaS, 'request').callsFake(options => {
      if (
        options.url === BaaS._config.API.WECHAT.SILENT_LOGIN ||
        options.url === BaaS._config.API.WECHAT.PHONE_LOGIN
      ) {
        return Promise.resolve({
          status: 201,
          data: {
            token,
            expires_in: expiresIn,
            user_info: {
              id: userId,
              openid: openId,
            }
          }
        })
      } else if (
        options.url === BaaS._config.API.LOGIN_USERNAME ||
        options.url === BaaS._config.API.WECHAT.USER_ASSOCIATE
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
    wxGetUserInfoStub = sinon.stub(BaaS._polyfill, 'wxGetUserInfo').callsFake(({success, fail}) => {
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
    wxGetUserInfoStub.restore()
  })

  it('#handleUserInfo param value is undefined', () => {
    expect(() => global.BaaS.auth.handleUserInfo()).to.throw()
  })

  it('#handleUserInfo param value invaliad', () => {
    expect(() => global.BaaS.auth.handleUserInfo({a: 'b'})).to.throw()
  })

  describe('# loginWithWechat', () => {
    [null /* {detail: {encryptedData: 'fake_example'}} */].forEach(param => {
      it(`should set storage(${param === null ? 'silent' : 'phone number'} login)`, () => {
        const now = Date.now()
        const nowStub = sinon.stub(Date, 'now').returns(now)
        return BaaS.auth.loginWithWechat(param).then(() => {
          expect(BaaS.storage.get(constants.STORAGE_KEY.UID)).to.be.equal(userId)
          expect(BaaS.storage.get(constants.STORAGE_KEY.AUTH_TOKEN)).to.be.equal(token)
          expect(BaaS.storage.get(constants.STORAGE_KEY.IS_ANONYMOUS_USER)).to.be.equal(0)
          expect(BaaS.storage.get(constants.STORAGE_KEY.OPENID)).to.be.equal(openId)
          expect(parseInt(BaaS.storage.get(constants.STORAGE_KEY.EXPIRES_AT))).to.be.equal(Math.floor(now / 1000) + expiresIn - 30)
          nowStub.restore()
        })
      })
    })

    describe('# update_userprofile', () => {
      it('should not be included', () => {
        return BaaS.auth.loginWithWechat(null, {
          syncUserProfile: 'overwrite',
        }).then(() => {
          expect(requestStub.getCall(0).args[0]).to.be.deep.equal({
            url: config.API.WECHAT.SILENT_LOGIN,
            method: 'POST',
            data: {
              code: wechatMock.__get__('code'),
              create_user: true,
              login_with_unionid: false,
            }
          })
        })
      })
    })
  })

  describe('# silentLogin', () => {
    it('should call silentLogin once', () => {
      /**
       * v2.0.8-a 中存在的 bug:
       * 如果调用 silentLogin（直接调用或在 autoLogin 为 ture 的情况下，401 错误后自动调用），
       * 并且同时调用 loginWithWechat，会发出两个 silent_login 的请求，可能会造成后端同时创建两个用户。
       */
      const job1 = BaaS.auth.silentLogin()
      const job2 = BaaS.auth.loginWithWechat()
      return Promise.all([job1, job2]).then(() => {
        expect(requestStub).have.been.calledOnce
        expect(requestStub.getCall(0).args[0].url).to.be.equal(config.API.WECHAT.SILENT_LOGIN)
      })
    })
  })

  describe('# linkWechat', () => {
    describe('# update_userprofile', () => {
      it('should not be included', () => {
        return BaaS.auth.login({username: 'foo', password: 'bar'}).then(user => {
          return user.linkWechat({
            syncUserProfile: 'overwrite',
          })
        }).then(res => {
          expect(requestStub.getCall(2).args[0]).to.be.deep.equal({
            url: config.API.WECHAT.USER_ASSOCIATE,
            method: 'POST',
            dataType: 'json',
            header: {},
            data: {
              code: wechatMock.__get__('code'),
              associate_with_unionid: false,
            }
          })
        })
      })
    })

    describe('# associate_with_unionid', () => {
      it('should be "false"', () => {
        return BaaS.auth.login({username: 'foo', password: 'bar'}).then(user => {
          return user.linkWechat({
            syncUserProfile: 'overwrite',
          })
        }).then(res => {
          expect(requestStub.getCall(2).args[0]).to.be.deep.equal({
            url: config.API.WECHAT.USER_ASSOCIATE,
            method: 'POST',
            dataType: 'json',
            header: {},
            data: {
              code: wechatMock.__get__('code'),
              associate_with_unionid: false,
            }
          })
        })
      })

      it('should be "true"', () => {
        return BaaS.auth.login({username: 'foo', password: 'bar'}).then(user => {
          return user.linkWechat({
            syncUserProfile: 'overwrite',
            withUnionID: true,
          })
        }).then(res => {
          expect(requestStub.getCall(2).args[0]).to.be.deep.equal({
            url: config.API.WECHAT.USER_ASSOCIATE,
            method: 'POST',
            dataType: 'json',
            header: {},
            data: {
              code: wechatMock.__get__('code'),
              associate_with_unionid: true,
            }
          })
        })
      })
    })
  })

  describe('# updatePhoneNumber', () => {
    it('default to true without passing overwrite', () => {
      const now = Date.now()
      const nowStub = sinon.stub(Date, 'now').returns(now)
      return BaaS.auth.updatePhoneNumber({detail: {encryptedData: 'xxx', iv: 'xxx'}}).catch(() => {
        expect(requestStub.getCall(0).args[0]).to.be.deep.equal({
          url: config.API.WECHAT.UPDATE_PHONE_OLD,
          method: 'PUT',
          data: {
            encryptedData: 'xxx',
            iv: 'xxx',
            overwrite: true,
          },
        })
        nowStub.restore()
      })
    })

  })
})
