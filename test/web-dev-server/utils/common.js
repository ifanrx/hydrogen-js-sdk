(function () {
  window.BaaS_config = {
    content_groupID: 1534324665369752,
    pointer: {
      test_order: '5bbac56fbd66033df7fd0aa2',
      user: 61736923,
    }
  }

  // 初始化
  // window.BaaS.init('a4d2d62965ddb57fa4d6', {
  //   logLevel: 'debug',
  // })

  // // DEBUG config
  // BaaS._config.DEBUG = true;
  // BaaS.init('995140f59511a222c937', {logLevel: 'debug'});
  // BaaS._config.API_HOST = 'https://viac2-p.eng-vm.can.corp.ifanr.com';
  // BaaS._config.API_HOST_PATTERN = /^https:\/\/[\w-.]+\.ifanr\.com/;

  // QA
  BaaS.init('995140f59511a222c937', {
    // host: 'https://i-v5204.eng.szx.ifanrx.com/',
    host: 'https://v5204.eng.szx.ifanrx.com/',
    logLevel: 'debug',
  })

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
