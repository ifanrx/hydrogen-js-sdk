function init() {
  let Product = new window.BaaS.TableObject('auto_maintable')

  function showModal(v) {
    notie.alert({type: 2, text: v})
  }


  new Vue({
    el: '#root',
    data() {
      return {}
    },
    methods: {
      batchCreate: function () {
        Product.createMany([
          {
            num: 200,
            str: '5ae9d18eba648b7175c6c5cb'
          }, {
            num: 201,
            str: '5a2fa9b008443e59e0e67829'
          }, {
            rum: 203,
            str: '5a33406909a805412e3169c3'
          }
        ]).then(res => {
          showModal(JSON.stringify(res.data))
        }, err => {
          console.log(err)
        })
      },
      batchCreateNoTrigger() {
        Product.createMany([
          {
            num: 200,
            str: '5ae9d18eba648b7175c6c5cb'
          }, {
            num: 201,
            str: '5a2fa9b008443e59e0e67829'
          }, {
            rum: 203,
            str: '5a33406909a805412e3169c3'
          }
        ], {enableTrigger: false}).then(res => {
          showModal(JSON.stringify(res.data))
        }, err => {
          console.log(err)
        })
      },
      batchUpdate_compare: function () {
        let query = new window.BaaS.Query()
        query.compare('num', '>=', 200)
        let records = Product.getWithoutData(query)
        records.set('str', 'updated')
        records.update().then(res => {
          showModal(JSON.stringify(res.data))
        }, err => {
          console.log(err)
        })
      },
      batchUpdate_compare_noTrigger: function () {
        let query = new window.BaaS.Query()
        query.compare('num', '>=', 200)
        let records = Product.getWithoutData(query)
        records.set('str', 'updated')
        records.update({enableTrigger: false}).then(res => {
          showModal(JSON.stringify(res.data))
        }, err => {
          console.log(err)
        })
      },
      batchUpdate_str: function () {
        let query = new window.BaaS.Query()
        query.contains('str', 'a')
        // const regExp = /^1\d?/
        // query.matches('product_id', regExp)
        let records = Product.getWithoutData(query)
        records.set('num', 500)
        records.update().then(res => {
          showModal(JSON.stringify(res.data))
        }, err => {
          console.log(err)
        })
      },

      batchUpdate_arr: function () {
        let query = new window.BaaS.Query()
        // query.in('phone', [8])
        // query.notIn('phone', [3, 5])
        // query.arrayContains('phone', [4])
        query.compare('array_s', '=', ['a', 'b', 'c', 'd'])
        let records = Product.getWithoutData(query)
        records.set('str', 'update_arr')
        records.update().then(res => {
          showModal(JSON.stringify(res.data))
        }, err => {
          console.log(err)
        })
      },

      batchUpdate_null: function () {
        let query = new window.BaaS.Query()
        // query.isNull('product_id')
        // query.isNotNull('product_id')
        // query.exists('product_id')
        query.notExists('int')
        let records = Product.getWithoutData(query)
        records.set('str', 'update_null')
        records.update().then(res => {
          showModal(JSON.stringify(res.data))
        }, err => {
          console.log(err)
        })
      },

      batchUpdate_and_or: function () {
        let query1 = new window.BaaS.Query()
        const regExp = /^\w\d?/
        query1.matches('str', regExp)
        let query2 = new window.BaaS.Query()
        query2.compare('num', '>', 50)
        let andQuery = window.BaaS.Query.and(query1, query2)
        let records = Product.getWithoutData(andQuery)
        records.append('array_s', 'update_and_or')
        records.update().then(res => {
          showModal(JSON.stringify(res.data))
        }, err => {
          console.log(err)
        })
      },

      batchDelete: function () {
        let query = new window.BaaS.Query()
        query.compare('num', '>', 50)
        Product.limit(2).offset(0).delete(query).then(res => {
          showModal(JSON.stringify(res.data))
        }, err => {
          console.log(err)
        })
      },
      batchDeleteNoTrigger: function () {
        let query = new window.BaaS.Query()
        query.compare('num', '>', 50)
        Product.limit(2).offset(0).delete(query, {enableTrigger: false}).then(res => {
          showModal(JSON.stringify(res.data))
        }, err => {
          console.log(err)
        })
      },
      batchCreatePointer() {
        // Product.createMany([
        //   {
        //     pointer_userprofile: new window.BaaS.User().getWithoutData(pointer_userprofile_id)
        //   }, {
        //     pointer_test_order: new window.BaaS.TableObject('test_order').getWithoutData(pointer_test_order_id)
        //   }
        // ]).then(res => {
        //   showModal(JSON.stringify(res.data))
        // }, err => {
        //   console.log(err)
        // })
      }
    },
  })
}

window.addEventListener('load', init)