async = require('async')
fdb = require('fdb').apiVersion(200)

paths = [
  'settings'
  'records'
  'indexes'
  'counters'
]

module.exports = (ActiveRecord, callback) ->
  provider = ActiveRecord::provider

  if (provider.dir isnt null)
    callback()
  else
    provider.dir = Object.create(null)
    typeName = ActiveRecord::typeName

    createDirectory = (path, cb)  =>
      fdb.directory.createOrOpen(provider.db, [provider.name, typeName, path], {}, cb)

    mapCallback = (err, results) ->
      if (err)
        console.error(err)
      else
        provider.dir[path] = results[i] for path, i in paths

        callback()

    async.map(paths, createDirectory, mapCallback)
