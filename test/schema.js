describe('schema', () => {
  it('#getTableList()', () => {
    expect(BaaS.getTableList).to.be.a('function');
  });
  it('#getTable()', () => {
    expect(BaaS.getTable).to.be.a('function');
  });
  it('#getRecordList()', () => {
    expect(BaaS.getRecordList).to.be.a('function');
  });
  it('#getRecord()', () => {
    expect(BaaS.getRecord).to.be.a('function');
  });
  it('#createRecord()', () => {
    expect(BaaS.createRecord).to.be.a('function');
  });
  it('#updateRecord()', () => {
    expect(BaaS.updateRecord).to.be.a('function');
  });
  it('#deleteRecord()', () => {
    expect(BaaS.deleteRecord).to.be.a('function');
  });
});
