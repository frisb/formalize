fdb = require('fdb').apiVersion(200)

func = (db, query, callback) =>
  r0 = query.subspace.range(query.key0)
  r1 = query.subspace.range(query.key1)

  iterator = db.getRange(r0.begin, r1.end, query.getOptions())
  query.iterate(iterator, callback)

module.exports = (db) ->
  class Query
    constructor: (@subspace, @key0, @key1) ->

    iterate: (iterator, callback) ->
      throw new Error('not implemented')

    getOptions: ->
      throw new Error('not implemented')

    execute: (tr, callback) ->
      if (typeof(tr) is 'function')
        callback = tr
        tr = null

      transactionalQuery = fdb.transactional(func)
      transactionalQuery(tr || db, @, callback)