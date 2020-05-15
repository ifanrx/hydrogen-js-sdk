const faker = require('faker')
const BaaS = require('../baas')
const constants = require('../constants')

let tplMsgStatsReport
let storageAsync

jest.isolateModules(() => {
  storageAsync = require('../storageAsync')
  jest.mock('../storageAsync')
})

faker.seed(123)
jest.mock('../baas')

BaaS._baasRequest = jest.fn().mockResolvedValue()
BaaS._config = {
  API: {
    TEMPLATE_MESSAGE_EVENT_REPORT: faker.random.uuid(),
  },
}
BaaS.storageAsync = storageAsync

describe('tplMsgStatsReport', () => {

  beforeEach(() => {
    faker.seed(123)
    jest.isolateModules(() => {
      tplMsgStatsReport = require('../tplMsgStatsReport')
    })
  })

  test('#pushStats', () => {
    tplMsgStatsReport.pushStats('foo')
    tplMsgStatsReport.pushStats('bar')
    tplMsgStatsReport.pushStats('foo')
    expect(tplMsgStatsReport.getQueue()).toEqual(['foo', 'bar'])
  })

  describe('#reportStats', () => {
    test('should not report anything if queue in empty', () => {
      return tplMsgStatsReport.reportStats()
        .then(() => {
          expect(BaaS._baasRequest).toHaveBeenCalledTimes(0)
        })
    })

    test('should not report anything if user is not logined', () => {
      return Promise.all([
        BaaS.storageAsync.set(constants.STORAGE_KEY.AUTH_TOKEN, ''),
        BaaS.storageAsync.set(constants.STORAGE_KEY.EXPIRES_AT, ''),
      ]).then(() => {
        return tplMsgStatsReport.reportStats()
          .then(() => {
            expect(BaaS._baasRequest).toHaveBeenCalledTimes(0)
          })
      })
    })

    test('should report stats one by one', () => {
      tplMsgStatsReport.pushStats('foo')
      tplMsgStatsReport.pushStats('bar')
      tplMsgStatsReport.pushStats('baz')
      const uuid = faker.random.uuid()
      return tplMsgStatsReport.reportStats()
        .then(() => {
          expect(BaaS._baasRequest.mock.calls).toEqual([
            [{
              url: uuid,
              method: 'POST',
              data: {
                stats_id: 'foo',
                platform: 'wechat_miniapp',
              }
            }], [{
              url: uuid,
              method: 'POST',
              data: {
                stats_id: 'bar',
                platform: 'wechat_miniapp',
              }
            }], [{
              url: uuid,
              method: 'POST',
              data: {
                stats_id: 'baz',
                platform: 'wechat_miniapp',
              }
            }]
          ])
        })
    })
  })
})
