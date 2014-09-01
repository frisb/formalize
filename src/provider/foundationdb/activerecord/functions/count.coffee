fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

module.exports = (ActiveRecord, activeCounter) ->
  db = @db
  start = @getStartFunction(ActiveRecord)
  generateID = @getIdGenerator()

  count = (tr, counterName, key, callback) ->
    counter = activeCounter[counterName]

    k = []

    for subkey in key
      k.push(deepak.pack(subkey))

    packedKey = counter.subspace.pack(k)

    tr.get packedKey, (err, val) ->
      callback(err, val.readInt32LE(0))

  (tr, counterName, key, callback) ->
    if (typeof(tr) is 'string')
      callback = key
      key = counterName
      counterName = tr
      tr = null

    fdb.future.create (futureCb) =>
      start (provider) =>
        transactionalIncrement = fdb.transactional(count)
        transactionalIncrement(tr || db, counterName, key, futureCb)
    , callback
