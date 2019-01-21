function init() {
  const BaaS = window.BaaS

  new Vue({
    el: '#root',
    data() {
      return {
        isLogin: false,
        loginForm: {
          email: '',
          username: '',
          password: '',
        },
        registerForm: {
          email: '',
          username: '',
          password: '',
        },
        passwordChangeForm: {
          password: '',
          newPassword: ''
        },
        forgetPassword: {
          email: ''
        },
        userInfoForm: {
          email: '',
          username: '',
          password: '',
        },
        modalText: '',
      }
    },
    methods: {
      login() {
        window.BaaS.auth.login(_.pickBy(this.loginForm, v => !!v)).then(res => {
          console.log(res)
          this.isLogin = true
        })
      },
      register() {
        window.BaaS.auth.register(_.pickBy(this.registerForm, v => !!v)).then(res => {
          console.log(res)
        })
      },
      logout() {
        window.BaaS.auth.logout().then(res => {
          this.isLogin = false
        })
      },
      anonymousLogin() {
        BaaS.auth.anonymousLogin().then(res => {
          console.log(res)
        })
      },
      currentUser() {
        BaaS.auth.currentUser().then(res => {
          console.log(res)
        })
      },
      requestPasswordReset() {
        BaaS.auth.requestPasswordReset({email: this.forgetPassword.email}).then(res => {
          console.log(res)
        })
      },
      updatePassword() {
        BaaS.auth.currentUser().then(user => {
          user.updatePassword(this.passwordChangeForm).then(res => {
            this.$forceUpdate()
          })
        })
      },
      updateUserinfo() {
        BaaS.auth.currentUser().then(user => {
          if (this.userInfoForm.username) {
            user.updateUsername({
              username: this.userInfoForm.username,
              password: this.userInfoForm.password,
            }).then(res => {
              console.log(res)
            })
          } else if (this.userInfoForm.email) {
            user.updateEmail({
              email: this.userInfoForm.email,
              password: this.userInfoForm.password,
            }, {sendVerificationEmail: false}).then(res => {
              console.log(res)
            })
          }
        })
      },
      requestEmailVerification() {
        BaaS.auth.currentUser().then(user => {
          user.requestEmailVerification()
        })

      },
      showModal(content) {
        this.modalText = content
        $('#myModal').modal('show')
      },

      helloWorld() {
        BaaS.invokeFunction('helloWorld', undefined, false).then(res => {
          notie.alert({type: 1, text: JSON.stringify(res.data)})
        }, err => {
          notie.alert({type: 3, text: '请求失败'})
          console.log('err', err)
        })
      },

      testRequest: function () {
        BaaS.invokeFunction('testRequest').then(res => {
          notie.alert({type: 1, text: JSON.stringify(res.data)})
        }, err => {
          console.log('err', err)
          notie.alert({type: 3, text: '请求失败'})
        })
      },
    },
    computed: {},
    mounted() {
      BaaS.auth.currentUser().then(res => {
        console.log(res)
        this.isLogin = !!res
      })
    }
  })
}

window.addEventListener('load', init)
