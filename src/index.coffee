providers = {}

### Factory function.
@param {String} dbType Database system type.
@return {Function} Provider Factory
###
module.exports = (dbType) ->
  Provider = require("./provider/#{dbType}")

  ### Returns a typed provider for a specific database.
  @param {String} dbName Database name.
  @param {Object} options Provider specific configuration options.
  @param {Function} callback Function called when provider connected to database.
  @return {Object} Provider if callback is defined
  ###
  (dbName, options, callback) ->
    if (typeof(options) is 'function')
      callback = options
      options = null

    key = "#{dbType}:#{dbName}"
    provider = providers[key]

    if (!provider)
      provider = new Provider(dbType, dbName)
      providers[key] = provider

    provider.on('connected', callback) if (callback)

    provider.connect(options)

    if (!callback)
      return provider
    else
      return
