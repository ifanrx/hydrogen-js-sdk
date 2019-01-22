(function () {
  window.BaaS_config = {
    content_groupID: 1534324665369752,
  }

  // 初始化
  window.BaaS.init('733b59d1b10ff4a37390')

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