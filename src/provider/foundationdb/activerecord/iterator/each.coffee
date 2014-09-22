fdb = require('fdb').apiVersion(200)
Iterator = require('./')

options =
  limit: null
  streamingMode: fdb.streamingMode.iterator

module.exports = class EachIterator extends Iterator
  getOptions: -> options

  iterate: (iterator, callback) ->
    iterator.forEach(callback)
