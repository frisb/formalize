fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

ArrayEnumerator = require('./enumerator/array')
BatchEnumerator = require('./enumerator/batch')
EachEnumerator = require('./enumerator/each')

module.exports = class Query
  ### Query class
  @param {Object} ActiveRecordPrototype.
  @param {Object} Options.
    @param {String} index (optional).
    @param {Array} key0 (optional).
    @param {Array} key1 (optional).
  ###
  constructor: (@ActiveRecordPrototype, options) ->
    @provider = @ActiveRecordPrototype.provider
    
    debug = @provider.debug
    
    if (options)
      @indexName = options.index
      @key0 = options.key0
      @key1 = options.key1
      @processes = options.processes
      
    if (@indexName)
      # has an index name
      @subspace = @provider.dir.indexes[@indexName]
      @indexKey = @ActiveRecordPrototype.indexes[@indexName].key
      
      debug.buffer('indexName', @indexName)
      debug.buffer('indexKey', @indexKey)
      
      @key0 = deepak.packArrayValues(@key0) if @key0
      @key1 = deepak.packArrayValues(@key1) if @key1
    else
      @subspace = @provider.dir.records
      
    #debug.buffer('key0', @key0, deepak.unpackArrayValues, deepak)
    #debug.buffer('key1', @key1, deepak.unpackArrayValues, deepak)
    
    
    
    #if @key0
      #@key0 = deepak.packArrayValues(@key0)
    #else
      #@key0 = []
    @key0 = [] if !@key0
    #@key1 = deepak.packArrayValues(@key1) if @key1
      
    debug.log('Query', @ActiveRecordPrototype.typeName)

  toArray: (tr, callback) -> new ArrayEnumerator(@).execute(tr, callback)
  forEachBatch: (tr, callback) -> new BatchEnumerator(@).execute(tr, callback)
  forEach: (tr, callback) -> new EachEnumerator(@).execute(tr, callback)