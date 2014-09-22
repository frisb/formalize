fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

func = (tr, query, callback) =>
  iterator = query.getIterator(tr)
  query.iterate(iterator, callback)

transactionalIterator = fdb.transactional(func)

module.exports = class Iterator
  constructor: (@provider, @subspace, @key0, @key1) ->
    @key0 = [] if (!@key0)
    @marker = null

  getIterator: (tr) ->
    debug = @provider.debug
    
    if (tr)
      db = tr
      trType = 'tr'
    else 
      db = @provider.db
      trType = 'db'
      
    rangeType = if @key1 then 'getRange' else 'getRangeStartsWith'

    if (!@key1)
      @key0 ?= []
      
      debug.buffer('prefix', @key0, deepak.unpackArrayValues, deepak)
      
      prefix = @subspace.pack(@key0)
      iterator = db.getRangeStartsWith(prefix, @getOptions())
    else
      if (@marker isnt null)
        debug.buffer('marker', @marker, deepak.unpackArrayValues, deepak)
      else 
        debug.buffer('key0', @key0, deepak.unpackArrayValues, deepak)
      
      debug.buffer('key1', @key1, deepak.unpackArrayValues, deepak)
      
      r0 = @subspace.range(@marker || @key0)
      r1 = @subspace.range(@key1)

      iterator = db.getRange(r0.begin, r1.end, @getOptions())
      
    debug.log('Iterator', "#{trType}.#{rangeType}()")
    iterator
      
  iterate: (iterator, callback) ->
    throw new Error('not implemented')

  getOptions: ->
    throw new Error('not implemented')

  execute: (tr, callback) ->
    if (typeof(tr) is 'function')
      callback = tr
      tr = null

    # if (tr is null)
    #   fdb.future.create (futureCb) =>
    #     innerFuture = @getIterator()
    #     innerFuture(futureCb)
    #   , callback
    # else
    transactionalIterator(tr || @provider.db, @, callback)
