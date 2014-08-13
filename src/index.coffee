databases = {}

factory = (dbType) ->
  Database = require("./database/#{dbType}")

  (name, options, callback) ->
    if (typeof(options) is 'function')
      callback = options
      options = null

    dbKey = "#{dbType}:#{name}"

    F = databases[dbKey]

    if (!F)
      F = new Database(name)
      databases[dbKey] = F

    F.on('connected', callback) if (callback)

    F.connect(options)

module.exports = factory('foundationdb')
