let MyContentGroup = new BaaS.ContentGroup(window.BaaS_config.content_groupID)

const defaultCateList = [{
  name: '全部',
  id: 'all',
}]

function init() {
  new Vue({
    el: '#root',
    data() {
      return {
        cateList: defaultCateList,
        contentList: [],
        offset: 0,
        limit: 10,
        order_by: '',
        selectedCateID: 'all',
        selectedCateName: '全部',
      }
    },
    watch: {
      order_by() {
        this.queryContents()
      },
      limit() {
        this.queryContents()
      },
      offset() {
        this.queryContents()
      },
    },
    methods: {
      handleModifyNum(type, num) {
        this[type] += num
      },

      handleCateClick(id, name) {
        this.selectedCateID = id
        this.selectedCateName = name

        this.queryContents().then(res => {})
      },

      queryContents: function () {
        const {limit, offset, sortKey, selectedCateID} = this
        let query = new BaaS.Query()
        if (selectedCateID !== 'all') {
          query.arrayContains('categories', [selectedCateID])
        }
        return MyContentGroup.setQuery(query).orderBy(sortKey).limit(limit).offset(offset).find().then(res => {
          this.contentList = res.data.objects
          notie.alert({type: 1, text: '成功'})
        }).catch(err => {
          console.log(err)
          notie.alert({type: 3, text: '失败'})
        })
      },

      getCategory: function () {
        const {cateList} = this
        if (cateList.length <= 1) return
        MyContentGroup.getCategory(cateList[1].id).then(res => {
          notie.alert({type: 1, text: JSON.stringify(res.data)})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },

      getCategoryList() {
        MyContentGroup.getCategoryList().then(res => {
          this.cateList = defaultCateList.concat(res.data.objects)
        }).catch(err => console.log(err))
      },

      queryContentsByName: function () {
        const {contentList, sortKey, limit, offset} = this
        let query = new BaaS.Query()
        if (contentList.length < 1) return
        query.compare('title', '!=', contentList[0].title)
        MyContentGroup.setQuery(query).orderBy(sortKey).limit(limit).offset(offset).find().then((res) => {
          this.contentList = res.data.objects
          notie.alert({type: 1, text: '成功'})
        }, (err) => {
          notie.alert({type: 3, text: '失败'})
        })
      },

      getContent: function () {
        const {contentList} = this
        if (!contentList.length) return
        MyContentGroup.getContent(contentList[0].id).then(res => {
          this.showModal(res.data.title, res.data.content)
          notie.alert({type: 1, text: '成功'})
        }, err => {
          notie.alert({type: 3, text: '失败'})
        })
      },
    },
    mounted() {
      this.getCategoryList()
    }
  })
}

window.addEventListener('load', init)