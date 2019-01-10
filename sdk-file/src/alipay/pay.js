const createPayFn = BaaS => (params) => {

}

module.exports = function (BaaS) {
  BaaS.pay = createPayFn(BaaS)
}
