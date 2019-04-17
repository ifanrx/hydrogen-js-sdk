const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const rewire = require('rewire')
const constants = require('../../core/constants')
const config = require('../../core/config')
const utils = require('../../core/utils')
const alipayMock = rewire('./alipay-mock')
chai.use(sinonChai)
let expect = chai.expect

describe('auth', () => {
  let requestStub
  let request
  let authCode = 'mock.auth.code'
  let userId = 'mock.user.id'
  let alipayUserId = 'mock.alipay.user.id'
  let token = 'mock.token'
  let expiresIn = 2592000

  beforeEach(() => {
    BaaS.clearSession()
    BaaS._config.updateUserprofile = ''
    request = BaaS.request
    requestStub = sinon.stub(BaaS, 'request').callsFake(options => {
      if (
        options.url === BaaS._config.API.ALIPAY.SILENT_LOGIN ||
        options.url === BaaS._config.API.WEB.LOGIN_USERNAME ||
        options.url === BaaS._config.API.ALIPAY.USER_ASSOCIATE ||
        options.url === BaaS._config.API.ALIPAY.AUTHENTICATE
      ) {
        let status = options.url === BaaS._config.API.ALIPAY.USER_ASSOCIATE
          ? 200 : 201
        return Promise.resolve({
          status,
          data: {
            user_id: userId,
            alipay_user_id: alipayUserId,
            token,
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

  describe('# loginWithAlipay', () => {
    it('should set storage', () => {
      return BaaS.auth.loginWithAlipay().then((res) => {
        expect(BaaS.storage.get(constants.STORAGE_KEY.UID)).to.be.equal(userId)
        expect(BaaS.storage.get(constants.STORAGE_KEY.AUTH_TOKEN)).to.be.equal(token)
        expect(BaaS.storage.get(constants.STORAGE_KEY.IS_ANONYMOUS_USER)).to.be.equal(0)
        expect(BaaS.storage.get(constants.STORAGE_KEY.ALIPAY_USER_ID)).to.be.equal(alipayUserId)
        expect(parseInt(BaaS.storage.get(constants.STORAGE_KEY.EXPIRES_AT))).to.be.equal(Math.floor(Date.now() / 1000) + expiresIn - 30)
      })
    })

    describe('# update_userprofile', () => {
      [[null, 'setnx'], ['bar', 'setnx'], ['setnx', 'setnx'], ['false', 'false'], ['overwrite', 'overwrite']].map(item => {
        it(`should be "${item[1]}"("${item[0]}")`, () => {
          return BaaS.auth.loginWithAlipay({forceLogin: true, syncUserProfile: item[0]}).then(() => {
            expect(requestStub.getCall(0).args[0]).to.be.deep.equal({
              url: config.API.ALIPAY.AUTHENTICATE,
              method: 'POST',
              data: {
                code: alipayMock.__get__('code'),
                create_user: true,
                update_userprofile: item[1],
              }
            })
          })
        })
      })

      it('should not be included', () => {
        return BaaS.auth.loginWithAlipay({forceLogin: false, syncUserProfile: 'false'}).then(() => {
          expect(requestStub.getCall(0).args[0]).to.be.deep.equal({
            url: config.API.ALIPAY.SILENT_LOGIN,
            method: 'POST',
            data: {
              code: alipayMock.__get__('code'),
              create_user: true,
            }
          })
        })
      })
    })
  })

  describe('# linkAlipay', () => {
    describe('# update_userprofile', () => {
      [[null, 'setnx'], ['foo', 'setnx'], ['setnx', 'setnx'], ['false', 'false'], ['overwrite', 'overwrite']].map(item => {
        it(`should be "${item[1]}"("${item[0]}")`, () => {
          return BaaS.auth.login({username: 'foo', password: 'bar'}).then(user => {
            return user.linkAlipay({forceLogin: true, syncUserProfile: item[1]})
          }).then(res => {
            expect(requestStub.getCall(2).args[0]).to.be.deep.equal({
              url: config.API.ALIPAY.USER_ASSOCIATE,
              method: 'PUT',
              data: {
                authorized: true,
                code: alipayMock.__get__('code'),
                update_userprofile: item[1],
              }
            })
          })
        })
      })

      it('should not be included', () => {
        return BaaS.auth.login({username: 'foo', password: 'bar'}).then(user => {
          return user.linkAlipay({forceLogin: false, syncUserProfile: 'false'})
        }).then(res => {
          expect(requestStub.getCall(2).args[0]).to.be.deep.equal({
            url: config.API.ALIPAY.USER_ASSOCIATE,
            method: 'PUT',
            data: {
              authorized: false,
              code: alipayMock.__get__('code'),
            }
          })
        })
      })
    })
  })
})
