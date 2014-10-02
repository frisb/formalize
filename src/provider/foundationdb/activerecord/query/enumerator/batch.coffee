fdb = require('fdb').apiVersion(200)

module.exports = class BatchEnumerator extends require('./')
  getOptions: -> 
    limit: null
    streamingMode: fdb.streamingMode.iterator

  iterate: (iterator, callback) ->
    iterator.forEachBatch(@func, callback)
    
  execute: (tr, callback) ->
    if (typeof(tr) is 'function')
      callback = tr
      tr = null
    
    # deferred to #execute()
    @func = (arr, next) =>
      # iterate every key-value pair returned
      process.nextTick =>
        @parser.in(kv) for kv in arr
        @parser.out(callback)
        
      next()
    
    complete = (err, res) =>
      if (err)
        callback(err)
      else
        if (@parser.assembled.length > 0)
          callback(null, @assembled)
        else if (@parser.currentRecord isnt null)
          @parser.currentRecord.reset(true)
          callback(null, [@parser.currentRecord])
        callback(null, null)
        
    super(tr, complete)
