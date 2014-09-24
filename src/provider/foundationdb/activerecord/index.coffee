fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

ActiveRecord = require('../../../active/record')
{ObjectID} = require('bson')

initDirectories = require('./initializers/directories')
initSettings = require('./initializers/settings')

#Iterator = require('./iterator')
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
      
      if (typeof(@provider.partition) isnt 'undefined')
        @partition = @provider.partition
      else 
        @partition = options.partition
        
      @keySize = 0
      @valueSize = 0
      
      super(id)

    load: require('./functions/load')
    save: require('./functions/save')
    index: index
    add: add
    count: require('./functions/count')

    data: (dest, val) ->
      if (dest && !val)
        val = super(dest)
        
        if (val instanceof Buffer)
          val = deepak.unpackValue(val)
          @data(dest, val)
          
        return val
        
      return super(dest, val)
      

    #@fetchRaw = (subspace, key0, key1) -> new Iterator(@provider.db, subspace, key0, key1)
    @fetch = (options) -> new Query(@, options)
    @all = -> 
      options = 
        index: 'pk'
        key0: [] 
        key1: ['\xff']
      
      new Query(@, options)
    @reindex = (name) -> 
      @all().forEachBatch (err, arr) ->
        for rec in arr
          if (rec.C is 64502)
            console.log(rec.data)

    @init = (callback) ->
      initDirectories @, =>
        initSettings @, =>
          callback(@)
