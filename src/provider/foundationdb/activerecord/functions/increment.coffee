fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

module.exports = (ActiveRecord, ActiveCounter) ->
  db = @db
  start = @getStartFunction(ActiveRecord)

  increment = (tr, counter, rec, callback) ->
    if (counter.filter(rec))
      k = []

      for subkey in counter.key
        k.push(deepak.pack(rec.data[subkey]))

      packedKey = counter.subspace.pack(k)

      inc = new Buffer(4)
      inc.writeUInt32LE(1, 0)

      tr.add(packedKey, inc)

    callback(null)

  (tr, rec) ->
    if (tr instanceof ActiveRecord)
      rec = tr
      tr = null

    start (provider) =>
      callback = -> # empty callback

      transactionalIncrement = fdb.transactional(increment)
      transactionalIncrement(tr || db, @, rec, callback)
