ActiveSchema = require('./schema')

module.exports = (options) ->
  class BaseRecord extends ActiveSchema(options)
    constructor: (id) ->
      @changed = []
      @isLoaded = false
      @isNew = true

      @id = id if typeof id isnt 'undefined'

    set: (key, val) ->
      dest = super(key, val)
      @changed.push(dest)