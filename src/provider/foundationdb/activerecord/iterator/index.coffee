module.exports = class Iterator
  constructor: (@ActiveRecord, @key0, @key1) ->

  toArray: require('./toarray')
  forEachBatch: require('./foreachbatch')
  forEach: require('./foreach')
