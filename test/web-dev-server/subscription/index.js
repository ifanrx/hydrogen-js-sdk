const makeUid = () => {
  let _id = 1
  return () => {
    return _id++
  }
}
const whereId = makeUid()
const subscriptionId = makeUid()

var app = new Vue({
  el: '#root',
  data: {
    currentUser: null,
    username: 'abc',
    password: '123',

    eventOptions: ['create', 'update', 'delete'],

    // 表单
    tablename: 'auto_maintable',
    events: ['create', 'update', 'delete'],
    where: "",
    subscriptions: [],
  },
  methods: {
    login() {
      BaaS.auth.login({
        username: this.username,
        password: this.password,
      }).then((res) => {
        console.log(res)
        this.currentUser = res
      })
    },
    logout() {
      BaaS.auth.logout().then((res) => {
        console.log(res)
        this.currentUser = null
      })
    },
    register() {
      BaaS.auth.register({
        username: this.username,
        password: this.password,
      }).then(function (res) {
        console.log(res)
      })
    },
    subscribe() {
      if (!this.tablename) {
        notie.alert({type: 'warning', text: '表名不能为空'})
        return
      }
      if (this.events.length === 0) {
        notie.alert({type: 'warning', text: '至少选中一个事件'})
        return
      }

      const _tableobject = new BaaS.TableObject(this.tablename)
      const query = new BaaS.Query()
      let parsedWhere = {}
      if (this.where) {
        try {
          parsedWhere = JSON.parse(this.where)
        } catch {
          notie.alert({type: 'warning', text: '查询条件不是合法 JSON'})
          return
        }
      }
      query.queryObject = parsedWhere
      _tableobject.setQuery(query)

      this.events.forEach(event_type => {
        const id = subscriptionId()
        const item = {
          id,
          tablename: this.tablename,
          where: this.where,
          event_type,
          unsubscribe: null,
          subscribe_status: '连接中..',
          unsubscribe_status: '',
        }
        item.unsubscribe = _tableobject.subscribe(event_type, {
          oninit() {
            item.subscribe_status = '订阅成功'
          },
          onevent(etv) {
            console.log(`${event_type} 订阅推送==>`, etv)
          },
          onerror(err) {
            item.subscribe_status = '订阅失败'
            console.log(`${event_type} 订阅失败==>`, err.message)
          },
        }).unsubscribe

        this.subscriptions.push(item)
      })
    },

    unsubscribe(id) {
      const found = this.subscriptions.find(item => item.id === id)
      if (found && found.unsubscribe) {
        found.unsubscribe()
          .then(() => {
            console.log('取消订阅成功==>', found.id)
            found.unsubscribe_status = '取消订阅成功'
          })
          .catch(() => {
            console.log('取消订阅失败==>', found.id)
            found.unsubscribe_status = '取消订阅失败'
          })
      }
    },
  },
  mounted() {
    BaaS.auth.getCurrentUser().then((res) => {
      console.log(res)
      this.currentUser = res
    })
  },
})
