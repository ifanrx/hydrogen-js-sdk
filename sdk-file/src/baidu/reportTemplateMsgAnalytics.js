const tplMsgStatsReport = require('core-module/tplMsgStatsReport')
const BAIDU_SCENE_FROM_TEMPLATE_MESSAGE_CARD = 11310021
module.exports = BaaS => {
  Object.assign(BaaS, {
    reportTemplateMsgAnalytics: function (options) {
      if (options.scene == BAIDU_SCENE_FROM_TEMPLATE_MESSAGE_CARD && options.query && options.query._H_utm_campaign) {
        tplMsgStatsReport.pushStats(options.query._H_utm_campaign)
      }
      tplMsgStatsReport.reportStats()
    }
  })
}
