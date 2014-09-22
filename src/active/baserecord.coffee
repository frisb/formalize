ActiveSchema = require('./schema')

module.exports = (options) ->
  class BaseRecord extends ActiveSchema(options)
    constructor: (id) ->
      super()
      
      @reset()
      @id = id if typeof id isnt 'undefined'

    reset: (isLoaded) ->
      @isLoaded = isLoaded
      @isNew = !isLoaded
      @isChanged = false

    setValue: (key, val) ->
      dest = super(key, val)
      @isChanged = true
