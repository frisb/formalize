fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

module.exports = class Parser
  constructor: (@subspace, @indexKey) ->
    @assembled = []
    @currentRecord = null
    @key = null
    
  in: (kv) ->
    @key = @subspace.unpack(kv.key)
    @currentRecord = if @indexKey then @indexed() else @nonIndexed(kv.value)
    @currentRecord.keySize += kv.key.length
    @currentRecord.valueSize += kv.value.length
    
  out: (callback) ->
    if (@assembled.length > 0)
      @marker = @key 
      callback(null, @assembled)
      @assembled = []
    
  indexed: ->
    # create new ActiveRecord instance
    rec = new @ActiveRecord(null)
    
    for subkey, i in @indexKey
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
          rec = new @ActiveRecord(id)
      else
        # create new ActiveRecord instance
        rec = new @ActiveRecord(id)
        
      rec.data(dest, value) if (dest)
    else
      #if (typeof(@query.ActiveRecord) isnt 'function')
        #console.log(@key)
        #console.log(deepak.unpackArrayValues(fdb.tuple.unpack(value)))
        #
        #console.log(@query.provider.ActiveRecord)
        #
        #process.exit()
      
      rec = new @ActiveRecord(id) 
      map = new Array(@key.length - 1)
      values = fdb.tuple.unpack(value)
      
      for i in [1...@key.length - 1]
        dest = @key[i]
        rec.data(dest, values[i - 1]) 
      
      rec.reset(true)
      @assembled.push(rec)
      
    rec
