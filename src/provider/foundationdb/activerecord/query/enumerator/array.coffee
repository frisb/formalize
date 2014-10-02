fdb = require('fdb').apiVersion(200)

module.exports = class ArrayEnumerator extends require('./')
  getOptions: ->
    limit: null
    streamingMode: fdb.streamingMode.wantAll

  iterate: (iterator, callback) ->
    iterator.toArray(callback)
    
  execute: (tr, callback) ->
    if (typeof(tr) is 'function')
      callback = tr
      tr = null
    
    complete = (err, arr) =>
      if (err)
        callback(err)
      else
        # iterate every key-value pair returned
        process.nextTick =>
          @parser.in(kv) for kv in arr
          @parser.out(callback)
        
    super(tr, complete)

