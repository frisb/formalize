providers = {}

ProviderFactory =
  create: (dbType) ->
    Provider = require("./#{dbType}")

    (name, options, callback) ->
      if (typeof(options) is 'function')
        callback = options
        options = null

      dbKey = "#{dbType}:#{name}"

      provider = providers[dbKey]

      if (!provider)
        provider = new Provider(name)
        providers[dbKey] = provider

      provider.on('connected', callback) if (callback)

      provider.connect(options)

      if (!callback)
        return provider
      else
        return

module.exports = ProviderFactory
