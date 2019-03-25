Component({
  properties: {},
  data: {},
  methods: {
    reportTicket: function (e) {
      wx.BaaS.wxReportTicket(e.detail.formId)
    },
  },
})
