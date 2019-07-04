const tplMsgStatsReport = require('core-module/tplMsgStatsReport')
const QQ_SCENE_FROM_TEMPLATE_MESSAGE_CARD = 1014
module.exports = BaaS => {
  Object.assign(BaaS, {
    reportTemplateMsgAnalytics: function (options) {
      if (options.scene == QQ_SCENE_FROM_TEMPLATE_MESSAGE_CARD && options.query && options.query._H_utm_campaign) {
        tplMsgStatsReport.pushStats(options.query._H_utm_campaign)
      }
      tplMsgStatsReport.reportStats()
    }
  })
}
