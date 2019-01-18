let MyUser = new BaaS.User()

function init() {
  window.vueInstance = new Vue({
    el: '#root',
    data() {
      return {
        sortKey: '',
        limit: 10,
        offset: 0,
        userList: [],
      }
    },
    watch: {
      sortKey() {
        this.queryUsers()
      },
      limit() {
        this.queryUsers()
      },
      offset() {
        this.queryUsers()
      },
    },
    methods: {
      handleModifyNum(type, num) {
        this[type] += num
      },

      queryUsers: function () {
        const {sortKey, offset, limit} = this
        return MyUser.offset(offset).limit(limit).orderBy(sortKey).find().then(res => {
          Vue.set(this, 'userList', res.data.objects)
        }).catch(err => console.log(err))
      },

      getUserInfoLegacy: function () {
        const {userList} = this
        if (!userList.length) return
        BaaS.getUserInfo({
          userID: userList[0].id,
        }).then(res => {
          notie.force({type: 1, text: JSON.stringify(res.data)})
        })
      },

      userInfoFilter() {
        MyUser.select('nickname').find().then((res) => {
          notie.force({type: 1, text: JSON.stringify((res.data.objects))})
          console.log(res.data.objects)
        })
      },

      updateUser: function () {
        let currentUser = MyUser.getCurrentUserWithoutData()
        currentUser.set('age', parseInt(Math.random() * 100)).update().then(res => {
          notie.force({type: 1, text: 'age: ' + res.data.age})
        })
      },

      getUserInfo: function () {
        const {userList} = this
        if (!userList.length) return
        MyUser.get(userList[0].id).then(res => {
          notie.force({type: 1, text: JSON.stringify(res.data)})
          console.log(res.data)
        })
      },

      queryUserByUserID: function () {
        const {userList} = this
        if (!userList.length) return
        let query = new BaaS.Query()
        query.compare('user_id', '=', userList[0].id)
        MyUser.setQuery(query).find().then((res) => {
          Vue.set(this, 'userList', res.data.objects)
        })
      },

      queryAllUserByTableID: function () {
        let user = new BaaS.TableObject('_userprofile')
        user.find()
      },

      updateUserInfoNotCustomColumn: function () {
        let currentUser = MyUser.getCurrentUserWithoutData()
        currentUser.set('nickname', 'hello').update().then()
      },
    },
    mounted() {
      this.queryUsers()
    }
  })
}

window.addEventListener('load', init)