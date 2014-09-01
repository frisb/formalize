# ActiveCounter = require('./activecounter')
# ActiveIndex = require('./activeindex')
ActiveRecord = require('../../../activerecord')
{ObjectID} = require('bson')

initDirectories = require('./initializers/directories')
initSettings = require('./initializers/settings')

module.exports = (options) ->
  class FoundationDB_AR extends ActiveRecord(options)
    constructor: (id) ->
      super(id || new ObjectID().toHexString())

    load: require('./functions/load')
    save: require('./functions/save')
    increment: require('./functions/increment')
    count: require('./functions/count')

  FoundationDB_AR.all = require('./functions/all')
  FoundationDB_AR.fetch = require('./functions/fetch')

  FoundationDB_AR.init = (callback) ->
    initDirectories @, =>
      initSettings @, =>
        callback(@)



  # ActiveCounter(provider, ActiveRecord, options)
  # ActiveIndex(provider, ActiveIndex, options)

  FoundationDB_AR
