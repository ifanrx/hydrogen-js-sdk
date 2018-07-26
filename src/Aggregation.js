const Query = require('./Query')
const HError = require('./HError')

class Aggregation {
  constructor() {
    this._pipeline = []
  }

  match(query) {
    if (!query instanceof Query) {
      throw new HError(605)
    }

    this._pipeline.push({
      $match: query.queryObject
    })

    return this
  }

  group(expression) {
    this._pipeline.push({
      $group: expression
    })

    return this
  }

  project(expression) {
    this._pipeline.push({
      $project: expression
    })

    return this
  }

  sample(size) {
    this._pipeline.push({
      $sample: {size: size},
    })

    return this
  }

  count(outputFieldName) {
    this._pipeline.push({
      $count: outputFieldName
    })

    return this
  }

  setPipeline(pipeline) {
    if (!Array.isArray(pipeline)) {
      throw HError(605, 'pipeline 必须为 array 类型')
    }

    this._pipeline = pipeline
    return this
  }

  getPipeline() {
    return this._pipeline.filter(v => {
      if (v == null || typeof v !== 'object') return false
      return true
    })
  }
}

module.exports = Aggregation