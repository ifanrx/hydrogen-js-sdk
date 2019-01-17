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
      showModal(result) {
        this.modalText = result
        $('#myModal').modal('show')
      },
      showFailToast(text) {
        text && (this.errorText = text);
        alert(this.errorText)
      },
      createRecords() {
        return Product.createMany(data)
          .then(res => {
            if (res.data.succeed == data.length) {
              console.log('创建数据成功')
            }
          })
          .catch(err => console.log('创建数据失败'))
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
            alert('初始化数据成功')
          })
          .catch(() => {
            alert('初始化数据失败')
          })
      },
      getAllProduct() {
        // wx.showLoading()
        Product.find().then(res => {
          this.recrods = res.data.objects
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          this.showModal(result)
        }, err => {
          this.showFailToast()
        }).then(res => {
          // wx.hideLoading()
        })
      },
      getProduct() {
        if (!this.records.length) return
        const {records} = this.data
        if (!records.length) return
        // wx.showLoading()
        Product.get(records[0].id).then(res => {
          // wx.hideLoading()
          let result = `查询成功-ID为：${res.data.id}`
          this.showModal(result)
        }, err => {
          // wx.hideLoading()
          this.showFailToast()
        })
      },
      getProductBySelect_asc() {
        const {records} = this
        if (!records.length) return
        Product.select('str').get(records[0].id).then(res => {
          let result = `查询成功-str：${res.data.str}`
          this.showModal(result)
        }, err => {
          this.showFailToast()
        })
      },
      getProductBySelect_desc() {
        const {records} = this
        if (!records.length) return
        Product.select(['-str', '-array_i']).get(records[0].id).then(res => {
          let result = `All keys：[${Object.keys(res.data)}]`
          this.showModal(result)
        }, err => {
          this.showFailToast()
        })
      },
      compareQuery(type) {
        let query = new BaaS.Query()
        query.compare('int', type, 50)
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          this.showModal(result)
        }, err => {
          this.showFailToast()
        })
      },
      containsQuery() {
        let query = new BaaS.Query()
        query.contains('str', 'm')
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          this.showModal(result)
        }, err => {
          this.showFailToast()
        })
      },
      regxQuery(type) {
        let query = new BaaS.Query()
        let regx = type === 'str' ? /^a/ : new RegExp(/^q/, 'i')
        query.matches('str', regx)
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          this.showModal(result)
        }, err => {
          this.showFailToast()
        })
      },
      inQuery() {
        let query = new BaaS.Query()
        query.in('array_s', ['黑', '白'])
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          this.showModal(result)
        }, err => {
          this.showFailToast()
        })
      },
      notInQuery: function () {
        let query = new BaaS.Query()
        query.notIn('array_s', ['灰'])
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          this.showModal(result)
        }, err => {
          this.showFailToast()
        })
      },
      arrayContainsQuery: function () {
        let query = new BaaS.Query()
        query.arrayContains('array_s', ['黑', '白', '灰'])
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          this.showModal(result)
        }, err => {
          this.showFailToast()
        })
      },
      compareQuery_2() {
        let query = new BaaS.Query()
        query.compare('array_s', '=', ['a', 'b', 'c', 'd'])
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          this.showModal(result)
        }, err => {
          this.showFailToast()
        })
      },
      nullQuery: function () {
        let query = new BaaS.Query()
        query.isNull('int')
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          this.showModal(result)
        }, err => {
          this.showFailToast()
        })
      },
      notNullQuery: function () {
        let query = new BaaS.Query()
        query.isNotNull('int')
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          this.showModal(result)
        }, err => {
          this.showFailToast()
        })
      },
      // sdk version >= 1.1.1
      existsQuery: function () {
        let query = new BaaS.Query()
        query.exists(['str', 'int'])
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          this.showModal(result)
        }, err => {
          this.showFailToast()
        })
      },

      notExistsQuery: function () {
        let query = new BaaS.Query()
        query.notExists('int')
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          this.showModal(result)
        }, err => {
          this.showFailToast()
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
          this.showModal(result)
        }, err => {
          this.showFailToast()
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
          this.showFailToast()
        }).then(res => {})
      },

      selectQuery: function () {
        Product.select(['num']).find().then(res => {
          this.showModal(JSON.stringify(res.data.objects))
          this.showSuccessToast()
        }, err => {
          this.showFailToast()
        })
      },

      unselectQuery: function () {
        Product.select(['-array_s', '-str', '-file']).find().then(res => {
          this.showModal(JSON.stringify(res.data.objects))
        }, err => {
          this.showFailToast()
        })
      },

      expandCreated_by: function () {
        Product.expand('created_by').find().then(res => {
          this.showModal('created_by: ' + JSON.stringify(res.data.objects[0].created_by))
        }, err => {
          this.showFailToast()
        })
      },

      getExpand: function () {
        const {records} = this
        if (!records.length) return
        Product.expand('created_by').get(records[0].id).then(res => {
          this.showModal('created_by: ' + JSON.stringify(res.data.created_by))
        }, err => {
          this.showFailToast()
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
          this.showModal(result)
        }, err => {
          this.showFailToast()
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
          this.showModal(result)
        }, err => {
          this.showFailToast()
        })
      },

      hasKey(){
        let query = new BaaS.Query()
        query.hasKey('obj', 'num')
        Product.setQuery(query).find().then(res => {
          let result = `查询成功-总记录数为：${res.data.meta.total_count}`
          this.showModal(result)
        }, err => {
          this.showFailToast()
        })
      },

      countItem(){
        let query = new BaaS.Query()
        Product.setQuery(query).count().then(res => {
          this.showModal(JSON.stringify(res))
        }, err => {
          this.showFailToast()
        })
      }
    },
  })
}

window.addEventListener('load', init)