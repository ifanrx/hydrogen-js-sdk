let Product = new BaaS.TableObject('auto_maintable')

function init() {
  new Vue({
    el: '#root',
    data() {
      return {
        records: [],
        modalText: 'slasldfadhald;',
        errorText: '请求失败，请重试',
        order_by: '',
        limit: 10,
        offset: 0,
      }
    },
    methods: {
      createRecords() {
        return Product.createMany(data)
          .then(res => {
            if (res.data.succeed == data.length) {
              notie.alert({type: 1, text: '创建数据成功'})
            }
          })
          .catch(err => {
            notie.alert({type: 3, text: '创建数据失败'})
          })
      },
      deleteAllRecords() {
        const query = new BaaS.Query()
        return new Promise((resolve, reject) => {
          const deleteRecord = () => {
            Product.limit(1000).offset(0).delete(query).then(res => {
              if (!!res.data.next) {
                deleteRecord()
              } else {
                resolve()
              }
            }).catch(err => reject(err))
          }
          deleteRecord()
        })
      },
      handleResetData() {
        this.deleteAllRecords()
          .then(this.createRecords)
          .then(() => {
            notie.alert({type: 1, text: '初始化数据成功'})
          })
          .catch(() => {
            notie.alert({type: 3, text: '初始化数据失败'})
          })
      },
      getAllProduct() {
        Product.find().then(res => {
          this.recrods = res.data.objects
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          notie.alert({type: 1, text: result})
        }, err => {
          notie.alert({type: 3, text: '查询失败'})
        })
      },
      getProduct() {
        if (!this.records.length) return
        const {records} = this.data
        if (!records.length) return
        Product.get(records[0].id).then(res => {
          let result = `查询成功-ID为：${res.data.id}`
          notie.alert({type: 1, text: result})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },
      getProductBySelect_asc() {
        const {records} = this
        if (!records.length) return
        Product.select('str').get(records[0].id).then(res => {
          let result = `查询成功-str：${res.data.str}`
          notie.alert({type: 1, text: result})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },
      getProductBySelect_desc() {
        const {records} = this
        if (!records.length) return
        Product.select(['-str', '-array_i']).get(records[0].id).then(res => {
          let result = `All keys：[${Object.keys(res.data)}]`
          notie.alert({type: 1, text: result})
        }, err => {
          notie.alert({type: 3, text: '初始化数据成功'})
        })
      },
      compareQuery(type) {
        let query = new BaaS.Query()
        query.compare('int', type, 50)
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          notie.alert({type: 1, text: result})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },
      containsQuery() {
        let query = new BaaS.Query()
        query.contains('str', 'm')
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          notie.alert({type: 1, text: result})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },
      regxQuery(type) {
        let query = new BaaS.Query()
        let regx = type === 'str' ? /^a/ : new RegExp(/^q/, 'i')
        query.matches('str', regx)
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          notie.alert({type: 1, text: result})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },
      inQuery() {
        let query = new BaaS.Query()
        query.in('array_s', ['黑', '白'])
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          notie.alert({type: 1, text: result})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },
      notInQuery: function () {
        let query = new BaaS.Query()
        query.notIn('array_s', ['灰'])
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          notie.alert({type: 1, text: result})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },
      arrayContainsQuery: function () {
        let query = new BaaS.Query()
        query.arrayContains('array_s', ['黑', '白', '灰'])
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          notie.alert({type: 1, text: result})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },
      compareQuery_2() {
        let query = new BaaS.Query()
        query.compare('array_s', '=', ['a', 'b', 'c', 'd'])
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          notie.alert({type: 1, text: result})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },
      nullQuery: function () {
        let query = new BaaS.Query()
        query.isNull('int')
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          this.showModal(result)
          notie.alert({type: 1, text: result})
        }, err => {
          this.showFailToast()
          notie.alert({type: 3, text: '失败'})
        })
      },
      notNullQuery: function () {
        let query = new BaaS.Query()
        query.isNotNull('int')
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          notie.alert({type: 1, text: result})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },
      // sdk version >= 1.1.1
      existsQuery: function () {
        let query = new BaaS.Query()
        query.exists(['str', 'int'])
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          notie.alert({type: 1, text: result})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },

      notExistsQuery: function () {
        let query = new BaaS.Query()
        query.notExists('int')
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          notie.alert({type: 1, text: result})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },

      complexQueryProduct: function () {
        let query1 = new BaaS.Query()
        query1.compare('int', '>', 50)
        let query2 = new BaaS.Query()
        query2.isNotNull('str')
        let andQuery = BaaS.Query.and(query1, query2)
        let query3 = new BaaS.Query()
        query3.in('array_s', ['黑'])
        let orQuery = new BaaS.Query.or(andQuery, query3)
        Product.setQuery(orQuery).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          notie.alert({type: 1, text: result})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },

      handleModifyNum(type, num) {
        this[type] += num
      },
      getAllProductWithOptions() {
        const {order_by, offset, limit} = this
        Product.offset(offset).limit(limit).orderBy(order_by).find().then(res => {
          this.recrods = res.data.objects
        }, err => {
          notie.alert({type: 3, text: '失败'})
        }).then(res => {})
      },

      selectQuery: function () {
        Product.select(['num']).find().then(res => {
          notie.alert({type: 1, text: JSON.stringify(res.data.objects)})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },

      unselectQuery: function () {
        Product.select(['-array_s', '-str', '-file']).find().then(res => {
          notie.alert({type: 1, text: JSON.stringify(res.data.objects)})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },

      expandCreated_by: function () {
        Product.expand('created_by').find().then(res => {
          notie.alert({type: 1, text: 'created_by: ' + JSON.stringify(res.data.objects[0].created_by)})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },

      getExpand: function () {
        const {records} = this
        if (!records.length) return
        Product.expand('created_by').get(records[0].id).then(res => {
          notie.alert({type: 1, text: 'created_by: ' + JSON.stringify(res.data.created_by)})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },
      queryByTime1: function () {
        let query = new BaaS.Query()
        let startTimestamp = (new Date()).setHours(0, 0, 0, 0) / 1000
        let endTimestamp = startTimestamp + 24 * 60 * 60
        query.compare('created_at', '>=', startTimestamp)
        query.compare('created_at', '<', endTimestamp)
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          notie.alert({type: 1, text: result})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },

      queryByTime2: function () {
        let query = new BaaS.Query()

        let timestamp = (new Date(2018, 0, 1)).setHours(0, 0, 0, 0)
        query.compare('date', '<=', (new Date(timestamp)).toISOString())

        // let startTimestamp = new Date().setHours(0, 0, 0, 0)
        // let endTimestamp = startTimestamp + 24 * 60 * 60 * 1000
        // query.compare('duedate', '>=', (new Date(startTimestamp)).toISOString())
        // query.compare('duedate', '<', (new Date(endTimestamp)).toISOString())
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          notie.alert({type: 1, text: result})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },

      hasKey(){
        let query = new BaaS.Query()
        query.hasKey('obj', 'num')
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          notie.alert({type: 1, text: result})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },

      countItem(){
        let query = new BaaS.Query()
        Product.setQuery(query).count().then(res => {
          notie.alert({type: 1, text: JSON.stringify(res)})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      }
    },
  })
}

window.addEventListener('load', init)