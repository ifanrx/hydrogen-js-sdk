Component({
  properties: {
    disappearAfterClick: {
      type: Boolean,
      value: false,
    }
  },
  data: {
    tapped: false,
  },
  methods: {
    reportTicket: function (e) {
      wx.BaaS.wxReportTicket(e.detail.formId)
    },
    handleTap: function (e) {
      this.setData({
        tapped: true,
      })
    },
  },
})
