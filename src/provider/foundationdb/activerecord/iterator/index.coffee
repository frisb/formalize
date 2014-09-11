fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

module.exports = class Iterator
  constructor: (@ActiveRecord, @indexName, @key0, @key1) ->
    if (@indexName instanceof Array)
      # does not have an index name

      if (@key0 instanceof Array)
        # has an upper limit
        @key1 = @key0

      @key0 = @indexName
      @indexName = null
    else
      # has an index name

      @ActiveRecord::indexes[@indexName].key

      if (@key0)
        for subkey, i in @key0
          @key0[i] = deepak.pack(subkey)

      if (@key1)
        for subkey, i in @key1
          @key1[i] = deepak.pack(subkey)

  toArray: require('./toarray')
  forEachBatch: require('./foreachbatch')
  forEach: require('./foreach')
