Record = require('./record')
Schema = require('./schema')

module.exports = (fdb, db) ->
  factory = (typeName, options) ->
    subspace = new fdb.Subspace([typeName])
    schema = new Schema(options.schema)

    class ActiveRecord extends Record(fdb, db)
      constructor: (id) ->
        @subspace = subspace
        @schema = schema
        @attributes = Object.create(null)
        @previous = Object.create(null)
        @changed = []
        @isLoaded = false
        @isNew = true

        super(id)

      get: (key) ->
        @attributes[key]

      set: (key, val) ->
        if (typeof val isnt 'undefined')
          currentVal = @attributes[key]
          @previous[key] = currentVal if currentVal
          @attributes[key] = val
          @changed.push(key)

    # if options.indexes
    #   @indexes.push(new fdb.Subspace(["idx_#{typeName}"])) for index in indexes

    applyProperty = (src) ->
      Object.defineProperty ActiveRecord::, src,
        get: -> @get(src)
        set: (val) -> @set(src, val)

    applyProperty(s) for s in schema.src

    ActiveRecord

  factory
