let Table = new BaaS.TableObject('auto_maintable')
const valueGenerator = {
  string() {return Math.random().toString(36).substring(2, 8)},
  integer() {return Math.round(Math.random() * 100)},
  number() {return Math.random() * 100},
  boolean() {return Math.random() > 0.5},
  array_string() {return [this.string(), this.string()]},
  array_integer() {return [this.integer(), this.integer()]},
  array_number() {return [this.number(), this.number()]},
  array_boolean() {return [this.boolean(), this.boolean()]},
  date() {return ((new Date()).toISOString()).toString()},
  polygon() {
    return new BaaS.GeoPolygon([[10.123, 10], [20.12453, 10], [30.564654, 20], [20.654, 30], [10.123, 10]])
  },
  point() {return new BaaS.GeoPoint(10.123, 8.543)},
}

let object = {'a':'b','c':['d','array','dog'],'f':{'f':123.44}}

function init() {
  new Vue({
    el: '#root',
    data() {
      return {
        record: '',
        isShowSuccessToast: false,
        isShowFailToast: false,
      }
    },
    methods: {
      showSuccessToast() {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.isShowSuccessToast = true
        this.timer = setTimeout(() => {
          this.isShowSuccessToast = false
        }, 2000)
      },

      showFailToast() {
        if (this.timerFail) {
          clearTimeout(this.timerFail)
        }
        this.isShowFailToast = true
        this.timerFail = setTimeout(() => {
          this.isShowFailToast = false
        }, 2000)
      },

      checkRecordFieldsEql(options, recordData) {
        const keys = Object.keys(options)
        return keys.every(key => this.checkRecordFieldEql(key, options[key], recordData[key]))
      },

      checkRecordFieldEql(key, optionValue, recordDataValue) {
        const check = () => {
          if (key === 'date') {
            return new Date(optionValue).getTime() === new Date(recordDataValue).getTime()
          } else if (key == 'geo_point' || key == 'geo_polygon') {
            return deepEql(optionValue.geoJSON, recordDataValue)
          } else if (key == 'file') {
            console.warn('暂时无法检测返回的 file 数据是否是用户设置的数据')
            return !!recordDataValue
          }
          return deepEql(optionValue, recordDataValue)
        }
        if (check()) {
          return true
        } else {
          console.error(`'${JSON.stringify(optionValue)}' not equal to '${JSON.stringify(recordDataValue)}'`)
          return false
        }
      },

      createRecordA() {
        let record = Table.create()

        let options = {
          str: valueGenerator.string(),
          int: valueGenerator.integer(),
          num: valueGenerator.number(),
          boo: valueGenerator.boolean(),
          array_i: valueGenerator.array_integer(),
          array_n: valueGenerator.array_number(),
          array_b: valueGenerator.array_boolean(),
          array_s: valueGenerator.array_string(),
          date: valueGenerator.date(),
          geo_polygon: valueGenerator.polygon(),
          geo_point: valueGenerator.point(),
          obj: object,
        }
        record.set(options)
        // record.set(options)  // bug: geo 类型的字段，set 两次后，值错误
        record.save().then(res => {
          if (!this.checkRecordFieldsEql(options, res.data)) {
            throw new Error()
          }
          this.showSuccessToast()
          this.recrod = res.data
        }).catch(err => {
          console.log(err)
          this.showFailToast()
        })
      },

      createRecordB() {
        let record = Table.create()
        let options = {
          str: valueGenerator.string(),
          int: valueGenerator.integer(),
          num: valueGenerator.number(),
          boo: valueGenerator.boolean(),
          array_i: valueGenerator.array_integer(),
          array_n: valueGenerator.array_number(),
          array_b: valueGenerator.array_boolean(),
          array_s: valueGenerator.array_string(),
          date: valueGenerator.date(),
          geo_polygon: valueGenerator.polygon(),
          geo_point: valueGenerator.point(),
          obj: object,
        }
        record.set('str', options.str)
        record.set('int', options.int)
        record.set('num', options.num)
        record.set('boo', options.boo)
        record.set('array_i', options.array_i)
        record.set('array_n', options.array_n)
        record.set('array_b', options.array_b)
        record.set('array_s', options.array_s)
        record.set('date', options.date)
        record.set('geo_point', options.geo_point)
        record.set('geo_polygon', options.geo_polygon)
        record.set('obj', options.obj)

        record.save().then(res => {
          if (!this.checkRecordFieldsEql(options, res.data)) {
            throw new Error()
          }
          this.showSuccessToast()
          this.recrod = res.data
        }).catch(err => {
          console.log(err)
          this.showFailToast()
        })
      },

      deleteRecord: function () {
        if (!this.recrod) return
        Table.delete(this.data.record.id).then(res => {
          this.showSuccessToast()
          this.record = null
        }, err => {
          this.showFailToast()
        })
      },

      updateRecord: function () {
        let record = Table.getWithoutData(this.data.record.id)
        const key = 'int'
        const value = 100
        record.set(key, value)
        record.update().then(res => {
          if (!this.checkRecordFieldEql(key, value, res.data[key])) {
            throw new Error()
          }
          this.showSuccessToast()
          this.record = res.data
        }, err => {
          this.showFailToast()
        })
      },

      increment(key, value) {
        Table.getWithoutData(this.data.record.id).incrementBy(key, value).update().then(res => {
          this.checkRecordFieldEql(key, this.data.record.int + value, res.data[key])
          this.record = res.data
          this.showSuccessToast()
        }, err => {
          this.showFailToast()
        })
      },

      minusOne: function () {
        this.increment('int', -1)
      },

      plusOne: function () {
        this.increment('int', 1)
      },

      addItemToArray(key, value) {
        if (!Array.isArray(value)) {
          value = [value]
        }
        return Table.getWithoutData(this.data.record.id).append(key, value).update().then(res => {
          if (!this.checkRecordFieldEql(key, this.data.record[key].concat(value), res.data[key])) {
            throw new Error()
          }
          this.record = res.data
          this.showSuccessToast()
        }, err => {
          this.showFailToast()
        })

      },

      patchObject() {
        let record = Table.getWithoutData(this.data.record.id)
        record.patchObject('obj', { num: Math.ceil(Math.random() * 1000) })
        record.update().then(res => {
          this.record = res.data
          this.showSuccessToast()
        }, err => {
          this.showFailToast()
        })
      },
    },
    beforeDestroy() {
      clearTimeout(this.timer)
      clearTimeout(this.timerFail)
    },
  })
}

window.addEventListener('load', init)