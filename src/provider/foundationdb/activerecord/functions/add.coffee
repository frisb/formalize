fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

add = (tr, rec, mechanism, value, callback) ->
  for item in rec[mechanism].items
    directory = rec.provider.dir[mechanism][item.name]

    if (item.filter)
      isSuccess = item.filter(tr, rec)
      
      if (isSuccess)
        if (typeof(isSuccess) is 'function')
          # returns a future
          future = isSuccess
          
          future (isSuccess) ->
            performAddition(rec, item.key) if isSuccess
        else
          performAddition(rec, item.key)

  callback(null)
  
performAddition = (tr, rec, key) ->
  k = []

  for subkey in key
    if (typeof(subkey) is 'function')
      # generate value from function
      data = subkey(rec)
    else
      # get value from record
      data = rec.data(subkey)

    k.push(deepak.packValue(data))

  packedKey = directory.pack(k)

  if (mechanism is 'counters')
    tr.add(packedKey, value)
  else
    tr.set(packedKey, value)

transactionalAdd = fdb.transactional(add)

module.exports = (mechanism) ->
  (tr, value) ->
    transactionalAdd(tr || @provider.db, @, mechanism, value, ->)
