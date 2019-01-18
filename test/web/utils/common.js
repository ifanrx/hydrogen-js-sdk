(function () {
  window.BaaS_config = {
    content_groupID: 1538043206670160,
  }

  // 初始化
  window.BaaS.init('c2732ea16812760b8544')

  //
  window.BaaS._polyfill.getAPIHost = () => 'http://viac3.eng-vm.can.corp.ifanr.com'

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