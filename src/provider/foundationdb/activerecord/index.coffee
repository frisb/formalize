fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

ActiveRecord = require('../../../active/record')
{ObjectID} = require('bson')

initDirectories = require('./initializers/directories')
initSettings = require('./initializers/settings')

Iterator = require('./iterator')
Query = require('./query')

Adder = require('./functions/add')
IndexAdd = Adder('indexes')
CounterAdd = Adder('counters')

index = (tr, value) ->
  if (typeof(index.value) is 'function')
    v = deepak.pack(index.value(@))
  else
    value = ''

  IndexAdd.call(@, tr, value)

add = (tr, value) ->
  if (typeof(tr) is 'number')
    value = tr
    tr = null

  inc = new Buffer(4)
  inc.writeUInt32LE(value || 1, 0)

  CounterAdd.call(@, tr, inc)

module.exports = (options) ->
  class FoundationDB_ActiveRecord extends ActiveRecord(options)
    constructor: (id) ->
      id = new ObjectID().toHexString() if (typeof(id) is 'undefined')
      super(id)

    load: require('./functions/load')
    save: require('./functions/save')
    index: index
    add: add
    count: require('./functions/count')

    @fetchRaw = (subspace, key0, key1) -> new Query(@provider.db, subspace, key0, key1)
    @fetch = (index, key0, key1) -> new Iterator(@, index, key0, key1)
    @all = -> new Iterator(@, 'pk', [], ['\xff'])

    @init = (callback) ->
      initDirectories @, =>
        initSettings @, =>
          callback(@)
