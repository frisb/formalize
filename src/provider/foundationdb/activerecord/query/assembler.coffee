fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

module.exports = class Assembler
  constructor: (@query) ->
    @assembled = []
    @currentRecord = null
    @key = null
    
  pumpIn: (kv) ->
    @key = @query.subspace.unpack(kv.key)
    @currentRecord = if @query.indexKey then @indexed() else @nonIndexed(kv.value)
    @currentRecord.keySize += kv.key.length
    @currentRecord.valueSize += kv.value.length
    
  pumpOut: (callback) ->
    if (@assembled.length > 0)
      @query.marker = @key 
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
    
  
