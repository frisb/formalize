fdb = require('fdb').apiVersion(200)
Database = require('../')

module.exports = class FoundationDB extends Database
  constructor: (name) ->
    super(name)

    @utils = require('./utils')
    @BatchQuery = require('./query/batch')

  init: (options, callback) ->
    db = fdb.open()

    process.nextTick ->
      callback(db)

  getIdGenerator: require("./functions/idgenerator")
  getLoadFunction: require("./functions/load")
  getSaveFunction: require("./functions/save")
  getAllFunction: require("./functions/all")
  getFetchFunction: require("./functions/fetch")

  getSubspace: (ActiveRecord) ->
    # d = fdb.directory.createOrOpen(@db, [@name])

    new fdb.Subspace([ActiveRecord::typeName])
