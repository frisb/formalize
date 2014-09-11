fdb = require('fdb').apiVersion(200)

func = (tr, query, callback) =>
  iterator = query.getIterator(tr)
  query.iterate(iterator, callback)

transactionalQuery = fdb.transactional(func)

module.exports = class Query
  constructor: (@db, @subspace, @key0, @key1) ->
    @key0 = [] if (!@key0)
    @marker = null

  getIterator: (tr) ->
    db = tr || @db

    if (!@key1)
      prefix = @subspace.pack(@key0 || [])
      db.getRangeStartsWith(prefix, @getOptions())
    else
      r0 = @subspace.range(@marker || @key0)
      r1 = @subspace.range(@key1)

      db.getRange(r0.begin, r1.end, @getOptions())

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
    transactionalQuery(tr || @db, @, callback)
