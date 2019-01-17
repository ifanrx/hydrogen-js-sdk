function printRequestResult() {
  return
}


function init() {
  const BaaS = window.BaaS

  new Vue({
    el: '#root',
    data() {
      return {
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
          new_password: ''
        },
        userInfoForm: {
          email: '',
          username: '',
        },
        modalText: '',
      }
    },
    methods: {
      login() {
        window.BaaS.auth.login(_.pickBy(this.loginForm, v => !!v)).then(res => {
          console.log(res)
        })
      },
      register() {
        window.BaaS.auth.register(_.pickBy(this.registerForm, v => !!v)).then(res => {
          console.log(res)
        })
      },
      logout() {
        window.BaaS.auth.logout().then(res => {
          console.log(res)
        })
      },
      forgetPwd() {
        window.BaaS.auth.requestPasswordReset().then(res => {
          console.log(res)
        })
      },
      anonymousLogin() {
        BaaS.auth.anonymousLogin().then(res => {
          console.log(res)
        })
      },
      currentUser() {
        console.log(BaaS.auth.currentUser())
      },
      requestPasswordReset() {
        BaaS.auth.requestPasswordReset().then(res => {
          console.log(res)
        })
      },
      updatePassword() {
        let user = BaaS.auth.currentUser()
        user.updatePassword(_.pickBy(this.passwordChangeForm, v => !!v)).then(res => {
          console.log(res)
        })
      },
      updateUserinfo() {
        let user = BaaS.auth.currentUser()
        if (this.userInfoForm.username) {
          user.updateUsername(this.userInfoForm.username).then(res => {
            console.log(res)
          })
        } else if (this.userInfoForm.email) {
          user.updateEmail(this.userInfoForm.email, true).then(res => {
            console.log(res)
          })
        }
      },
      showModal(content) {
        this.modalText = content
        $('#myModal').modal('show')
      },
      helloWorld() {
        BaaS.invokeFunction('helloWorld', undefined, false).then(res => {
          if (res.code === 0) {
            // success
            this.showModal(JSON.stringify(res.data))
          } else {
            // faile
            this.showModal(JSON.stringify(res))
          }
        }, err => {
          console.log('err', err)
        })
      },

      testRequest: function() {
        BaaS.invokeFunction('testRequest').then(res => {
          this.showModal(JSON.stringify(res.data))
        }, err => {
          console.log('err', err)
          this.showModal(JSON.stringify(err))
        })
      }
    },
    mounted() {
      window.BaaS.init('c2732ea16812760b8544')
    }
  })
}

window.addEventListener('load', init)
