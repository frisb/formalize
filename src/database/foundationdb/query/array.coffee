fdb = require('fdb').apiVersion(200)
Query = require('./')

options =
  limit: null
  streamingMode: fdb.streamingMode.wantAll

module.exports = (db) ->
  class ArrayQuery extends Query(db)
    getOptions: -> options

    iterate: (iterator, callback) ->
      iterator.toArray(callback)
