const Aggregation = require('../src/Aggregation')
const Query = require('../src/Query')

describe('Aggregation', () => {
  let aggregation = null

  beforeEach(() => {
    aggregation = new Aggregation()
  })

  it('#setPipeline', () => {
    aggregation.setPipeline([{
      $sample: {size: 10}
    }])

    expect(aggregation._pipeline).deep.equal([{
      $sample: {size: 10}
    }])
  })

  it('#getPipeline', () => {
    aggregation.setPipeline([{
      $sample: {size: 10}
    }, null, '123', 66])

    expect(aggregation.getPipeline()).deep.equal([{
      $sample: {size: 10}
    }])
  })

  it('#match', () => {
    let q = new Query()
    q.compare('age', '=', 1)
    aggregation.match(q)
    expect(aggregation.getPipeline()).deep.equal([{
      $match: {
        $and: [{
          age: {
            $eq: 1
          }
        }]
      }
    }])
  })

  it('#group', () => {
    aggregation.group({
      _id: {month: {$month: "$date"}, day: {$dayOfMonth: "$date"}, year: {$year: "$date"}},
      totalPrice: {$sum: {$multiply: ["$price", "$quantity"]}},
      averageQuantity: {$avg: "$quantity"},
      count: {$sum: 1}
    })

    expect(aggregation.getPipeline()).deep.equal([{
      $group: {
        _id: {month: {$month: "$date"}, day: {$dayOfMonth: "$date"}, year: {$year: "$date"}},
        totalPrice: {$sum: {$multiply: ["$price", "$quantity"]}},
        averageQuantity: {$avg: "$quantity"},
        count: {$sum: 1}
      }
    }])
  })

  it('#project', () => {
    aggregation.project({
      title: 1, author: 1
    })

    expect(aggregation.getPipeline()).deep.equal([{
      $project: {
        title: 1, author: 1
      }
    }])
  })

  it('#count', () => {
    aggregation.count('passing_scores')

    expect(aggregation.getPipeline()).deep.equal([{
      $count: "passing_scores"
    }])
  })

  it('#sample', () => {
    aggregation.sample(10)

    expect(aggregation.getPipeline()).deep.equal([{
      $sample: {
        size: 10
      }
    }])
  })

})