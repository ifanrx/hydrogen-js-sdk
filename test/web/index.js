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
        sms: {
          phone: '',
          code: '',
        }
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
          this.isLogin = true
        })
      },
      logout() {
        window.BaaS.auth.logout().then(res => {
          this.isLogin = false
          console.log(res)
        })
      },
      anonymousLogin() {
        BaaS.auth.anonymousLogin().then(res => {
          console.log(res)
        })
      },
      currentUser() {
        BaaS.auth.getCurrentUser().then(res => {
          console.log(res)
        })
      },
      requestPasswordReset() {
        BaaS.auth.requestPasswordReset({email: this.forgetPassword.email}).then(res => {
          console.log(res)
        })
      },
      updatePassword() {
        BaaS.auth.getCurrentUser().then(user => {
          user.updatePassword(this.passwordChangeForm).then(res => {
            console.log(res)
          })
        })
      },
      updateUserinfo() {
        BaaS.auth.getCurrentUser().then(user => {
          if (this.userInfoForm.username) {
            user.setUsername({
              username: this.userInfoForm.username,
              password: this.userInfoForm.password,
            }).then(res => {
              console.log(res)
            })
          } else if (this.userInfoForm.email) {
            user.setEmail({
              email: this.userInfoForm.email,
              password: this.userInfoForm.password,
            }, {sendVerificationEmail: false}).then(res => {
              console.log(res)
            })
          }
        })
      },
      requestEmailVerification() {
        BaaS.auth.getCurrentUser().then(user => {
          user.requestEmailVerification().then(res => {
            console.log(res)
          })
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
      sendSMSCode() {
        BaaS.sendSmsCode({phone: this.sms.phone}).then(res => {
          // success
          console.log(res)
        }).catch(err => {
          // err
          console.log(err)
        })
      },
      verifyPhone() {
        BaaS.verifySmsCode({phone: this.sms.phone, code: this.sms.code}).then(res => {
          console.log(res)
        })
      },
    },
    computed: {},
    mounted() {
      BaaS.auth.getCurrentUser().then(res => {
        console.log(res)
        this.isLogin = !!res
      })
    }
  })
}

window.addEventListener('load', init)
