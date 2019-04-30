const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const tplMsgStatsReport = require('../../core/tplMsgStatsReport')
const constants = require('../../core/constants')
const utils = require('../../core/utils')
chai.use(sinonChai)

describe('reportTemplateMsgAnalytics', () => {
  it('#pushStats', () => {
    const pushStatsSpy = sinon.spy(tplMsgStatsReport, 'pushStats')
    const reportStatsStub = sinon.stub(tplMsgStatsReport, 'reportStats').resolves()
    BaaS.reportTemplateMsgAnalytics({
      path: '/pages/index/index',
      query: {
        _H_utm_campaign: '12345',
      },
      scene: 1014,
    })
    BaaS.reportTemplateMsgAnalytics({
      path: '/pages/index/index',
      query: {
        _H_utm_campaign: '12345',
      },
      scene: 1015,
    })
    BaaS.reportTemplateMsgAnalytics({
      path: '/pages/index/index',
      query: {},
      scene: 1014,
    })
    expect(pushStatsSpy).to.have.been.calledOnce
    expect(reportStatsStub).to.have.been.calledThrice
    expect(pushStatsSpy).to.have.been.calledWith('12345')
    pushStatsSpy.restore()
    reportStatsStub.restore()
  })

  describe('#reportStats', () => {
    let reportStatsStub
    let requestStub
    before(() => {
      const request = BaaS.request
      requestStub = sinon.stub(BaaS, 'request')
        .callsFake(function (options) {
          if (
            options.url === BaaS._config.API.LOGIN_USERNAME
            || options.url === BaaS._config.API.LOGIN_EMAIL
            || options.url === BaaS._config.API.REGISTER_USERNAME
            || options.url === BaaS._config.API.REGISTER_EMAIL
            || options.url === BaaS._config.API.ANONYMOUS_LOGIN
            || options.url === utils.format(BaaS._config.API.USER_DETAIL, {
              userID: 'mock_user_id',
            })
            || options.url === BaaS._config.API.WECHAT.SILENT_LOGIN
          ) {
            return Promise.resolve({
              status: 200,
              data: {
                user_id: 'mock_user_id',
                token: 'mock_token',
                expires_in: 2592000,
              }
            })
          }
          return request(options)
        })
    })

    after(() => {
      requestStub.restore()
    })

    beforeEach(() => {
      reportStatsStub = sinon.stub(tplMsgStatsReport, 'reportStats')
      BaaS.storage.set(constants.STORAGE_KEY.UID, '')
      BaaS.storage.set(constants.STORAGE_KEY.AUTH_TOKEN, '')
    })

    afterEach(() => {
      reportStatsStub.restore()
    })

    it('should be called after login', () => {
      return BaaS.auth.login({
        username: 'foo',
        password: 'bar',
      }).then(() => {
        expect(reportStatsStub).to.have.been.calledOnce
      })
    })

    it('should be called after loginWithWechat', () => {
      return BaaS.auth.loginWithWechat().then(() => {
        expect(reportStatsStub).to.have.been.calledOnce
      })
    })

    it('should be called after register', () => {
      return BaaS.auth.register({
        username: 'foo',
        password: 'bar',
      }).then(() => {
        expect(reportStatsStub).to.have.been.calledOnce
      })
    })

    it('should not be called after anonymousLogin', () => {
      return BaaS.auth.anonymousLogin().then(() => {
        expect(reportStatsStub).to.have.not.been.called
      })
    })
  })
})
