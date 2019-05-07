function init() {
  const BaaS = window.BaaS

  new Vue({
    el: '#root',
    data() {
      return {
        isLogin: false,
        isAnonymousLogin: BaaS.storage.get('is_anonymous_user') == 1,
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
        BaaS.auth.anonymousLogin().then(user => {
          this.isAnonymousLogin = true
          console.log('user.toJSON ', user.toJSON())
          console.log('isAnonymousUser ', user.get('isAnonymousUser'))
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
          console.log('user', user.toJSON())
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
      thirdPartyLogin() {
        BaaS.auth.loginWithThirdParty('weibo', '/auth.html', {
          windowFeatures: `
            left=100,
            top=100,
            width=800,
            height=600,
            menubar=yes,
            resizable=yes,
            scrollbars=yes,
            status=yes
          `,
        })
          .then(res => {console.log(res)})
          .catch(err => console.log('err: ', err))
      },
      thirdPartyLoginIframe() {
        BaaS.auth.loginWithThirdParty('weibo', '/auth.html', {
          iframe: true,
          authModalStyle: {
            container: {
              background: 'gray',
            },
            iframe: {
              // background: 'red',
            },
            closeButton: {
              // right: '50%',
            }
          },
        })
          .then(res => {console.log(res)})
          .catch(err => console.log('err: ', err))
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
