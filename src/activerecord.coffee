Adapter = require('./adapter')
Record = require('./record')
Schema = require('./schema')

module.exports = (dbType) ->
  adapter = new Adapter(dbType)
  generateID = adapter.getIdGenerator()

  (typeName, options) ->
    schema = new Schema(options.schema)

    class ActiveRecord extends Record
      constructor: (@id) ->
        super()
        @id = generateID() if (!@id)

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
