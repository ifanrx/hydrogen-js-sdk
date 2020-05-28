const faker = require('faker')
let ticketReportThrottle, storageAsync
const constants = require('../../constants')

storageAsync = require('../../storageAsync')
jest.mock('../../storageAsync')

describe('ticketReportThrottle', () => {
  beforeEach(() => {
    jest.isolateModules(() => {
      ticketReportThrottle = require('../ticketReportThrottle')
    })
  })

  it('should invoke fn at first time', () => {
    const fnStub = jest.fn().mockResolvedValue()
    return storageAsync.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, '').then(() => {
      return ticketReportThrottle(fnStub)('foo', {enableThrottle: true})
    }).then(() => {
      expect(fnStub.mock.calls.length).toBe(1)
    })
  })

  it('should not invoke fn if interval is less then "MIN_INTERVAL_PRE_TIME"', () => {
    const fnStub = jest.fn().mockResolvedValue()
    const realNow = Date.now
    let now = realNow()
    Date.now = jest.fn()
      .mockReturnValueOnce(now)
      .mockReturnValueOnce(now)
      .mockReturnValueOnce(now)
      .mockReturnValueOnce(now + constants.TICKET_REPORT_INVOKE_LIMIT.MIN_INTERVAL_PRE_TIME)
      .mockReturnValue(now)
    return storageAsync.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, '')
      .then(() => ticketReportThrottle(fnStub)('foo', {enableThrottle: true}))
      .then(() => ticketReportThrottle(fnStub)('foo', {enableThrottle: true}))
      .then(() => {
        expect(fnStub.mock.calls.length).toBe(1)
        Date.now = realNow
      })
  })

  it('should invoke fn if interval is greater then "MIN_INTERVAL_PRE_TIME"', () => {
    const fnStub = jest.fn().mockResolvedValue()
    const realNow = Date.now
    let now = realNow()
    Date.now = jest.fn()
      .mockReturnValueOnce(now)
      .mockReturnValueOnce(now)
      .mockReturnValueOnce(now)
      .mockReturnValueOnce(now + constants.TICKET_REPORT_INVOKE_LIMIT.MIN_INTERVAL_PRE_TIME + 1)
      .mockReturnValue(now)
    return storageAsync.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, '')
      .then(() => ticketReportThrottle(fnStub)('foo', {enableThrottle: true}))
      .then(() => ticketReportThrottle(fnStub)('foo', {enableThrottle: true}))
      .then(() => {
        expect(fnStub.mock.calls.length).toBe(2)
        Date.now = realNow
      })
  })

  it('should invoke fn if invoke times is under limit', () => {
    let time = Date.now() - 100000
    const fnStub = jest.fn().mockResolvedValue()
    return storageAsync.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, {
      invokeTimes: constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES_PER_CYCLE - 1,
      timestamp: time,
    })
      .then(() => ticketReportThrottle(fnStub)('foo', {enableThrottle: true}))
      .then(() => storageAsync.get(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD))
      .then(invokeRecord => {
        expect(fnStub.mock.calls.length).toBe(1)
        expect(invokeRecord).toEqual({
          invokeTimes: constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES_PER_CYCLE,
          timestamp: time,
        })
      })
  })

  it('should not invoke fn if invoke times is over limit', () => {
    const fnStub = jest.fn().mockResolvedValue()
    let invokeRecord = {
      invokeTimes: constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES_PER_CYCLE,
      timestamp: Date.now() - 100000,
    }
    storageAsync.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, invokeRecord)
      .then(() => ticketReportThrottle(fnStub)('foo', {enableThrottle: true}))
      .then(() => storageAsync.get(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD))
      .then(_invokeRecord => {
        expect(fnStub.mock.calls.length).toBe(0)
        expect(_invokeRecord).toEqual(invokeRecord)
      })
  })

  it('should invoke fn if ttl of "invokeRecord" is greater then "TIMES_LIMIT.CYCLE"', () => {
    const fnStub = jest.fn().mockResolvedValue()
    const realNow = Date.now
    let time = realNow()
    Date.now = jest.fn().mockReturnValue(time)

    return storageAsync.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, {
      invokeTimes: constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES_PER_CYCLE,
      timestamp: time - constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.CYCLE - 1,
    })
      .then(() => ticketReportThrottle(fnStub)('foo', {enableThrottle: true}))
      .then(() => storageAsync.get(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD))
      .then(invokeRecord => {
        expect(fnStub.mock.calls.length).toBe(1)
        expect(invokeRecord).toEqual({
          invokeTimes: 1,
          timestamp: time,
        })
        Date.now = realNow
      })
  })

  it('should invoke fn with correct params', () => {
    const fnStub = jest.fn().mockResolvedValue()
    return storageAsync.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, '')
      .then(() => ticketReportThrottle(fnStub)('foo', {enableThrottle: true}))
      .then(() => {
        expect(fnStub.mock.calls).toEqual([['foo']])
      })
  })

  it('should return correct value', () => {
    const value = faker.random.uuid()
    const fnStub = jest.fn().mockResolvedValue(value)
    return storageAsync.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, '')
      .then(() => ticketReportThrottle(fnStub)('foo', {enableThrottle: true}))
      .then(res => {
        expect(res).toEqual(value)
      })
  })

  it('should not throw error', () => {
    const fnStub = jest.fn().mockResolvedValue()
    const realNow = Date.now
    let time = realNow() + 1000
    Date.now = jest.fn().mockReturnValue(time)

    return storageAsync.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, {
      invokeTimes: NaN,
      timestamp: 'bar',
    })
      .then(() => ticketReportThrottle(fnStub)('foo', {enableThrottle: true}))
      .then(() => storageAsync.get(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD))
      .then(invokeRecord => {
        expect(fnStub.mock.calls.length).toBe(1)
        expect(invokeRecord).toEqual({
          invokeTimes: 1,
          timestamp: time,
        })
        Date.now = realNow
      })
  })

  it('should return Promise always', () => {
    const fnStub = jest.fn().mockResolvedValue()
    return storageAsync.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, '')
      .then(() => {
        const res_1 = ticketReportThrottle(fnStub)('foo', {enableThrottle: true})
        const res_2 = ticketReportThrottle(fnStub)('foo', {enableThrottle: true})
        expect(res_1).toEqual(expect.any(Promise))
        expect(res_2).toEqual(expect.any(Promise))
      })
  })

  it('should rollback "invokeTimes" if invoke fn fail', () => {
    const error = new Error('test error')
    const fnStub = jest.fn().mockRejectedValue(error)
    let invokeRecord = {
      invokeTimes: constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES_PER_CYCLE - 1,
      timestamp: Date.now() - 100000,
    }
    return storageAsync.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, invokeRecord)
      .then(() => {
        return ticketReportThrottle(fnStub)('foo', {enableThrottle: true}).catch(err => {
          expect(fnStub.mock.calls.length).toBe(1)
          expect(err).toEqual(error)
          return storageAsync.get(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD)
        })
      })
      .then(_invokeRecord => {
        expect(_invokeRecord).toEqual(invokeRecord)
      })
  })

  it('should invoke fn every time if throttle is disabled', () => {
    const fnStub = jest.fn().mockResolvedValue()
    return Promise.all(new Array(constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES_PER_CYCLE).fill(0).map(() => {
      return Promise.all([
        ticketReportThrottle(fnStub)('foo'),
        ticketReportThrottle(fnStub)('foo', {enableThrottle: false}),
      ])
    }))
      .then(() => {
        expect(fnStub.mock.calls.length).toBe(constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES_PER_CYCLE * 2)
      })
  })
})
