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
    where: '',
    subscriptions: [],
  },
  methods: {
    async getFile(event) {
      const MyFile = new BaaS.File()
      const [fileObj] = event.target.files
      const fileParams = {
        fileObj,
      }
      const metadata = {
        // categoryID: '64896d567d5ed6f0ff76215c',
        categoryName: 'jiajun',
      }
      try {
       const res = await MyFile.multipartUpload(fileParams, metadata)
       notie.alert({type: 1, text: '上传成功'});
       console.log('res', res)
      } catch (error) {
        notie.alert({type: 3, text: '上传失败'});
        console.log('vue error', error);
      }
    },
  },
  mounted() {
    BaaS.auth.getCurrentUser().then(res => {
      console.log(res)
      this.currentUser = res
    })
  },
})
