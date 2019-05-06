(function () {
  window.BaaS_config = {
    content_groupID: 1534324665369752,
    pointer: {
      test_order: '5bbac56fbd66033df7fd0aa2',
      user: 61736923,
    }
  }

  // 初始化
  // window.BaaS.init('733b59d1b10ff4a37390', {
  //   logLevel: 'debug',
  // })

  // DEBUG config
  BaaS._config.DEBUG = true
  BaaS.init('995140f59511a222c937', {logLevel: 'debug'})
  BaaS._config.API_HOST = 'https://viac2-p.eng-vm.can.corp.ifanr.com'
  BaaS._config.API_HOST_PATTERN = /^https:\/\/[\w-.]+\.ifanr\.com/

  // hook request
  let r = window.BaaS.request
  window.BaaS.request = function () {
    return r.apply(BaaS, arguments).then(res => {
      notie.alert({type: 1, text: '成功'})
      return res
    }).catch(res => {
      notie.alert({type: 3, text: typeof res.data === 'object' ? JSON.stringify(res.data) : res.status})
      throw res
    })
  }
})()
