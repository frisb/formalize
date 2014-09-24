fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

Assembler = require('./assembler')
ArrayEnumerator = require('./enumerator/array')
BatchEnumerator = require('./enumerator/batch')
EachEnumerator = require('./enumerator/each')

module.exports = class Query
  ### Query class
  @param {Object} ActiveRecord.
  @param {Object} Options.
    @param {String} index (optional).
    @param {Array} key0 (optional).
    @param {Array} key1 (optional).
  ###
  constructor: (@ActiveRecord, options) ->
    provider = @ActiveRecord::provider
    debug = provider.debug
    
    if (options)
      @indexName = options.index
      @key0 = options.key0
      @key1 = options.key1
      
    if (@indexName)
      # has an index name
      @subspace = provider.dir.indexes[@indexName]
      @indexKey = @ActiveRecord::indexes[@indexName].key
      
      debug.buffer('indexName', @indexName)
      debug.buffer('indexKey', @indexKey)
    else
      @subspace = provider.dir.records
      
    debug.buffer('key0', @key0)
    debug.buffer('key1', @key1)
    
    if @key0
      @key0 = deepak.packArrayValues(@key0)
    else
      @key0 = []
      
    @key1 = deepak.packArrayValues(@key1) if @key1
      
    debug.log('Query', @ActiveRecord::typeName)

  toArray: (tr, callback) -> new ArrayEnumerator(@).execute(tr, callback)
  forEachBatch: (tr, callback) -> new BatchEnumerator(@).execute(tr, callback)
  forEach: (tr, callback) -> new EachEnumerator(@).execute(tr, callback)