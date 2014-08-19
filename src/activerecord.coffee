Record = require('./record')

module.exports = (db) ->
  (typeName, options) ->
    class ActiveRecord extends Record(getSchema(options))

    ActiveRecord::counters = options.counters

    ActiveRecord::typeName = typeName

    ActiveRecord.all = db.getAllFunction(ActiveRecord)
    ActiveRecord.fetch = db.getFetchFunction(ActiveRecord)

    ActiveRecord::load = db.getLoadFunction(ActiveRecord)
    ActiveRecord::save = db.getSaveFunction(ActiveRecord)

    ActiveRecord

getSchema = (options) ->
  if (options.schema instanceof Array)
    schema = ['id'].concat(options.schema)
  else
    schema = { id: 'id' }
    schema[k] = v for k, v of options.schema

  schema
