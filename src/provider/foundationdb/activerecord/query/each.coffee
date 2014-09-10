fdb = require('fdb').apiVersion(200)
Query = require('./')

options =
  limit: null
  streamingMode: fdb.streamingMode.iterator

module.exports = class EachQuery extends Query
  getOptions: -> options

  iterate: (iterator, callback) ->
    iterator.forEach(callback)
