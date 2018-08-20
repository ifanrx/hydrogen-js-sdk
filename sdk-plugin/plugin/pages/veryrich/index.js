// plugin/pages/veryrich/index.js
const API_HOST = 'https://sso.ifanr.com/'
const RENDER_TYPE_RICH_TEXT = 'richtext'
const RENDER_TYPE_WEB_VIEW = 'webPage'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    renderType: '',
    webViewURL: '',
    richText: '',
    errMsg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      ad_config
    } = options
    wx.request({
      url: API_HOST + 'api/veryrich/config',
      data: {
        ad_config: ad_config
      },
      success: (res) => {
        if (res.statusCode != 200) {
          return this.setData({
            errMsg: '接口请求错误: ' + (res.data ? res.data.error_msg : res.statusCode)
          })
        }

        let type = res.data.type

        this.setData({
          renderType: type
        })

        if (type === RENDER_TYPE_RICH_TEXT) {
          this.initRichTextPage(res.data.data)
        } else if (type === RENDER_TYPE_WEB_VIEW) {
          this.initWebViewPage(res.data.data)
        } else {
          this.setData({
            errMsg: '请升级插件版本。 UNKNOWN TYPE：' + type
          })
        }
      },
      fail: () => {
        this.setData({
          errMsg: '请求错误'
        })
      }
    })
  },

  initRichTextPage(html) {
    this.setData({
      richText: html
    })
  },

  initWebViewPage(url) {
    this.setData({
      webViewURL: url
    })
  }
})