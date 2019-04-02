const BaaS = require('./baas')
const constants = require('./constants')
const utils = require('./utils')
let tpl_msg_stats_report_queue = []
let isReporting = false

function pushStats(statsId) {
  if (!tpl_msg_stats_report_queue.includes(statsId)) {
    tpl_msg_stats_report_queue.push(statsId)
  }
}

function reportStatsFromHeadOfQueue() {
  const statsIdToReport = tpl_msg_stats_report_queue[0]
  return BaaS._baasRequest({
    url: BaaS._config.API.TEMPLATE_MESSAGE_EVENT_REPORT,
    method: 'POST',
    data: {
      stats_id: statsIdToReport,
      platform: BaaS._polyfill.CLIENT_PLATFORM === 'ALIPAY' ? 'alipay_miniapp' : 'wechat_miniapp'
    }
  }).then(() => {
    tpl_msg_stats_report_queue.shift()
    if (!tpl_msg_stats_report_queue.length) return
    return reportStatsFromHeadOfQueue()
  })
}

function reportStats() {
  // 如果已经在上报或队列中没有内容，则不执行上报
  if (isReporting || !tpl_msg_stats_report_queue.length) return Promise.resolve()
  // 如果用户未登录，则不执行上报
  if (!BaaS.storage.get(constants.STORAGE_KEY.AUTH_TOKEN) || utils.isSessionExpired()) {
    return Promise.resolve()
  }
  isReporting = true
  return reportStatsFromHeadOfQueue()
    .then(() => (isReporting = false))
    .catch(err => {
      isReporting = false
      throw err
    })
}

module.exports = {
  pushStats,
  reportStats,
}
