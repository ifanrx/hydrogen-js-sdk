(function () {
  window.BaaS_config = {
    content_groupID: 1534324665369752,
    pointer: {
      test_order: '5bbac56fbd66033df7fd0aa2',
      user: 61736923,
    }
  }

  // 初始化
  window.BaaS.init('a4d2d62965ddb57fa4d6', {
    autoLogin: true,
    logLevel: 'debug',
  })

  // QA
  // window.BaaS.init('995140f59511a222c937', {
  //   autoLogin: true,
  //   host: 'https://i-v5204.eng.szx.ifanrx.com/',
  //   ws_host: 'wss://i-v5204.eng.szx.ifanrx.com/',
  // })

  // hook request
  var r = window.BaaS.request;
  window.BaaS.request = function () {
    return r.apply(BaaS, arguments).then(function (res) {
      notie.alert({type: 1, text: '成功'});
      return res;
    }).catch(function (res) {
      notie.alert({type: 3, text: typeof res.data === 'object' ? JSON.stringify(res.data) : res.status});
      throw res;
    })
  }
})()
