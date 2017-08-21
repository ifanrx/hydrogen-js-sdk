
describe('baas', () => {
  it('判断 BaaS 对象是否只暴露预期内的方法和属性，保证 BaaS 对象干净和安全', () => {

    let expectBaaSProperties = ['auth', '_config', 'getAuthToken', 'isLogined', 'check', 'Promise', 'storage',
      'request', 'init', 'pay', 'login', 'logout', 'getTableList', 'getTable',
      'getRecordList', 'getRecord', 'createRecord', 'updateRecord', 'deleteRecord', 'getComplexQueryList',
      'getContentList', 'getContent', 'getContentGroupList', 'getContentGroup',
      'getContentCategory', 'order', 'uploadFile', 'getUserInfo', 'clearSession', 'test',
      'TableObject', 'Query', 'GeoPoint', 'GeoPolygon'
    ];
    let len = expectBaaSProperties.length;
    expect(Object.getOwnPropertyNames(BaaS).length).to.equal(len);

    while (len--) {
      expect(BaaS).to.have.property(expectBaaSProperties[len]);
    }

  });
});