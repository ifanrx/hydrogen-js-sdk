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
      BaaS._config.updateUserprofile = ''
    })

    it('should set default value', () => {
      BaaS.init('mock-client-id')
      expect(BaaS._config.updateUserprofile).to.equal(constants.UPDATE_USERPROFILE_VALUE.SETNX)
    })

    it('should not value if value is allowed', () => {
      BaaS.init('mock-client-id', {
        updateUserprofile: 'overwrite',
      })
      expect(BaaS._config.updateUserprofile).to.equal('overwrite')
      BaaS.init('mock-client-id', {
        updateUserprofile: 'false',
      })
      expect(BaaS._config.updateUserprofile).to.equal('false')
      BaaS.init('mock-client-id', {
        updateUserprofile: 'setnx',
      })
      expect(BaaS._config.updateUserprofile).to.equal('setnx')
    })

    it('should set default value if value is not allowded', () => {
      BaaS.init('mock-client-id', {
        updateUserprofile: 'foo',
      })
      expect(BaaS._config.updateUserprofile).to.equal('setnx')
      BaaS.init('mock-client-id', {
        updateUserprofile: 'bar',
      })
      expect(BaaS._config.updateUserprofile).to.equal('setnx')
    })
  })
})
