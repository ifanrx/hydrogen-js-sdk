/*
 * 以下代码由于没使用构建工具，请使用 es5 语法
 */

function init() {
  var BaaS = window.BaaS

  BaaS.auth.getRedirectResult()
    .then(function (result) {
      if (result.status === 'success') {
        vm.isLogin = true
      }
      notie.alert({type: 1, text: '登录成功'});
      console.log(result)
    })
    // .then(function (result) {console.log(result);alert(JSON.stringify(result))})
    .catch(function (err) {console.log(err)})

  var vm = new Vue({
    el: '#root',
    data: function () {
      return {
        isLogin: false,
        isAnonymousLogin: BaaS.storage.get('is_anonymous_user') == 1,
        loginForm: {
          email: '',
          username: '',
          password: '',
          phone: '',
        },
        registerForm: {
          email: '',
          username: '',
          password: '',
          phone: '',
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
      login: function () {
        window.BaaS.auth.login(_.pickBy(vm.loginForm, function (v) {return !!v})).then(function (res) {
          console.log(res)
          vm.isLogin = true
        })
      },
      register: function () {
        window.BaaS.auth.register(_.pickBy(vm.registerForm, function (v) {return !!v})).then(function (res) {
          console.log(res)
          vm.isLogin = true
        })
      },
      logout: function () {
        window.BaaS.auth.logout().then(function (res) {
          vm.isLogin = false
          console.log(res)
        })
      },
      anonymousLogin: function () {
        BaaS.auth.anonymousLogin().then(function (user) {
          vm.isAnonymousLogin = true
          console.log('user.toJSON ', user.toJSON())
          console.log('isAnonymousUser ', user.get('isAnonymousUser'))
        })
      },
      currentUser: function () {
        BaaS.auth.getCurrentUser().then(function (res) {
          console.log(res)
        })
      },
      requestPasswordReset: function () {
        BaaS.auth.requestPasswordReset({email: vm.forgetPassword.email}).then(function (res) {
          console.log(res)
        })
      },
      updatePassword: function () {
        BaaS.auth.getCurrentUser().then(function (user) {
          user.updatePassword(vm.passwordChangeForm).then(function (res) {
            console.log(res)
          })
        })
      },
      updateUserinfo: function () {
        BaaS.auth.getCurrentUser().then(function (user) {
          console.log('user', user.toJSON())
          if (vm.userInfoForm.username) {
            user.setUsername({
              username: vm.userInfoForm.username,
              password: vm.userInfoForm.password,
            }).then(function (res) {
              console.log(res)
            })
          } else if (vm.userInfoForm.email) {
            user.setEmail({
              email: vm.userInfoForm.email,
              password: vm.userInfoForm.password,
            }, {sendVerificationEmail: false}).then(function (res) {
              console.log(res)
            })
          }
        })
      },
      requestEmailVerification: function () {
        BaaS.auth.getCurrentUser().then(function (user) {
          user.requestEmailVerification().then(function (res) {
            console.log(res)
          })
        })

      },
      showModal: function (content) {
        vm.modalText = content
        $('#myModal').modal('show')
      },

      helloWorld: function () {
        BaaS.invokeFunction('helloWorld', undefined, false).then(function (res) {
          notie.alert({type: 1, text: JSON.stringify(res.data)})
        }, function (err) {
          notie.alert({type: 3, text: '请求失败'})
          console.log('err', err)
        })
      },

      testRequest: function () {
        BaaS.invokeFunction('testRequest').then(function (res) {
          notie.alert({type: 1, text: JSON.stringify(res.data)})
        }, function (err) {
          console.log('err', err)
          notie.alert({type: 3, text: '请求失败'})
        })
      },
      sendSMSCode: function () {
        BaaS.sendSmsCode({phone: vm.sms.phone}).then(function (res) {
          // success
          console.log(res)
        }).catch(function (err) {
          // err
          console.log(err)
        })
      },
      verifyPhone: function () {
        BaaS.verifySmsCode({phone: vm.sms.phone, code: vm.sms.code}).then(function (res) {
          console.log(res)
        })
      },
      linkThirdPartyRedirect: function () {
        BaaS.auth.getCurrentUser().then(function (user) {
          return user.linkThirdParty('oauth-wechat-mp', '/auth.html', {
            debug: true,
            mode: 'redirect',
          })
        })
          .then(function (res) {console.log(res)})
          .catch(function (err) {console.log('err: ', err)})
      },
      thirdPartyLogin: function () {
        BaaS.auth.loginWithThirdParty('oauth-wechat-web', '/auth.html', {
          debug: true,
          mode: 'popup-window',
          createUser: true,
          syncUserProfile: 'overwrite',
          windowFeatures: 'left=100,top=100,width=800,height=600,menubar=yes,resizable=yes,scrollbars=yes,status=yes',
        })
          .then(function (res) {
            console.log('third party login success (window):', res)
            vm.isLogin = true
          })
          .catch(function (err) {console.log('err: ', err)})
      },
      thirdPartyLoginRedirect: function () {
        BaaS.auth.loginWithThirdParty('oauth-wechat-mp', './auth.html', {
          debug: true,
          mode: 'redirect',
          createUser: true,
        })
          .then(function (res) {console.log(res)})
          .catch(function (err) {console.log('err: ', err)})
      },
      thirdPartyLoginIframe: function () {
        BaaS.auth.loginWithThirdParty('oauth-wechat-web', '/auth.html', {
          mode: 'popup-iframe',
          debug: true,
          createUser: true,
          authModalStyle: {
            container: {
              background: 'rgba(0, 0, 0, .5)',
              paddingTop: '50px',
            },
            iframe: {
              // background: 'red',
            },
            closeButton: {
              // right: '50%',
            }
          },
          wechatIframeContentStyle: {
            style: 'white',
            href: 'https://localhost:40035/wechat-iframe.css',
          }
        })
          .then(function (res) {
            console.log('third party login success (window):', res)
            vm.isLogin = true
          })
          .catch(function (err) {console.log('err: ', err)})
      },

      getSmsCode() {
        BaaS.sendSmsCode({phone: vm.sms.phone}).then(() => {
          // success
        }).catch(err => {
          notie.alert({type: 3, text: '请求失败'})
        })
      },

      loginWithMobilePhone() {
        BaaS.auth.loginWithSmsVerificationCode(vm.sms.phone, vm.sms.code).then(user => {
          console.log(user)
        }).catch(err => {
          notie.alert({type: 3, text: '请求失败'})
        })
      },

      verifyMobilePhone() {
        BaaS.auth.getCurrentUser().then(function (user) {
          return user.verifyMobilePhone(vm.sms.code)
        }).catch(err => {
          notie.alert({type: 3, text: '请求失败'})
        })
      },

      setMobilePhone() {
        BaaS.auth.getCurrentUser().then(function (user) {
          return user.setMobilePhone(vm.sms.phone)
        }).catch(err => {
          notie.alert({type: 3, text: '请求失败'})
        })
      },

      getServerDate() {
        BaaS.getServerDate().then(function (res) {
          notie.alert({type: 1, text: res.data.time})
        })
      },
    },
    computed: {},
    mounted: function () {
      BaaS.auth.getCurrentUser().then(function (res) {
        console.log(res)
        vm.isLogin = true
      })
    }
  })
}

window.addEventListener('load', init)
