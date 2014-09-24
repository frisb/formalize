fdb = require('fdb').apiVersion(200)

module.exports = class EachEnumerator extends require('./')
  getOptions: ->
    limit: null
    streamingMode: fdb.streamingMode.iterator

  iterate: (iterator, callback) ->
    iterator.forEach(callback)
    
  execute: (tr, callback) ->
    if (typeof(tr) is 'function')
      callback = tr
      tr = null
    
    func = (kv, next) =>
      # iterate every key-value pair returned
      process.nextTick =>
        @assembler.pumpIn(kv)
        @assembler.pumpOut(callback)
        
      next()
        
    super(tr, func)
