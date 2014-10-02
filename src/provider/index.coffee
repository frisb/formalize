_ = require('underscore')
async = require('async')
ActiveFactory = require('../active/factory')
Debug = require('./debug')
{EventEmitter} = require('events')
path = require('path')

config = null

testDir = (dir) ->
  fileName = path.join(dir, 'formalize')
  
  try
    require(fileName) || require(fileName + '.json')
  catch e
    console.error(e)
    return

getConfig = (provider) ->
  if (config is null)
    for dir in [path.dirname(require.main.filename), process.cwd()]
      config = testDir(dir)
      
      if (config)
        providerConfig = config[provider.dbType]
        
        if (typeof(providerConfig) is 'function')
          return providerConfig(provider)
        else
          return providerConfig
      else
        return

### Abstract Provider class
@param {String} dbName Database name.
@param {String} dbType Database system type.
###
module.exports = class Provider extends EventEmitter
  constructor: (@dbType, @dbName) ->
    @status = 'disconnected'
    @db = null
    @ActiveRecord = ActiveFactory.createRecord
    @ActiveIndex = ActiveFactory.createIndex
    @ActiveCounter = ActiveFactory.createCounter

  _configure: (callback) ->
    @config = getConfig(@)
    
    @debug = new Debug(@config.debug)
    @force = @config.force || false

    activeRecordConfigs = _.pairs(@config[@dbName])

    createActiveRecord = (pair, cb)  =>
      TypedActiveRecord = @ActiveRecord(pair[0], pair[1])
      TypedActiveRecord.init (Extension) ->
        cb(null, Extension)

    mapCallback = (err, results) ->
      if (err)
        console.error(err)
      else
        callback()

    async.map(activeRecordConfigs, createActiveRecord, mapCallback)

  connect: (options) ->
    switch @status
      when 'connected' then @emit('connected', @)
      when 'disconnected'
        @status = 'connecting'

        callback = (db) =>
          @status = 'connected'
          @db = db

          @_configure =>
            @emit('connected', @)

        @init(options, callback)

    @

  init: (options, callback) ->
    throw new Error('not implemented')