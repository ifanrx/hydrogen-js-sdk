const BaseRecord = require('../../core/BaseRecord')
const config = require('../../core/config')
const faker = require('faker')
const GeoPoint = require('../../core/GeoPoint')
const GeoPolygon = require('../../core/GeoPolygon')
const helper = require('./helper')

const randomOption = config.RANDOM_OPTION

describe('BaseRecord', () => {
  let product = null
  let randomNumber, randomNumber1, randomNumber2, randomArray

  before(() => {
    randomNumber = faker.random.number(randomOption)
    randomNumber1 = faker.random.number(randomOption)
    randomNumber2 = faker.random.number(randomOption)
    randomArray = helper.generateRandomArray()
  })

  beforeEach(() => {
    product = new BaseRecord(randomNumber)
  })

  it('#_recordID', () => {
    expect(product._recordID).to.equal(randomNumber)
  })

  it('#recordValueInit', () => {
    product.set('price', randomNumber1)
    product.set('amount', randomNumber2)
    product.set('obj1', {a: randomNumber1, b: randomArray})
    product._recordValueInit()
    expect(product._record).to.deep.equal({
      $set: {},
      $unset: {}
    })
  })

  it('#set key && value', () => {
    product.set('price', randomNumber1)
    product.set('amount', randomNumber2)
    product.set('obj1', {a: randomNumber1, b: randomArray})
    expect(product._record).to.deep.equal({
      $set: {
        price: randomNumber1,
        amount: randomNumber2,
        obj1: {a:randomNumber1, b:randomArray},
      },
      $unset: {}
    })
  })

  it('#set object', () => {
    product.set({price: randomNumber1})
    product.set({amount: randomNumber2})
    product.set({obj1: {a:randomNumber1, b:randomArray}})
    expect(product._record).to.deep.equal({
      $set: {
        obj1: {a:randomNumber1, b:randomArray}
      },
      $unset: {}
    })
  })

  it('#set GeoPoint', () => {
    let randomPoint = new GeoPoint(randomNumber1, randomNumber2)
    product.set({'geoPoint': randomPoint})
    expect(product._record).to.deep.equal({
      $set: {
        geoPoint: {
          'type': 'Point',
          'coordinates': [randomNumber1, randomNumber2]
        }
      },
      $unset: {}
    })
  })

  it('#set GeoPolygon', () => {
    let random2DArray = []
    for(let i = 0; i < 5; i++) {
      random2DArray.push(helper.generateRandomArray(2))
    }
    let randomPolygon = new GeoPolygon(random2DArray)
    product.set({'geoPolygon': randomPolygon})
    expect(product._record).to.deep.equal({
      $set: {
        geoPolygon: {
          'type': 'Polygon',
          'coordinates': [random2DArray]
        }
      },
      $unset: {}
    })
  })

  it('#set illegal', () => {
    expect(() => product.set('')).to.throw()
    expect(() => product.set('', '', '')).to.throw()
    expect(() => {
      product.set('string', 'test')
      product.unset('string')
    }).to.throw()
    expect(() => {
      product.unset('string')
      product.set('string', 'test')
    }).to.throw()
    expect(() => {
      product.unset({
        'string': '',
        'int': '',
      })
      product.set('string', 'test')
    }).to.throw()
    expect(() => {
      product.set({
        'string': 'test',
        'int': 10,
      })
      product.unset('string')
    }).to.throw()
    expect(() => {
      product.set({
        'string': 'test',
        'int': 10,
      })
      product.unset({
        'string': ''
      })
    }).to.throw()
  })

  it('#incrementBy', () => {
    product.incrementBy('price', randomNumber)
    expect(product._record).to.deep.equal({
      $set: {
        price: {$incr_by: randomNumber}
      },
      $unset: {}
    })
  })

  it('#append', () => {
    product.append('arr', randomNumber)
    expect(product._record).to.deep.equal({
      $set: {
        arr: {$append: [randomNumber]}
      },
      $unset: {}
    })
    product.append('arr', randomArray)
    expect(product._record).to.deep.equal({
      $set: {
        arr: {$append: randomArray}
      },
      $unset: {}
    })
  })

  it('#uAppend', () => {
    product.uAppend('arr', randomNumber)
    expect(product._record).to.deep.equal({
      $set: {
        arr: {$append_unique: [randomNumber]}
      },
      $unset: {}
    })
    let randomArray = []
    product.uAppend('arr', randomArray)
    expect(product._record).to.deep.equal({
      $set: {
        arr: {$append_unique: randomArray}
      },
      $unset: {}
    })
  })

  it('#remove', () => {
    product.remove('arr', randomNumber)
    expect(product._record).to.deep.equal({
      $set: {
        arr: {$remove: [randomNumber]}
      },
      $unset: {}
    })
    product.remove('arr', randomArray)
    expect(product._record).to.deep.equal({
      $set: {
        arr: {$remove: randomArray}
      },
      $unset: {}
    })
  })

  it('#patchObject',() => {
    product.patchObject('obj1', {a:randomArray, b:randomNumber})
    expect(product._record).to.deep.equal({
      $set: {
        obj1: {$update: {a:randomArray, b:randomNumber}}
      },
      $unset: {}
    })
  })

  it('#unset',() => {
    product.unset({
      string: '',
      obj: 'test',
    })
    product.unset('int')
    expect(product._record).to.deep.equal({
      $set: {},
      $unset: {
        int: '',
        string: '',
        obj: '',
      }
    })
  })

  it('#set and unset',() => {
    product.set({
      int: 10,
      bool: true,
    })
    product.unset({
      string: '',
      obj: 'test',
    })
    expect(product._record).to.deep.equal({
      $set: {
        int: 10,
        bool: true,
      },
      $unset: {
        string: '',
        obj: '',
      }
    })
  })
})
