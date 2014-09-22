fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

module.exports = class Query
  constructor: (@ActiveRecord, @indexName, @key0, @key1) ->
    debug = @ActiveRecord::provider.debug
    
    if (@indexName instanceof Array)
      # does not have an index name

      if (@key0 instanceof Array)
        # has an upper limit
        @key1 = @key0

      @key0 = @indexName
      @indexName = null
      
      debug.buffer('key0', @key0)
    else
      # has an index name
      
      debug.buffer('indexName', @indexName)
      debug.buffer('indexKey', @ActiveRecord::indexes[@indexName].key)
      
      debug.buffer('key0', @key0)
      debug.buffer('key1', @key1)

      @key0 = deepak.packArrayValues(@key0) if @key0
      @key1 = deepak.packArrayValues(@key1) if @key1
      
    debug.log('Query', @ActiveRecord::typeName)

  toArray: require('./toarray')
  forEachBatch: require('./foreachbatch')
  forEach: require('./foreach')
