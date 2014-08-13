fdb = require('fdb').apiVersion(200)
Query = require('./')

options =
  limit: null
  streamingMode: fdb.streamingMode.iterator

module.exports = (db) ->
  class BatchQuery extends Query(db)
    constructor: (subspace, key0, key1, @func) ->
      super(subspace, key0, key1)

    getOptions: -> options

    iterate: (iterator, callback) ->
      iterator.forEachBatch(@func, callback)
