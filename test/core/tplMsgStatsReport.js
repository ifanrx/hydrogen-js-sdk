const rewire = require('rewire')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const constants = require('../../core/constants')
const tplMsgStatsReport = rewire('../../core/tplMsgStatsReport')
const tpl_msg_stats_report_queue = tplMsgStatsReport.__get__('tpl_msg_stats_report_queue')
chai.use(sinonChai)

describe('tplMsgStatsReport', () => {

  it('#pushStats', () => {
    tplMsgStatsReport.pushStats('foo')
    tplMsgStatsReport.pushStats('bar')
    tplMsgStatsReport.pushStats('foo')
    expect(tpl_msg_stats_report_queue).to.be.deep.equal(['foo', 'bar'])
  })

  describe('#reportStats', () => {
    let baasRequestStub

    beforeEach(() => {
      baasRequestStub = sinon.stub(BaaS, '_baasRequest').resolves()
      BaaS.storage.set(constants.STORAGE_KEY.AUTH_TOKEN, 'mock-token')
      BaaS.storage.set(constants.STORAGE_KEY.EXPIRES_AT, Math.floor(Date.now() / 1000) + 2592000 - 30)
      tplMsgStatsReport.__set__({
        isReporting: false,
        tpl_msg_stats_report_queue: ['foo', 'bar', 'baz'],
      })
    })
    afterEach(() => {
      baasRequestStub.restore()
    })

    it('should report stats one by one', () => {
      return tplMsgStatsReport.reportStats()
        .then(() => {
          expect(baasRequestStub).to.have.been.calledThrice
          expect(baasRequestStub.firstCall.args[0]).to.be.deep.equal({
            url: BaaS._config.API.TEMPLATE_MESSAGE_EVENT_REPORT,
            method: 'POST',
            data: {
              stats_id: 'foo',
              platform: 'wechat_miniapp',
            }
          })
          expect(baasRequestStub.secondCall.args[0]).to.be.deep.equal({
            url: BaaS._config.API.TEMPLATE_MESSAGE_EVENT_REPORT,
            method: 'POST',
            data: {
              stats_id: 'bar',
              platform: 'wechat_miniapp',
            }
          })
          expect(baasRequestStub.thirdCall.args[0]).to.be.deep.equal({
            url: BaaS._config.API.TEMPLATE_MESSAGE_EVENT_REPORT,
            method: 'POST',
            data: {
              stats_id: 'baz',
              platform: 'wechat_miniapp',
            }
          })
        })
    })

    it('should not report anything if queue in empty', () => {
      tplMsgStatsReport.__set__('tpl_msg_stats_report_queue', [])
      return tplMsgStatsReport.reportStats()
        .then(() => {
          expect(baasRequestStub).to.have.been.not.called
        })
    })

    it('should not report anything if isReporting is true', () => {
      tplMsgStatsReport.__set__('isReporting', true)
      return tplMsgStatsReport.reportStats()
        .then(() => {
          expect(baasRequestStub).to.have.been.not.called
        })
    })

    it('should not report anything if user is not logined', () => {
      BaaS.storage.set(constants.STORAGE_KEY.AUTH_TOKEN, '')
      BaaS.storage.set(constants.STORAGE_KEY.EXPIRES_AT, '')
      return tplMsgStatsReport.reportStats()
        .then(() => {
          expect(baasRequestStub).to.have.been.not.called
        })
    })
  })
})
