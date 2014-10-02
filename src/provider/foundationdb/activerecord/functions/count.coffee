fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

count = (tr, ActiveRecordPrototype, counterName, key, callback) ->
  counter = ActiveRecordPrototype.counters[counterName]
  directory = ActiveRecordPrototype.provider.dir.counters[counterName]
  typedValueKey = deepak.packArrayValues(key)
  
  tr.get(directory.pack(typedValueKey), callback)

transactionalCount = fdb.transactional(count)

module.exports = (tr, counterName, key, callback) ->
  if (typeof(tr) is 'string')
    callback = key
    key = counterName
    counterName = tr
    tr = null

  ActiveRecordPrototype = @::

  complete = (err, val) ->
    callback(err, val.readInt32LE(0))

  transactionalCount(tr || @::provider.db, ActiveRecordPrototype, counterName, key, complete)
