const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const makeParams = require('../../core/utils').makeReportTicketParam
const constants = require('../../core/constants')
chai.use(sinonChai)
let expect = chai.expect

describe('ticketReport', () => {
  let requestStub
  beforeEach(() => {
    requestStub = sinon.stub(BaaS, 'request').resolves({
      statusCode: 201,
      data: {},
    })
  })

  afterEach(() => {
    requestStub.restore()
  })

  it('should invoke once', () => {
    BaaS.storage.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, {
      invokeTimes: 1,
      timestamp: Date.now(),
    })
    return BaaS.reportTicket('foo', {enableThrottle: true})
      .then(() => BaaS.reportTicket('bar', {enableThrottle: true}))
      .then(() => {
        expect(requestStub).to.have.been.calledOnce
      })
  })

  it('should invoke once(times limit)', () => {
    let now = Date.now()
    BaaS.storage.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, {
      invokeTimes: constants.TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES_PER_CYCLE - 1,
      timestamp: now,
    })
    const nowStub = sinon.stub(Date, 'now').returns(now + constants.TICKET_REPORT_INVOKE_LIMIT.MIN_INTERVAL)
    return BaaS.reportTicket('foo', {enableThrottle: true})
      .then(() => {
        nowStub.returns(now + 2 * constants.TICKET_REPORT_INVOKE_LIMIT.MIN_INTERVAL + 1)
        return BaaS.reportTicket('bar', {enableThrottle: true})
      })
      .then(() => {
        expect(requestStub).to.have.been.calledOnce
        nowStub.restore()
      })
  })

  it('should invoke twice', () => {
    let now = Date.now()
    BaaS.storage.set(constants.STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, {
      invokeTimes: 1,
      timestamp: now,
    })
    const nowStub = sinon.stub(Date, 'now').returns(now + 3 * constants.TICKET_REPORT_INVOKE_LIMIT.MIN_INTERVAL)
    return BaaS.reportTicket('foo', {enableThrottle: true})
      .then(() => {
        nowStub.returns(now + 4 * constants.TICKET_REPORT_INVOKE_LIMIT.MIN_INTERVAL + 1)
        return BaaS.reportTicket('bar', {enableThrottle: true})
      })
      .then(() => {
        expect(requestStub).to.have.been.calledTwice
        nowStub.restore()
      })
  })
})
