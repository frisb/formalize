ActiveSchema = require('./activeschema')

module.exports = (options) ->
  class Record extends ActiveSchema(options)
    constructor: (id) ->
      @changed = []
      @isLoaded = false
      @isNew = true

      @id = id if id

    set: (key, val) ->
      dest = super(key, val)
      @changed.push(dest)
