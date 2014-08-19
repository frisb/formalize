fdb = require('fdb').apiVersion(200)
utils = require('../utils')

module.exports = (ActiveCounter) ->
  key = ActiveCounter::key
  ensureDirectories = @getEnsureDirectoriesFunction(ActiveRecord)

  (tr0, callback) ->
    if (typeof(tr0) is 'function')
      callback = tr0
      tr0 = null

    ensureDirectories (dir) =>
      transaction = (tr, innerCallback) =>
        @id ?= generateID()

        tr.set(dir.records.pack([@id]), utils.pack(''))

        for d in schema.dest
          if (d isnt 'id')
            val = @data[d]
            tr.set(dir.records.pack([@id, d]), utils.pack(val))

        for counterName, counter of @counters
          key = []

          for prop in counter
            val = @data[prop]
            key.push(utils.pack(val))

        inc = new Buffer(4)
        inc.writeUInt32LE(1, 0)

        tr.add(dir.counters.pack(key), inc)

        # for index in indexes
        #   index
        # tr.set(ctaIndex.pack([@carrier, t, @A, @tag]), '')

        @isNew = false
        @isLoaded = true
        @changed = []
        innerCallback(null, @)

      if (tr0)
        fdb.future.create (futureCb) ->
          transaction(tr0, futureCb)
        , callback
      else
        db.doTransaction(transaction, callback)
