let GroupID = 1513076211190694
let MyContentGroup = new BaaS.ContentGroup(GroupID)

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
        modalText: '',
        modalTitle: '',
        isShowSuccessToast: false,
        isShowFailToast: false,
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
      showModal(title, content) {
        this.modalText = content
        this.modalTitle = title
        $('#myModal').modal('show')
      },
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
          this.showSuccessToast()
          this.contentList = res.data.objects
        }).catch(err => {
          console.log(err)
          this.showFailToast()
        })
      },

      getCategory: function () {
        const {cateList} = this
        if (cateList.length <= 1) return
        MyContentGroup.getCategory(cateList[1].id).then(res => {
          this.showSuccessToast()
          this.showModal(JSON.stringify(res.data))
        }, err => {
          this.showFailToast()
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
          this.showSuccessToast()
        }, (err) => {
          this.showFailToast()
        })
      },

      getContent: function () {
        const {contentList} = this
        if (!contentList.length) return
        MyContentGroup.getContent(contentList[0].id).then(res => {
          this.showModal(res.data.title, res.data.content)
          this.showSuccessToast()
        }, err => {
          this.showFailToast()
        })
      },
    },
    mounted() {
      this.getCategoryList()
    }
  })
}

window.addEventListener('load', init)