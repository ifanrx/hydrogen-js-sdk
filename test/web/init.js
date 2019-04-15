const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const constants = require('../../core/constants')
const utils = require('../../core/utils')
chai.use(sinonChai)
let expect = chai.expect

describe('init', () => {
  describe('# updateUserprofile', () => {
    beforeEach(() => {
      BaaS._config.CLIENT_ID = ''
    })
    let clientID
    for (let i = 0; i < 10; i++) {
      clientID = Math.random().toString(16).slice(2)
      it(`should set "CLIENT_ID" to "${clientID}"`, () => {
        BaaS.init(clientID)
        expect(BaaS._config.CLIENT_ID).to.equal(clientID)
      })
    }
  })
})
