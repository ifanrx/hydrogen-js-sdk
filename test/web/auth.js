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
        options.url === BaaS._config.API.LOGIN_USERNAME ||
        options.url === BaaS._config.API.REGISTER_USERNAME
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
      } else {
        return Promise.resolve()
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
      const now = Date.now()
      const nowStub = sinon.stub(Date, 'now').returns(now)
      return BaaS.auth.login({
        username: 'foo',
        password: 'bar',
      }).then(currentUser => {
        expect(BaaS.storage.get(constants.STORAGE_KEY.UID)).to.be.equal(userId)
        expect(BaaS.storage.get(constants.STORAGE_KEY.AUTH_TOKEN)).to.be.equal(token)
        expect(BaaS.storage.get(constants.STORAGE_KEY.IS_ANONYMOUS_USER)).to.be.equal(0)
        expect(parseInt(BaaS.storage.get(constants.STORAGE_KEY.EXPIRES_AT))).to.be.equal(Math.floor(now / 1000) + expiresIn - 30)
        nowStub.restore()
      })
    })
  })

  describe('# loginWithThirdParty', () => {
    it('should request "THIRD_PARTY_AUTH" if "token" param is not in url', () => {
      global.window.location = {
        search: '',
      }
      let provider = 'weibo'
      let url = BaaS._config.API.WEB.THIRD_PARTY_AUTH.replace(':provider', provider)
      return BaaS.auth.loginWithThirdParty(provider)
        .catch(err => console.log(err))
        .then(() => {
          expect(requestStub).to.have.been.calledWith({
            url,
            method: 'GET',
          })
        })
    })

    it('should request "THIRD_PARTY_LOGIN" if "token" param is in url', () => {
      const token = 'mock-token'
      global.window.location = {
        search: '?token=' + token,
      }
      let provider = 'weixin'
      let url = BaaS._config.API.WEB.THIRD_PARTY_LOGIN.replace(':provider', provider)
      return BaaS.auth.loginWithThirdParty(provider, {
        createUser: false,
      })
        .catch(err => console.log(err))
        .then(() => {
          expect(requestStub).to.have.been.calledWith({
            url,
            method: 'POST',
            data: {
              token,
              create_user: false,
              update_userprofile: 'setnx',
            },
          })
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

    it('should throw 604 if have no uid', () => {
      BaaS._baasRequest = BaaS.request
      const successSpy = sinon.spy()
      return BaaS.auth.login({
        username: 'foo',
        password: 'bar',
      }).then(currentUser => {
        BaaS.storage.set(constants.STORAGE_KEY.UID, '')
        return BaaS.auth.getCurrentUser()
          .then(successSpy)
          .catch(err => {
            expect(err.code).to.equal(604)
          })
          .then(() => {
            expect(successSpy).have.not.been.called
          })
      })
    })

    it('should throw 604 if have no expiresAt', () => {
      BaaS._baasRequest = BaaS.request
      const successSpy = sinon.spy()
      return BaaS.auth.login({
        username: 'foo',
        password: 'bar',
      }).then(currentUser => {
        BaaS.storage.set(constants.STORAGE_KEY.EXPIRES_AT, '')
        return BaaS.auth.getCurrentUser()
          .then(successSpy)
          .catch(err => {
            expect(err.code).to.equal(604)
          })
          .then(() => {
            expect(successSpy).have.not.been.called
          })
      })
    })

    it('should throw 604 if token is expired', () => {
      BaaS._baasRequest = BaaS.request
      const successSpy = sinon.spy()
      return BaaS.auth.login({
        username: 'foo',
        password: 'bar',
      }).then(currentUser => {
        BaaS.storage.set(constants.STORAGE_KEY.EXPIRES_AT, 0)
        return BaaS.auth.getCurrentUser()
          .then(successSpy)
          .catch(err => {
            expect(err.code).to.equal(604)
          })
          .then(() => {
            expect(successSpy).have.not.been.called
          })
      })
    })
  })
})
