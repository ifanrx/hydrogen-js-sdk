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

  it('检测 request 请求时请求头是否被正确设置/清空', () => {
    var header = request.setHeader();

    expect(header).to.have.property('X-Hydrogen-Client-ID');
    expect(header).to.have.property('X-Hydrogen-Client-Version');
    expect(header).to.have.property('X-Hydrogen-Client-Platform');

    return BaaS.init(BaaS.test.clientID).then((res) => {
      header = request.setHeader();

      expect(header['X-Hydrogen-Client-ID']).to.equal(BaaS.test.clientID);
      expect(header['X-Hydrogen-Client-Version']).to.equal(BaaS._config.VERSION);
      expect(header['X-Hydrogen-Client-Platform']).to.equal('UNKNOWN');
      expect(header['Authentication']).to.equal(BaaS._config.AUTH_PREFIX + ' ' + res.data.token);

      return BaaS.login();
    }).then(() => {
      return BaaS.logout();
    }).then(() => {
      header = request.setHeader();
      expect(BaaS.getAuthToken()).to.equal('');
      expect(header).to.not.have.property('Authentication');
    });
  });

  it('检测 doCreateRequestMethod 方法能否正确转换 methodMap 为相应的 BaaS API', () => {
    let methodMap = {
      getSuperman: {
        url: 'ifanr.com'
      },
      getBatman: {
        url: 'i.com'
      },
      getFlashman: {
        url: 'r.com'
      }
    };

    request.doCreateRequestMethod(methodMap);

    for (let key in methodMap) {
      expect(BaaS[key]).to.be.a('function');
    }
  });
});
