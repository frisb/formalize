async = require('async')
fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

module.exports = (mechanism) ->
  pack = (directory, rec, key) ->
    rk = resolveKey(rec, key)
    directory.pack(deepak.packArrayValues(rk))
  
  resolveKey = (rec, key) ->
    rk = []
  
    for subkey in key
      if (typeof(subkey) is 'function')
        # generate value from function
        data = subkey(rec)
      else
        # get value from record
        data = rec.data(subkey)
  
      rk.push(data)
      
    rk
  
  keyCheck = (tr, rec, item, value, callback) ->
    indexDir = rec.provider.dir.indexes[item.name]
    k = pack(indexDir, rec, item.dependsOnIndexKey) 
    
    #tr.options.setReadYourWritesDisable()
    
    keySelector = fdb.KeySelector.firstGreaterOrEqual(k)
    
    tr.getKey keySelector, (err, val) ->
      if (!err && val is null)
        performAddition(tr, rec, item, value) 
        
      callback(err)
      return
  
  add = (tr, rec, value, callback) ->
    process = (item, cb) ->
      if (item.filter)
        isSuccess = item.filter(rec)
        
        if (isSuccess)
          if (item.dependsOnIndexKey)
            keyCheck(tr, rec, item, value, cb)
          else
            performAddition(tr, rec, item, value) 
            cb()
        else 
          cb()
      else 
        cb()
        
      return
    
    async.each(rec[mechanism].items, process, callback)
    return
    
  performAddition = (tr, rec, item, value) ->
    directory = rec.provider.dir[mechanism][item.name]
    k = pack(directory, rec, item.key)
    
    if (mechanism is 'counters')
      tr.add(k, value || 1)
    else      
      tr.set(k, value)
      
    return
  
  transactionalAdd = fdb.transactional(add)
  
  (tr, value, callback) ->
    complete = (err) ->
      throw new Error(err) if (err)
      callback(null)
      return
    
    transactionalAdd(tr || @provider.db, @, value, complete)
