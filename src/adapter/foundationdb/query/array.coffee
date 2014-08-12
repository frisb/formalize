fdb = require('fdb').apiVersion(200)
Query = require('./')

options =
  limit: null
  streamingMode: fdb.streamingMode.wantAll

module.exports = class ArrayQuery extends Query
  getOptions: -> options

  iterate: (iterator, callback) ->
    iterator.toArray(callback)
