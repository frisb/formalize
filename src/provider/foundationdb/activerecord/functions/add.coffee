fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

countDictTest = {}

module.exports = (mechanism) ->
  resolveKey = (rec, key) ->
    resolvedKey = []
  
    for subkey in key
      if (typeof(subkey) is 'function')
        # generate value from function
        data = subkey(rec)
      else
        # get value from record
        data = rec.data(subkey)
  
      resolvedKey.push(data)
      
    resolvedKey
  
  add = (tr, rec, value, callback) ->
    for item in rec[mechanism].items
      if (!item.filter || item.filter(rec))
        # no filter or successfully filtered
        directory = rec.provider.dir[mechanism][item.name]
        resolvedKey = resolveKey(rec, item.key)
        packedKey = directory.pack(deepak.packArrayValues(resolvedKey))
        
        if (mechanism is 'counters')
          #testKey = "#{item.name}:#{rec.id}"
          #
          #if (countDictTest[testKey])
            #console.log(testKey)
          #else
            #countDictTest[testKey] = 1
          
          #console.log(value)
          
          tr.add(packedKey, value)
        else      
          tr.set(packedKey, value)
      
    return
  
  #transactionalAdd = fdb.transactional(add)
  
  (tr, value) ->
    complete = (err) ->
      throw new Error(err) if (err)
      return
    
    #transactionalAdd(tr || @provider.db, @, value, complete)
    add(tr, @, value)
