fdb = require('fdb').apiVersion(200)

Provider = require('../')

module.exports = class FoundationDB extends Provider
  constructor: (name) ->
    super(name)
    @fdb = fdb
    @dir = null

  init: (clusterFile, callback) ->
    db = fdb.open(clusterFile)
    process.nextTick -> callback(db)
