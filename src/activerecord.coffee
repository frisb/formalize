Record = require('./record')
Schema = require('./schema')

module.exports = (db) ->
  generateID = db.getIdGenerator()

  (typeName, options) ->
    schema = new Schema(options.schema)

    class ActiveRecord extends Record
      constructor: (@id) ->
        super()
        @id = generateID() if (!@id)

    ActiveRecord::typeName = typeName
    ActiveRecord::schema = schema

    ActiveRecord.all = db.getAllFunction(ActiveRecord)
    ActiveRecord.fetch = db.getFetchFunction(ActiveRecord)

    ActiveRecord::load = db.getLoadFunction(ActiveRecord)
    ActiveRecord::save = db.getSaveFunction(ActiveRecord)

    applyProperty = (src) ->
      Object.defineProperty ActiveRecord::, src,
        get: -> @get(src)
        set: (val) -> @set(src, val)

    applyProperty(s) for s in schema.src

    ActiveRecord
