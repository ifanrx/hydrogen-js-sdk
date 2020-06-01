const tplMsgStatsReport = require('core-module/tplMsgStatsReport')
jest.mock('core-module/tplMsgStatsReport')
const reportTemplateMsgAnalyticsModule = require('../reportTemplateMsgAnalytics')

const BaaS = {}
reportTemplateMsgAnalyticsModule(BaaS)


describe('reportTemplateMsgAnalytics', () => {
  test('#pushStats', () => {
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
    expect(tplMsgStatsReport.pushStats.mock.calls.length).toEqual(1)
    expect(tplMsgStatsReport.reportStats.mock.calls.length).toEqual(3)
    expect(tplMsgStatsReport.pushStats.mock.calls[0][0]).toEqual('12345')
  })
})
