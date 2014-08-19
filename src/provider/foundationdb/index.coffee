async = require('async')
fdb = require('fdb').apiVersion(200)
utils = require('./utils')

Formality = require('formality')
Provider = require('../')
Schema = require('../')

module.exports = class FoundationDB extends Provider
  constructor: (name) ->
    super(name)

    @fdb = fdb
    @dir = null

    # @utils = require('./utils')
    # @BatchQuery = require('./query/batch')

  init: (options, callback) ->
    db = fdb.open()

    process.nextTick ->
      callback(db)

  getIdGenerator: require("./functions/idgenerator")
  getLoadFunction: require("./functions/load")
  getSaveFunction: require("./functions/save")
  getAllFunction: require("./functions/all")
  getFetchFunction: require("./functions/fetch")

  # getIncrementCountFunction: require("./functions/incrementcount")
  # getGetCountFunction: require("./functions/getcount")

  getProviderFunction: (ActiveRecord) ->
    (callback) =>
      @ensureDirectories ActiveRecord, =>
        @ensureSchema ActiveRecord, =>
          callback(@)

  ensureSchema: (ActiveRecord, callback) ->
    schema = ActiveRecord::schema

    if (schema && schema.active)
      callback()
    else
      activated = ->
        schema.active = true
        callback()

      saveCallback = (err) ->
        if (err)
          console.error(err)
        else
          activated()

      loadCallback = (initializer) =>
        if (initializer isnt null)
          schema.init(initializer)
          activated()
        else if (schema)
          @saveSchema(ActiveRecord, schema.initializer, saveCallback)
        else
          throw new Error("No schema provided for ActiveRecord type '#{ActiveRecord::typeName}'")

      @loadSchema(ActiveRecord, loadCallback)

  loadSchema: (ActiveRecord, callback) ->
    key = @dir.settings.pack(['schema'])
    @db.get key, (err, val) ->
      if (err)
        console.error(err)
      else
        callback(utils.unpack(val))

  saveSchema: (ActiveRecord, initializer, callback) ->
    key = @dir.settings.pack(['schema'])
    @db.set(key, utils.pack(initializer))
    callback(null)

  ensureDirectories:  (ActiveRecord, callback) =>
    if (@dir isnt null)
      callback(@dir)
    else
      paths = [
        'settings'
        'records'
        'indexes'
        'counters'
      ]

      createDirectory = (path, cb)  =>
        fdb.directory.createOrOpen(@db, [@name, ActiveRecord::typeName, path], {}, cb)

      mapCallback = (err, results) =>
        if (err)
          console.error(err)
        else
          @dir = Object.create(null)
          @dir[path] = results[i] for path, i in paths
          callback()

      async.map(paths, createDirectory, mapCallback)
