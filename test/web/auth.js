const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const tplMsgStatsReport = require('../../core/tplMsgStatsReport')
const constants = require('../../core/constants')
const utils = require('../../core/utils')
chai.use(sinonChai)
let expect = chai.expect

describe('auth', () => {
  let userId = 'mock.user.id'
  let token = 'mock.token'
  let expiresIn = 2592000
  let request
  let requestStub

  beforeEach(() => {
    BaaS.clearSession()
    request = BaaS.request
    requestStub = sinon.stub(BaaS, 'request').callsFake(options => {
      if (
        options.url === BaaS._config.API.WEB.LOGIN_USERNAME ||
        options.url === BaaS._config.API.WEB.REGISTER_USERNAME
      ) {
        return Promise.resolve({
          status: 201,
          data: {
            user_id: userId,
            token,
            expires_in: expiresIn,
          }
        })
      } else if (options.url === utils.format(BaaS._config.API.USER_DETAIL, {
        userID: userId,
      })) {
        return Promise.resolve({
          status: 200,
          data: {
            avatar: '',
            id : 22075549131219,
            is_authorized : false,
            _provider : {}
          }
        })
      }
      return request(options)
    })
  })

  afterEach(() => {
    requestStub.restore()
  })

  describe('#clearSession', () => {
    it('should clear session', () => {
      BaaS.storage.set(constants.STORAGE_KEY.AUTH_TOKEN, 'token')
      BaaS.storage.set(constants.STORAGE_KEY.IS_LOGINED_BAAS, 'login')
      BaaS.storage.set(constants.STORAGE_KEY.IS_ANONYMOUS_USER, 'anonymous')
      BaaS.storage.set(constants.STORAGE_KEY.USERINFO, 'userinfo')
      BaaS.storage.set(constants.STORAGE_KEY.UID, 'uid')
      expect(BaaS.storage.get(constants.STORAGE_KEY.AUTH_TOKEN)).to.be.equal('token')
      expect(BaaS.storage.get(constants.STORAGE_KEY.IS_LOGINED_BAAS)).to.be.equal('login')
      expect(BaaS.storage.get(constants.STORAGE_KEY.IS_ANONYMOUS_USER)).to.be.equal('anonymous')
      expect(BaaS.storage.get(constants.STORAGE_KEY.USERINFO)).to.be.equal('userinfo')
      expect(BaaS.storage.get(constants.STORAGE_KEY.UID)).to.be.equal('uid')
      BaaS.clearSession()
      expect(BaaS.storage.get(constants.STORAGE_KEY.AUTH_TOKEN)).to.be.equal('')
      expect(BaaS.storage.get(constants.STORAGE_KEY.IS_LOGINED_BAAS)).to.be.equal('')
      expect(BaaS.storage.get(constants.STORAGE_KEY.IS_ANONYMOUS_USER)).to.be.equal('')
      expect(BaaS.storage.get(constants.STORAGE_KEY.USERINFO)).to.be.equal('')
      expect(BaaS.storage.get(constants.STORAGE_KEY.UID)).to.be.equal('')
    })
  })

  describe('# login', () => {
    it('should set storage', () => {
      BaaS._baasRequest = BaaS.request
      return BaaS.auth.login({
        username: 'foo',
        password: 'bar',
      }).then(currentUser => {
        expect(BaaS.storage.get(constants.STORAGE_KEY.UID)).to.be.equal(userId)
        expect(BaaS.storage.get(constants.STORAGE_KEY.AUTH_TOKEN)).to.be.equal(token)
        expect(BaaS.storage.get(constants.STORAGE_KEY.IS_ANONYMOUS_USER)).to.be.equal(0)
        expect(parseInt(BaaS.storage.get(constants.STORAGE_KEY.EXPIRES_AT))).to.be.equal(Math.floor(Date.now() / 1000) + expiresIn - 30)
      })
    })
  })

  describe("# register", () => {
    it('should set storage', () => {
      BaaS._baasRequest = BaaS.request
      return BaaS.auth.register({
        username: 'foo',
        password: 'bar',
      }).then(currentUser => {
        expect(BaaS.storage.get(constants.STORAGE_KEY.UID)).to.be.equal(userId)
        expect(BaaS.storage.get(constants.STORAGE_KEY.AUTH_TOKEN)).to.be.equal(token)
        expect(BaaS.storage.get(constants.STORAGE_KEY.IS_ANONYMOUS_USER)).to.be.equal(0)
        expect(parseInt(BaaS.storage.get(constants.STORAGE_KEY.EXPIRES_AT))).to.be.equal(Math.floor(Date.now() / 1000) + expiresIn - 30)
      })
    })
  })

  describe('# currentUser', () => {
    ['login', 'register'].forEach(func => {
      it(`should include "session_expires_at"(${func})`, () => {
        return BaaS.auth[func]({
          username: 'foo',
          password: 'bar',
        }).then(currentUser => {
          expect(parseInt(BaaS.storage.get(constants.STORAGE_KEY.EXPIRES_AT))).to.be.equal(currentUser.session_expires_at)
        })
      })
    })
  })
})
