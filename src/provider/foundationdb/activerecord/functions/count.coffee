fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

count = (tr, counterName, key, callback) ->
  counter = activeCounter[counterName]

  packedKey = counter.subspace.pack(deepak.packArrayValues(key))

  tr.get packedKey, (err, val) ->
    callback(err, val.readInt32LE(0))

transactionalIncrement = fdb.transactional(count)

module.exports = (ActiveRecord, activeCounter) ->
  db = @db

  (tr, counterName, key, callback) ->
    if (typeof(tr) is 'string')
      callback = key
      key = counterName
      counterName = tr
      tr = null

    # fdb.future.create (futureCb) =>
    #   start (provider) =>
    #     transactionalIncrement(tr || db, counterName, key, futureCb)
    # , callback
