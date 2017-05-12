describe('content', () => {
  it('#getContentList()', () => {
    expect(BaaS.getContentList).to.be.a('function');
  });
  it('#getContent()', () => {
    expect(BaaS.getContent).to.be.a('function');
  });
  it('#getContentGroupList()', () => {
    expect(BaaS.getContentGroupList).to.be.a('function');
  });
  it('#getContentGroup()', () => {
    expect(BaaS.getContentGroup).to.be.a('function');
  });
  it('#getContentCategory()', () => {
    expect(BaaS.getContentCategory).to.be.a('function');
  });
});
