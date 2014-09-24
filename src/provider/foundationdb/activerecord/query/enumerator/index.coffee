fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

module.exports = class Enumerator
  constructor: (@query) ->
    @assembled = []
    @currentRecord = null
    @key = null
    @marker = null
    
  getIterator: (tr) ->
    provider = @query.ActiveRecord::provider
    debug = provider.debug
    
    if (tr)
      db = tr
      trType = 'tr'
    else 
      db = provider.db
      trType = 'db'
      
    rangeType = if @query.key1 then 'getRange' else 'getRangeStartsWith'

    if (!@query.key1)
      debug.buffer('prefix', @query.key0, deepak.unpackArrayValues, deepak)
      
      prefix = @query.subspace.pack(@query.key0)
      iterator = db.getRangeStartsWith(prefix, @getOptions())
    else
      if (@marker isnt null)
        debug.buffer('marker', @marker, deepak.unpackArrayValues, deepak)
      else 
        debug.buffer('key0', @query.key0, deepak.unpackArrayValues, deepak)
      
      debug.buffer('key1', @query.key1, deepak.unpackArrayValues, deepak)
      
      r0 = @query.subspace.range(@marker || @query.key0)
      r1 = @query.subspace.range(@query.key1)

      iterator = db.getRange(r0.begin, r1.end, @getOptions())
      
    debug.log('Enumerator', "#{trType}.#{rangeType}()")
    iterator
      
  iterate: (iterator, callback) ->
    throw new Error('not implemented')

  getOptions: ->
    throw new Error('not implemented')

  execute: (tr, callback) ->
    if (typeof(tr) is 'function')
      callback = tr
      tr = null
    
    func = (tr, callback) =>
      iterator = @getIterator(tr)
      @iterate(iterator, callback)
    
    transactionalIterate = fdb.transactional(func)
    transactionalIterate(tr || @query.ActiveRecord::provider.db, callback)
    
  pumpIn: (kv) ->
    @key = @query.subspace.unpack(kv.key)
    @currentRecord = if @query.indexKey then @indexed() else @nonIndexed(kv.value)
    @currentRecord.keySize += kv.key.length
    @currentRecord.valueSize += kv.value.length
    
  pumpOut: (callback) ->
    if (@assembled.length > 0)
      @marker = @key 
      callback(null, @assembled)
      @assembled = []
    
  indexed: ->
    # create new ActiveRecord instance
    rec = new @query.ActiveRecord(null)
    
    for subkey, i in @query.indexKey
      rec.data(subkey, @key[i]) if (typeof(subkey) isnt 'function')

    rec.reset(true)
    @assembled.push(rec)
    
    rec
    
  nonIndexed: (value) ->
    rec = null
    id = @key[0]
    partition = @key.length <= 2
    
    if (partition)
      dest = @key[1]
      
      if (@currentRecord isnt null)
        rec = @currentRecord
  
        if (@currentRecord.id isnt id)
          @currentRecord.reset(true)
          @assembled.push(rec)
  
          # create new ActiveRecord instance
          rec = new @query.ActiveRecord(id)
      else
        # create new ActiveRecord instance
        rec = new @query.ActiveRecord(id)
        
      rec.data(dest, value) if (dest)
    else
      rec = new @query.ActiveRecord(id) 
      map = new Array(@key.length - 1)
      values = fdb.tuple.unpack(value)
      
      for i in [1...@key.length - 1]
        dest = @key[i]
        rec.data(dest, values[i - 1]) 
      
      rec.reset(true)
      @assembled.push(rec)
      
    rec
