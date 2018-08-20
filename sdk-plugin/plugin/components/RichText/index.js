let wxParser = require('../../utils/wxParser/wxParser/index')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    html: {
      type: String,
      value: '',
      observer(newVal, oldVal, changedPath) {
        if (newVal) {
          this.initPage()
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    richText: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initPage() {
      let that = this
      try {
        wxParser.parse({
          bind: 'richText',
          html: this.data.html,
          target: that,
          enablePreviewImage: false,
          tapLink: (url) => {
            // do nothing
          },
        })
      } catch (e) {
        wxParser.parse({
          bind: 'richText',
          html: `<div>HTML 解析错误: ${e.message}</div>`,
          target: that,
        });
      }
    }
  },
})