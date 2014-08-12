module.exports = (dbType) ->
  Adapter = require('./adapter')
  adapter = new Adapter(dbType)

  db: adapter.db
  # utils: require('./utils')
  ActiveRecord: require('./activerecord')(dbType)
  # BatchQuery: require('./query/batch')
