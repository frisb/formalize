{ObjectID} = require('bson')

module.exports = (fdb, db) ->
  utils = require('./utils')(fdb)

  rangeQuery = (subspace, key0, key1, options, callback, tr0) ->
      transaction = (tr, innerCallback) ->
        r0 = subspace.range(key0)
        r1 = subspace.range(key1)

        iterator = tr.getRange(r0.begin, r1.end, options || {})

        fn = iterator.forEachBatch
        fn = iterator.toArray if (options.streamingMode is fdb.streamingMode.iterator)

        fn.call(iterator, innerCallback)

      if tr0 then transaction(tr0, callback)
      else db.doTransaction(transaction, callback)

  class Record
    constructor: (@id) ->
      @id = new ObjectID().toHexString() if !@id

    load: (tr, callback) ->
      if (typeof(tr) is 'function')
        callback = tr
        tr = null

      options =
        limit: null
        streamingMode: fdb.streamingMode.want_all

      cb = (err, arr) =>
        for pair in arr
          key = @subspace.unpack(pair.key)
          destKey = key[1]
          srcKey = @schema.src[@schema.map[destKey]]

          @[srcKey] = utils.unpack(pair.value)

        if (!err)
          @isLoaded = true
          @isNew = false

        callback(err)

      rangeQuery(@subspace, [@id], [@id], options, cb, tr)

    save: (tr, callback) ->
      transaction = (tr, innerCallback) =>
        tr.set(@subspace.pack([@id]), '')

        for src, i in @schema.src
          dest = @schema.dest[i]
          val = @[src]

          tr.set(@subspace.pack([@id, dest]), utils.pack(val))

        # for index in indexes
        #   index
        # tr.set(ctaIndex.pack([@carrier, t, @A, @tag]), '')

        @isNew = false
        innerCallback(null)

      if (typeof(tr) is 'function')
        callback = tr
        db.doTransaction(transaction, callback)
      else
        transaction(tr, callback)

  Record.fetch = (subspace, key0, key1, options) ->
    options =
      limit: null
      # reverse: true
      streamingMode: fdb.streamingMode.iterator

    callback = (err, arr) ->
      console.log(arr)

    rangeQuery(subspace, key0, key1, options, callback)

  Record
