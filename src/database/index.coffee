{EventEmitter} = require('events')

extend = (a, b) -> a[key] = val for key, val of b

module.exports = class Database extends EventEmitter
  constructor: (@name) ->
    @ActiveRecord = require('../activerecord')(@)
    @status = 'disconnected'
    @db = null

  connect: (options) ->
    switch @status
      when 'connected' then @emit('connected', @)
      when 'disconnected'
        @status = 'connecting'

        callback = (db) =>
          @status = 'connected'
          @db = db
          @emit('connected', @)

        @init(options, callback)

    @

  init: (options, callback) ->
    throw new Error('not implemented')

  getIdGenerator: (ActiveRecord) ->
    throw new Error('not implemented')

  getLoadFunction:(ActiveRecord) ->
    throw new Error('not implemented')

  getSaveFunction:(ActiveRecord) ->
    throw new Error('not implemented')

  getAllFunction:(ActiveRecord) ->
    throw new Error('not implemented')

  getFetchFunction:(ActiveRecord) ->
    throw new Error('not implemented')
