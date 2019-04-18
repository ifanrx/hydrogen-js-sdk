const constants = require('../constants')
const storage = require('../storage')
const log = require('./log').log

const initReportTicketInvokeRecord = () => ({
  invokeTimes: 1,
  timestamp: Date.now(),
})
const isInvalidInvokeRecord = (invokeRecord) => {
  return isNaN(invokeRecord.invokeTimes) || isNaN(invokeRecord.timestamp)
}
let lastInvokeTime
const ticketReportThrottle = ticketReportFn => (formID, {enableThrottle = false} = {}) => {
  if (!enableThrottle) {
    return ticketReportFn(formID)
  }
  const {LOG_LEVEL, TICKET_REPORT_INVOKE_LIMIT, STORAGE_KEY} = constants
  const now = Date.now()
  log(LOG_LEVEL.DEBUG, `<ticket-report> last: ${lastInvokeTime}, now: ${now}`)
  if (lastInvokeTime && now - lastInvokeTime <= TICKET_REPORT_INVOKE_LIMIT.MIN_INTERVAL_PRE_TIME) return Promise.resolve()  // 上次调用时间与当前时刻对比，未超过 5s 则调用失败

  let invokeRecord = storage.get(STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD)
  const isOverdue = invokeRecord && now - invokeRecord.timestamp > TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.CYCLE
  log(LOG_LEVEL.DEBUG, `<ticket-report> record: ${JSON.stringify(invokeRecord)}, now: ${now}`)
  if (invokeRecord && invokeRecord.invokeTimes >= TICKET_REPORT_INVOKE_LIMIT.TIMES_LIMIT.MAX_TIMES_PER_CYCLE && !isOverdue) return Promise.resolve()  // 当调用次数超过 10 次，且第一次调用时间距离此刻未超过 24h，则调用失败

  // 更新 storage 中 REPORT_TICKET_INVOKE_RECORD 的数据
  if (!invokeRecord || isOverdue || isInvalidInvokeRecord(invokeRecord)) {
    invokeRecord = initReportTicketInvokeRecord()
  } else {
    invokeRecord.invokeTimes += 1
  }

  // 调用 ticket report 方法
  if (ticketReportFn && typeof ticketReportFn === 'function') {
    lastInvokeTime = now
    storage.set(STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, invokeRecord)
    return ticketReportFn(formID)
      .then(res => {
        log(LOG_LEVEL.DEBUG, `<ticket-report> invoke success ${Date.now() - now}ms`)
        return res
      })
      .catch(err => {
        invokeRecord.invokeTimes -= 1
        storage.set(STORAGE_KEY.REPORT_TICKET_INVOKE_RECORD, invokeRecord)
        log(LOG_LEVEL.DEBUG, `<ticket-report> invoke fail ${Date.now() - now}ms err: ${err}`)
        throw err
      })
  } else {
    log(LOG_LEVEL.DEBUG, '<ticket-report> invoke fail')
    log(LOG_LEVEL.ERROR, new TypeError('"ticketReportFn" must be Function type'))
  }
}

module.exports = ticketReportThrottle
