fdb = require('fdb').apiVersion(200)

module.exports = (db) ->
  class Query
    constructor: (@subspace, @key0, @key1) ->

    iterate: (iterator, callback) ->
      throw new Error('not implemented')

    getOptions: ->
      throw new Error('not implemented')

    execute: (tr0, callback) ->
      transaction = (tr, innerCallback) =>
        r0 = @subspace.range(@key0)
        r1 = @subspace.range(@key1)

        iterator = tr.getRange(r0.begin, r1.end, @getOptions())
        @iterate(iterator, innerCallback)

      if (tr0)
        fdb.future.create (futureCb) ->
          transaction(tr0, futureCb)
        , callback
      else
        db.doTransaction(transaction, callback)
