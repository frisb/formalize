ActiveRecordFactory = require('../activerecord/factory')
{EventEmitter} = require('events')

module.exports = class Provider extends EventEmitter
  constructor: (@name) ->
    @status = 'disconnected'
    @db = null

    @ActiveRecord = ActiveRecordFactory(@)

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
