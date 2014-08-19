fdb = require('fdb').apiVersion(200)
utils = require('../utils')

module.exports = (ActiveRecord) ->
  db = @db
  provide = @getProviderFunction(ActiveRecord)
  generateID = @getIdGenerator()

  save = (tr, provider, rec, callback) ->
    rec.id = generateID() if !rec.id

    tr.set(provider.dir.records.pack([rec.id]), utils.pack(''))

    for d in rec.schema.dest
      if (d isnt 'id')
        val = rec.data[d]

        tr.set(provider.dir.records.pack([rec.id, d]), utils.pack(val))

      rec.isNew = false
      rec.isLoaded = true
      rec.changed = []

    for counter in rec.counters
      if (counter.filter(rec))
        console.log(counter.name)
        subspace = provider.dir.counters.subspace([counter.name])
        key = []

        for subkey in counter.key
          key.push(utils.pack(rec.data[subkey]))

        packedKey = subspace.pack(key)

        inc = new Buffer(4)
        inc.writeUInt32LE(1, 0)

        tr.add(packedKey, inc)

        # tr.get packedKey, (err, v1) ->
        #   console.log(v1.readInt32LE(0))
        #
        #   func = (arr, next) ->
        #     for pair in arr
        #       key = subspace.unpack(pair.key)
        #       val = pair.value.readInt32LE(0)
        #
        #       unpackedKey = []
        #       unpackedKey.push(utils.unpack(subkey)) for subkey in key
        #
        #       console.log(unpackedKey)
        #       console.log(val)
        #
        #     next()
        #
        #   BatchQuery = require('../query/batch')(db)
        #
        #   query = new BatchQuery(subspace, [new Buffer('', 'binary')], [utils.pack([ 64502, [ 2014, 8, 19, 14, 1 ], '27824455566' ])], func)
        #
        #   query.execute(tr, callback)

    callback(null)

  (tr, callback) ->
    if (typeof(tr) is 'function')
      callback = tr
      tr = null

    fdb.future.create (futureCb) =>
      provideCallback = (provider) =>
        transactionalSave = fdb.transactional(save)
        transactionalSave(tr || db, provider, @, futureCb)

      provide(provideCallback)
    , callback
