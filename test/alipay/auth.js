const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const tplMsgStatsReport = require('../../core/tplMsgStatsReport')
const constants = require('../../core/constants')
const utils = require('../../core/utils')
chai.use(sinonChai)
let expect = chai.expect

describe('auth', () => {
  describe('#loginWithAlipay', () => {
    beforeEach(() => {
      BaaS.clearSession()
    })

    it('should set storage', () => {
      let authCode = 'mock.auth.code'
      let userId = 'mock.user.id'
      let alipayUserId = 'mock.alipay.user.id'
      let token = 'mock.token'
      let expiresIn = 2592000
      my.getAuthCode = sinon.stub().callsFake(({success}) => {
        success({authCode})
      })
      const request = BaaS.request
      let requestStub = sinon.stub(BaaS, 'request').callsFake(options => {
        if (options.url === BaaS._config.API.ALIPAY.SILENT_LOGIN) {
          return Promise.resolve({
            status: 201,
            data: {
              user_id: userId,
              alipay_user_id: alipayUserId,
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
      return BaaS.auth.loginWithAlipay().then((res) => {
        expect(BaaS.storage.get(constants.STORAGE_KEY.UID)).to.be.equal(userId)
        expect(BaaS.storage.get(constants.STORAGE_KEY.AUTH_TOKEN)).to.be.equal(token)
        expect(BaaS.storage.get(constants.STORAGE_KEY.IS_ANONYMOUS_USER)).to.be.equal('0')
        expect(BaaS.storage.get(constants.STORAGE_KEY.ALIPAY_USER_ID)).to.be.equal(alipayUserId)
        expect(parseInt(BaaS.storage.get(constants.STORAGE_KEY.EXPIRES_AT))).to.be.equal(Math.floor(Date.now() / 1000) + expiresIn - 30)
        requestStub.restore()
      })
    })
  })
})
