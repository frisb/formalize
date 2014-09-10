ActiveMechanism = require('./mechanism')

extensions = {}

Factory =
  createRecord: (typeName, options, callback) ->
    provider = @
    key = "#{@dbType}:#{@dbName}:#{typeName}"
    Extension = extensions[key]

    if (!Extension)
      extensions[key] = class Extension extends require("../provider/#{@dbType}/activerecord")(options)
        provider: provider
        typeName: typeName
        indexes: provider.ActiveIndex(typeName, options)
        counters: provider.ActiveCounter(typeName, options)

      if (callback)
        Extension.init(callback)
      else
        return Extension

    else if (callback)
      callback(Extension)
    else
      return Extension

  createIndex: (typeName, options) ->
    ActiveMechanism(typeName, 'indexes', options)

  createCounter: (typeName, options) ->
    ActiveMechanism(typeName, 'counters', options)

module.exports = Factory
