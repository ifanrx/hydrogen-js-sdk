const tplMsgStatsReport = require('core-module/tplMsgStatsReport')
module.exports = BaaS => {
  Object.assign(BaaS, {
    reportTemplateMsgAnalytics: function (options) {
      if (options.query && options.query._H_utm_campaign) {
        tplMsgStatsReport.pushStats(options.query._H_utm_campaign)
      } 
      tplMsgStatsReport.reportStats()
    }
  })
}
