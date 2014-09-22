fdb = require('fdb').apiVersion(200)
Iterator = require('./')

options =
  limit: null
  streamingMode: fdb.streamingMode.wantAll

module.exports = class ArrayIterator extends Iterator
  getOptions: -> options

  iterate: (iterator, callback) ->
    iterator.toArray(callback)
