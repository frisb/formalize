Formality = require('formality')

module.exports = (schema) ->
  class Record extends Formality(schema)
    constructor: (id) ->
      @changed = []
      @isLoaded = false
      @isNew = true

      @id = id if id

    set: (key, val) ->
      dest = super(key, val)
      @changed.push(dest)
