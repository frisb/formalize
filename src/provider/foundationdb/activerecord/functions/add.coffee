fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

add = (tr, rec, mechanism, value, callback) ->
  for item in rec[mechanism].items
    directory = rec.provider.dir[mechanism][item.name]

    if (!item.filter || item.filter(rec))
      k = []

      for subkey in item.key
        if (typeof(subkey) is 'function')
          data = subkey(rec)
        else
          data = rec.data[subkey]

        k.push(deepak.pack(data))

      packedKey = directory.pack(k)

      if (mechanism is 'counters')
        tr.add(packedKey, value)
      else
        tr.set(packedKey, value)

  callback(null)

transactionalAdd = fdb.transactional(add)

module.exports = (mechanism) ->
  (tr, value) ->
    transactionalAdd(tr || @provider.db, @, mechanism, value, ->)
