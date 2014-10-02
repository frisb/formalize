fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

Parser = require('./parser')

func = (tr, enumerator, callback) =>
  iterator = enumerator.getIterator(tr)
  enumerator.iterate(iterator, callback)
    
transactionalIterate = fdb.transactional(func)

module.exports = class Enumerator
  constructor: (@query) ->
    @marker = null
    @ActiveRecord = @query.provider.ActiveRecord(@query.ActiveRecordPrototype.typeName)
    @parser = new Parser(@query.subspace, @query.indexKey)
  
  getIterator: (tr) ->
    provider = @query.provider
    subspace = @query.subspace
    key0 = @query.key0
    key1 = @query.key1
    options = @getOptions()
    debug = provider.debug
    
    if (tr)
      db = tr
      trType = 'tr'
    else 
      db = provider.db
      trType = 'db'
      
    rangeType = if key1 then 'getRange' else 'getRangeStartsWith'

    if (key1 || @marker)
      if (@marker isnt null)
        #debug.buffer('marker', @marker, deepak.unpackArrayValues, deepak)
        debug.buffer('marker', @marker)
      else 
        #debug.buffer('key0', key0, deepak.unpackArrayValues, deepak)
        debug.buffer('key0', key0)
      
      # check if marker
      key0 = @marker || key0
      key1 = key1 || key0.concat(['\xff'])
      
      #debug.buffer('key1', key1, deepak.unpackArrayValues, deepak)
      debug.buffer('key1', key1)
      
      r0 = subspace.range(key0)
      r1 = subspace.range(key1) 

      #fdb.locality.getBoundaryKeys db, r0.begin, r1.end, (err, iterator) ->
        #iterator.toArray (err, arr) ->
          #console.log(provider.dir.records.unpack(k)) for k in arr

      iterator = db.getRange(r0.begin, r1.end, options)
    else
      #debug.buffer('prefix', key0, deepak.unpackArrayValues, deepak)
      #debug.buffer('prefix', key0)
      
      #console.log('k11', key0)
      
      prefix = subspace.pack(key0)
      
      #console.log('k1', prefix)
      
      iterator = db.getRangeStartsWith(prefix, options)
      
      
    #debug.log('Enumerator', "#{trType}.#{rangeType}()")
    iterator
      
  iterate: (iterator, callback) ->
    throw new Error('not implemented')

  getOptions: ->
    throw new Error('not implemented')

  execute: (tr, callback) ->
    if (typeof(tr) is 'function')
      callback = tr
      tr = null
      
    transactionalIterate(tr || @query.provider.db, @, callback)
    
  