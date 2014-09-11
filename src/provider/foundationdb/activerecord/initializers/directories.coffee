async = require('async')
fdb = require('fdb').apiVersion(200)

rootDirectoryNames = [
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
    paths = []

    for name in rootDirectoryNames
      path = [provider.dbName, typeName, name]

      switch name
        when 'indexes', 'counters'
          provider.dir[name] = Object.create(null)
          mechanism = ActiveRecord::[name]

          for item in mechanism.items
            paths.push(path.concat([item.name]))
        else
          paths.push(path)

    createDirectory = (path, cb)  =>
      fdb.directory.createOrOpen(provider.db, path, {}, cb)

    mapCallback = (err, results) ->
      if (err)
        console.error(err)
      else
        for path, i in paths
          directory = results[i]

          containerName = path[2]

          if (path.length is 4) # indexes / counters
            containerItem = path[3]
            provider.dir[containerName][containerItem] = directory
          else
            provider.dir[containerName] = directory

        callback()

    async.map(paths, createDirectory, mapCallback)
