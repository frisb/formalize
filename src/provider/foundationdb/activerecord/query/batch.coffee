fdb = require('fdb').apiVersion(200)
Query = require('./')

options =
  limit: null
  streamingMode: fdb.streamingMode.iterator

module.exports = class BatchQuery extends Query
  constructor: (db, subspace, key0, key1, @func) ->
    if (typeof(key0) is 'function')
      @func = key0
      key0 = null

    else if (typeof(key1) is 'function')
      @func = key1
      key1 = null

    super(db, subspace, key0, key1)

  getOptions: -> options

  iterate: (iterator, callback) ->
    iterator.forEachBatch(@func, callback)
