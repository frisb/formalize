Adapter = require('./adapter')
Schema = require('./schema')

module.exports = (dbType) ->
  adapter = new Adapter(dbType)
  generateID = adapter.getIdGenerator()

  (typeName, options) ->
    schema = new Schema(options.schema)

    class ActiveRecord
      constructor: (@id) ->
        @id = generateID() if (!@id)
        @attributes = Object.create(null)
        @previous = Object.create(null)
        @changed = []
        @isLoaded = false
        @isNew = true

      get: (src) ->
        dest = schema.getDest(src)
        @attributes[dest]

      set: (src, val) ->
        if (typeof val isnt 'undefined')
          dest = schema.getDest(src)
          currentVal = @attributes[dest]
          @previous[dest] = currentVal if currentVal
          @attributes[dest] = val
          @changed.push(dest)

    # if options.indexes
    #   @indexes.push(new fdb.Subspace(["idx_#{typeName}"])) for index in indexes

    ActiveRecord::typeName = typeName
    ActiveRecord::schema = schema
    ActiveRecord.all = adapter.getAllFunction(ActiveRecord)
    ActiveRecord.fetch = adapter.getFetchFunction(ActiveRecord)

    ActiveRecord::load = adapter.getLoadFunction(ActiveRecord)
    ActiveRecord::save = adapter.getSaveFunction(ActiveRecord)

    applyProperty = (src) ->
      Object.defineProperty ActiveRecord::, src,
        get: -> @get(src)
        set: (val) -> @set(src, val)

    applyProperty(s) for s in schema.src

    ActiveRecord
