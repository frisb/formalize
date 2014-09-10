BaseRecord = require('./baserecord')

module.exports = (options) ->
  class ActiveRecord extends BaseRecord(options)
    provider: null
    typeName: null

    load: ->
      throw new Error('not implemented')

    save: ->
      throw new Error('not implemented')

    index: ->
      throw new Error('not implemented')

    add: ->
      throw new Error('not implemented')

    count: ->
      throw new Error('not implemented')

    # static
    @init = (callback) ->
      throw new Error('not implemented')

    @all = ->
      throw new Error('not implemented')

    @fetch = ->
      throw new Error('not implemented')
