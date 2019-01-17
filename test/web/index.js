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
        }
      }
    },
    methods: {
      login() {
        console.log(this.loginForm)
      },
      register() {

      },
      logout() {

      },
      forgetPwd() {

      },
      anonymousLogin() {
        BaaS.auth.anonymousLogin().then(res => {
          console.log(res)
        })
      }
    },
    mounted() {
      BaaS.init('123')
    }
  })
}

window.addEventListener('load', init)
