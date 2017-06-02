const API = BaaS._config.API;
const request = require('../src/request');

describe('request', () => {
  it('#request()', () => {
    expect(BaaS.request).to.be.a('function');
  });

  it('检测 request 函数是否能正常返回数据', () => {
    return BaaS.request({
      url: API.INIT,
      method: 'GET',
    }).then((res) => {
      expect(res).to.be.an('object');
    }).catch((err) => {
      console.error(err);
    });
  });
});
