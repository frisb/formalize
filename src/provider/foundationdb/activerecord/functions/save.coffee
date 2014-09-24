fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)
    
savePartioned = (tr, rec) ->
  # tr.set(rec.provider.dir.records.pack([rec.id]), deepak.pack(''))
    
  for d in rec.schema.destKeys
    if (d isnt 'id') 
      val = rec.data(d)

      if (typeof(val) isnt 'undefined')
        tr.set(rec.provider.dir.records.pack([rec.id, d]), deepak.packValue(val))
    
save = (tr, rec, callback) ->
  process.nextTick ->
    if (!rec.partition)
      key = [rec.id]
      value = []
      
      for i in [0...rec.schema.destKeys.length - 1]
        v = rec.__d[i + 1]
        
        if typeof v isnt 'undefined'
          key.push(rec.schema.destKeys[i + 1])
          value.push(deepak.packValue(v))
          
      packedKey = rec.provider.dir.records.pack(key)
      packedValue = fdb.tuple.pack(value)
      
      rec.keySize = packedKey.length
      rec.valueSize = packedValue.length
      rec.partition ?= rec.keySize > 100 || rec.valueSize > 1024
      
      if (!rec.partition)
        tr.set(packedKey, packedValue)
      else
        savePartioned(tr, rec)
    else
      savePartioned(tr, rec)
      
    rec.reset(true)
    rec.index(tr)
    rec.add(tr)
  
    callback(null, rec)

transactionalSave = fdb.transactional(save)

module.exports = (tr, callback) ->
  if (typeof(tr) is 'function')
    callback = tr
    tr = null

  fdb.future.create (futureCb) =>
    transactionalSave(tr || @provider.db, @, futureCb)
  , callback
