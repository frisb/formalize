fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

BatchIterator = require('../iterator/batch')

getFunc = (ActiveRecord, subspace, state, callback) ->
  (arr, next) ->
    key = null

    # iterate every key-value pair returned
    process.nextTick ->
      for pair in arr
        key = subspace.unpack(pair.key)

        #console.log(deepak.unpackArrayValues(key))

        if (state.indexKey)
          rec = new ActiveRecord(null)

          # temp = []
          
          for subkey, i in state.indexKey
            if (typeof(subkey) isnt 'function')
              val = deepak.unpackValue(key[i])
              # temp.push(val)
              if (typeof(val) isnt 'undefined')
                # set value on ActiveRecord instance attribute
                rec.data(subkey, val)

          # console.log(temp)

          rec.reset(true)
          state.pendingBatch.push(rec)
        else
          id = key[0]
          dest = key[1]

          if (state.fluxRecord isnt null)
            rec = state.fluxRecord

            if (state.fluxRecord.id isnt id)
              state.fluxRecord.reset(true)
              state.pendingBatch.push(rec)

              # create new ActiveRecord instance
              rec = new ActiveRecord(id)
          else
            rec = new ActiveRecord(id)

          if (dest)
            val = deepak.unpackValue(pair.value)
            # console.log(key, val)

            if (typeof(val) isnt 'undefined')
              # set value on ActiveRecord instance attribute
              rec.data(dest, val)

        state.fluxRecord = rec

      if (state.pendingBatch.length > 0)
        state.iterator.marker = key
        callback(null, state.pendingBatch)
        state.pendingBatch = []

    next()

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
  iterator = new BatchIterator(provider, subspace, @key0, @key1, func)

  state.iterator = iterator

  complete = (err, res) ->
    if (err)
      console.log(err)
      callback(err)
    else
      if (state.fluxRecord isnt null)
        state.fluxRecord.reset(true)
        callback(null, [state.fluxRecord])

      callback(null, null)

  iterator.execute(tr, complete)
