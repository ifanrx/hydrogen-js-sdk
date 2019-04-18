const app = getApp()
Page({
  reportTicket: function (e) {
    let formID = e.detail.formId
    app.BaaS.wxReportTicket(formID).then(res => {
      showModal(JSON.stringify(res.data))
    }, err => {
      showFailToast()
    })
  },

  handleTap: function (e) {
    console.log('tap')
  },

  onClick: function (e) {
    console.log('click', e)
  },
})
