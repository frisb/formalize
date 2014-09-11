fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

BatchQuery = require('../query/batch')

getFunc = (ActiveRecord, subspace, state, callback) ->
  (arr, next) ->
    key = null

    # iterate every key-value pair returned
    process.nextTick ->
      for pair in arr
        key = subspace.unpack(pair.key)



        if (state.indexKey)
          rec = new ActiveRecord(null)

          # temp = []

          for subkey, i in state.indexKey
            val = deepak.unpack(key[i])
            # temp.push(val)
            if (typeof(val) isnt 'undefined')
              # set value on ActiveRecord instance attribute
              rec.data[subkey] = val

          # console.log(temp)

          reset(rec)
          state.pendingBatch.push(rec)
        else
          id = key[0]
          dest = key[1]

          if (state.fluxRecord isnt null)
            rec = state.fluxRecord

            if (state.fluxRecord.id isnt id)
              reset(state.fluxRecord)
              state.pendingBatch.push(rec)

              # create new ActiveRecord instance
              rec = new ActiveRecord(id)
          else
            rec = new ActiveRecord(id)

          if (dest)
            val = deepak.unpack(pair.value)
            # console.log(key, val)

            if (typeof(val) isnt 'undefined')
              # set value on ActiveRecord instance attribute
              rec.data[dest] = val

        state.fluxRecord = rec

      if (state.pendingBatch.length > 0)
        state.query.marker = key
        callback(null, state.pendingBatch)
        state.pendingBatch = []

    next()

reset = (rec) ->
  rec.isNew = false
  rec.isLoaded = true
  rec.changed = []

module.exports =  (tr, callback) ->
  if (typeof(tr) is 'function')
    callback = tr
    tr = null

  provider = @ActiveRecord::provider
  state =
    pendingBatch: []
    fluxRecord: null

  if (@indexName isnt null)
    subspace = provider.dir.indexes[@indexName]
    state.indexKey = @ActiveRecord::indexes[@indexName].key
  else
    subspace = provider.dir.records

  func = getFunc(@ActiveRecord, subspace, state, callback)
  query = new BatchQuery(provider.db, subspace, @key0, @key1, func)

  state.query = query

  complete = (err, res) ->
    if (err)
      callback(err)
    else
      if (state.fluxRecord isnt null)
        reset(state.fluxRecord)
        callback(null, [state.fluxRecord])

      callback(null, null)

  query.execute(tr, complete)
