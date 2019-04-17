const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const rewire = require('rewire')
const constants = require('../../core/constants')
const utils = rewire('../../core/utils')
chai.use(sinonChai)
let expect = chai.expect

describe('ticketReportThrottle', () => {
  it('should invoke fn at first time', () => {
    window.localStorage.clear(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD)
    utils.__set__({last_invoke_time: null})
    const fnSpy = sinon.spy()
    utils.ticketReportThrottle(fnSpy)()
    expect(fnSpy).to.have.been.calledOnce
  })

  it('should not invoke fn if interval is less then "MIN_INTERVAL"', () => {
    window.localStorage.clear(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD)
    utils.__set__({last_invoke_time: null})
    let now = Date.now()
    const nowStub = sinon.stub(Date, 'now')
      .onCall(0).returns(now)
      .onCall(1).returns(now)
      .onCall(2).returns(now + constants.TICKET_REPORT_INVOKE_LIMIT.MIN_INTERVAL)
    const fnSpy = sinon.spy()
    utils.ticketReportThrottle(fnSpy)()
    utils.ticketReportThrottle(fnSpy)()
    nowStub.restore()
    expect(fnSpy).to.have.been.calledOnce
  })

  it('should invoke fn if interval is greater then "MIN_INTERVAL"', () => {
    window.localStorage.clear(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD)
    utils.__set__({last_invoke_time: null})
    let now = Date.now()
    const nowStub = sinon.stub(Date, 'now')
      .onCall(0).returns(now)
      .onCall(1).returns(now)
      .onCall(2).returns(now + constants.TICKET_REPORT_INVOKE_LIMIT.MIN_INTERVAL + 1)
    const fnSpy = sinon.spy()
    utils.ticketReportThrottle(fnSpy)()
    utils.ticketReportThrottle(fnSpy)()
    nowStub.restore()
    expect(fnSpy).to.have.been.calledTwice
  })

  it('should invoke fn if invoke times is under limit', () => {
    utils.__set__({last_invoke_time: null})
    let time = Date.now() - 100000
    BaaS.storage.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, {
      invoke_times: constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES - 1,
      timestamp: time,
    })
    const fnSpy = sinon.spy()
    utils.ticketReportThrottle(fnSpy)()
    expect(fnSpy).to.have.been.calledOnce
    expect(BaaS.storage.get(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD))
      .to.be.deep.equal({
        invoke_times: constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES,
        timestamp: time,
      })
  })

  it('should not invoke fn if invoke times is over limit', () => {
    utils.__set__({last_invoke_time: null})
    let invokeRecord = {
      invoke_times: constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES,
      timestamp: Date.now() - 100000,
    }

    BaaS.storage.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, invokeRecord)
    const fnSpy = sinon.spy()
    utils.ticketReportThrottle(fnSpy)()
    expect(fnSpy).to.have.not.been.called
    expect(BaaS.storage.get(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD))
      .to.be.deep.equal(invokeRecord)
  })

  it('should invoke fn if ttl of "invokeRecord" is greater then "TIMES_LIMIT.INTERVAL"', () => {
    utils.__set__({last_invoke_time: null})
    let time = Date.now()
    const nowStub = sinon.stub(Date, 'now').returns(time)
    BaaS.storage.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, {
      invoke_times: constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES,
      timestamp: time - constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.INTERVAL - 1,
    })
    const fnSpy = sinon.spy()
    utils.ticketReportThrottle(fnSpy)()
    expect(fnSpy).to.have.been.calledOnce
    expect(BaaS.storage.get(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD))
      .to.be.deep.equal({
        invoke_times: 1,
        timestamp: time,
      })
    nowStub.restore()
  })

  it('should invoke fn with correct params', () => {
    utils.__set__({last_invoke_time: null})
    window.localStorage.clear(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD)
    const value = 'fack-value'
    const fnSpy = sinon.stub().returns(value)
    utils.ticketReportThrottle(fnSpy)('foo', 'bar', 'baz')
    expect(fnSpy).to.have.been.calledWith('foo', 'bar', 'baz')
  })

  it('should return correct value', () => {
    utils.__set__({last_invoke_time: null})
    window.localStorage.clear(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD)
    const value = 'fack-value'
    const fnStub = sinon.stub().returns(value)
    const res = utils.ticketReportThrottle(fnStub)()
    expect(res).to.be.equal(value)
  })

  it('should not throw error', () => {
    utils.__set__({last_invoke_time: null})
    BaaS.storage.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, {
      invoke_times: NaN,
      timestamp: 'bar',
    })
    const fnSpy = sinon.spy()
    const time = Date.now() + 1000
    const nowStub = sinon.stub(Date, 'now')
      .onCall(1).returns(time)
    expect(() => {
      utils.ticketReportThrottle(fnSpy)()
    }).to.not.throw()
    expect(fnSpy).to.have.been.calledOnce
    expect(BaaS.storage.get(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD))
      .to.be.deep.equal({
        invoke_times: 1,
        timestamp: time,
      })
  })
})
