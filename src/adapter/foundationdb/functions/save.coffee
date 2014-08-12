db = require('../db')
fdb = require('fdb').apiVersion(200)
utils = require('../utils')

module.exports = (ActiveRecord) ->
  subspace = new fdb.Subspace([ActiveRecord::typeName])
  schema = ActiveRecord::schema

  (tr0, callback) ->
    if (typeof(tr0) is 'function')
      callback = tr0
      tr0 = null

    transaction = (tr, innerCallback) =>
      tr.set(subspace.pack([@id]), utils.pack(''))

      for d in schema.dest
        val = @attributes[d]
        tr.set(subspace.pack([@id, d]), utils.pack(val))

      # for index in indexes
      #   index
      # tr.set(ctaIndex.pack([@carrier, t, @A, @tag]), '')

      @isNew = false
      innerCallback()

    if (tr0)
      fdb.future.create (futureCb) ->
        transaction(tr0, futureCb)
      , callback
    else
      db.doTransaction(transaction, callback)
