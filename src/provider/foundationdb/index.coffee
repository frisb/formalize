fdb = require('fdb').apiVersion(200)

Provider = require('../')

module.exports = class FoundationDB extends Provider
  init: (clusterFile, callback) ->
    @fdb = fdb
    @dir = null

    db = fdb.open(clusterFile)
    process.nextTick -> callback(db)
