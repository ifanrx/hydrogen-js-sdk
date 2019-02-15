// eslint-disable-next-line no-unused-vars
const createPayFn = BaaS => (params) => {

}

module.exports = function (BaaS) {
  BaaS.pay = createPayFn(BaaS)
}
