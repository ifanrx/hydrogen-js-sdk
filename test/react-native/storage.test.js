// import test from 'ava'
// import sinon from 'sinon'
// import AsyncStorage from './async-storage-mock'
const moduleAlias = require('module-alias')
moduleAlias.addAlias('core-module', __dirname + '../../../core')
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const proxyquire = require('proxyquire').noCallThru()
chai.use(sinonChai)
let expect = chai.expect

const storage = proxyquire('../../sdk-file/src/react-native/storage', {
  '@react-native-community/async-storage': require('./async-storage-mock'),
})

describe('storage', () => {
  it('Can init with a list of keys', () => {
    return storage.set('foo', 'bar').then(() =>
      storage.init().then((data) => {
        expect(data[0][1]).to.equal('bar')
      }))
  })

  it('Can set and get a value', () => {
    storage.set('foo', 'bar')
    expect(storage.get('foo')).to.equal('bar')
  })

  it('Can set and remove a value', () => {
    storage.set('foo', 'bar')
    storage.remove('foo')
    expect(storage.get('foo')).to.be.undefined
  })

  it('Returns a error when set() don\'t have a key', () => {
    expect(() => storage.set()).to.throw()
  })

  it('Returns a error when remove() don\'t have a key', () => {
    expect(() => storage.remove()).to.throw()
  })

  it('Can update an item', () => {
    storage.saveItem(['bar', 'baz'])
    expect(storage.get('bar')).to.be.equal('baz')
  })

  it('Can get all keys from storage', () => {
    storage.set('foo', 'bar')
    const all_keys = storage.getAllKeys()
    expect(all_keys).to.be.include('foo')
  })
})
