fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

save = (tr, rec, callback) ->
  tr.set(rec.provider.dir.records.pack([rec.id]), deepak.pack(''))

  for d in rec.schema.dest
    if (d isnt 'id')
      val = rec.data[d]

      tr.set(rec.provider.dir.records.pack([rec.id, d]), deepak.pack(val))

    rec.isNew = false
    rec.isLoaded = true
    rec.changed = []

  # for counter in rec.counters.items
  #   counter.increment(tr, rec)
  #
  # for index in rec.indexes.items
  #   index.add(tr, rec)

  #   if (counter.filter(rec))
  #     console.log(counter.name)
  #     subspace = provider.dir.counters.subspace([counter.name])
  #     key = []
  #
  #     for subkey in counter.key
  #       key.push(deepak.pack(rec.data[subkey]))
  #
  #     packedKey = subspace.pack(key)
  #
  #     inc = new Buffer(4)
  #     inc.writeUInt32LE(1, 0)
  #
  #     tr.add(packedKey, inc)

      # tr.get packedKey, (err, v1) ->
      #   console.log(v1.readInt32LE(0))

        # func = (arr, next) ->
        #   for pair in arr
        #     key = subspace.unpack(pair.key)
        #     val = pair.value.readInt32LE(0)
        #
        #     unpackedKey = []
        #     unpackedKey.push(deepak.unpack(subkey)) for subkey in key
        #
        #     console.log(unpackedKey)
        #     console.log(val)
        #
        #   next()
        #
        # BatchQuery = require('../query/batch')(db)
        #
        # query = new BatchQuery(subspace, [new Buffer('', 'binary')], [deepak.pack([ 64502, [ 2014, 8, 19, 14, 1 ], '27824455566' ])], func)
        #
        # query.execute(tr, callback)

  callback(null)


module.exports = (tr, callback) ->
  if (typeof(tr) is 'function')
    callback = tr
    tr = null

  fdb.future.create (futureCb) =>
    transactionalSave = fdb.transactional(save)
    transactionalSave(tr || @provider.db, @, futureCb)
  , callback
