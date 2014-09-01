# ActiveCounter = require('./activecounter')
# ActiveIndex = require('./activeindex')
Record = require('../record')

module.exports = (options) ->
  class ActiveRecord extends Record(options)
    load: ->
      throw new Error('not implemented')

    save: ->
      throw new Error('not implemented')

    increment: ->
      throw new Error('not implemented')

    count: ->
      throw new Error('not implemented')

  ActiveRecord.init = (callback) ->
    throw new Error('not implemented')

  ActiveRecord.all = ->
    throw new Error('not implemented')

  ActiveRecord.fetch = ->
    throw new Error('not implemented')

  ActiveRecord::typeName = null



  # ActiveCounter(provider, ActiveRecord, options)
  # ActiveIndex(provider, ActiveIndex, options)


  ActiveRecord
