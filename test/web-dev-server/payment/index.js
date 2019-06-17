function init() {
  new Vue({
    el: '#root',
    data() {
      return {
        qrCode: '',
      }
    },
    watch: {
    },
    methods: {
      checkPaymentStatus(tradeNo, resolve, reject) {
        let myOrder = new BaaS.Order()
        myOrder.getOrderList({
          trade_no: tradeNo,
        }).then (res => {
          if (!res.data.objects.length) {
            return reject('未找到订单')
          } else {
            let order = res.data.objects[0]
            if (order.status === 'success') {
              return resolve()
            }
            if (order.status === 'pending') {
              return void setTimeout(() => this.checkPaymentStatus(tradeNo, resolve, reject), 500)
            }
            reject('订单异常')
          }
        })
      },

      payWithWechatWap() {
        BaaS.payment.payWithWechat({
          gatewayType: 'weixin_tenpay_wap',
          totalCost: 0.01,
          merchandiseDescription: 'test-04',
        }).then(res => {
          window.location.href = res.data.mweb_url
        }).catch(err => console.log(err))
      },

      payWithWechatNative() {
        BaaS.payment.payWithWechat({
          gatewayType: 'weixin_tenpay_native',
          totalCost: 0.01,
          merchandiseDescription: 'test-04',
        }).then(res => {
          var qr = qrcode(0, 'M')
          qr.addData(res.data.code_url)
          qr.make()
          this.qrCode = qr.createDataURL()
          return new Promise((resolve, reject) => this.checkPaymentStatus(res.data.trade_no, resolve, reject))
        }).then(() => {
          alert('支付成功')
          console.log('支付成功')
        }).catch(err => console.log(err))
      },
    },
    mounted() {
    },
  })
}

window.addEventListener('load', init)
