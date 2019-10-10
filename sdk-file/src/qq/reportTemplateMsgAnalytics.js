const tplMsgStatsReport = require('core-module/tplMsgStatsReport')
const QQ_SCENE_FROM_TEMPLATE_MESSAGE_CARD = 1014
module.exports = BaaS => {
  Object.assign(BaaS, {

    /**
     * 上报模板消息卡片点击事件
     * @function
     * @since v2.2.1
     * @memberof BaaS
     * @param {any} options onShow 方法中的 options 参数
     */
    reportTemplateMsgAnalytics: function (options) {
      if (options.scene == QQ_SCENE_FROM_TEMPLATE_MESSAGE_CARD && options.query && options.query._H_utm_campaign) {
        tplMsgStatsReport.pushStats(options.query._H_utm_campaign)
      }
      tplMsgStatsReport.reportStats()
    }
  })
}
