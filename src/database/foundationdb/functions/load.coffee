fdb = require('fdb').apiVersion(200)
utils = require('../utils')

module.exports = (ActiveRecord) ->
  ArrayQuery = require('../query/array')(@db)

  subspace = @getSubspace(ActiveRecord)
  schema = ActiveRecord::schema

  (tr, callback) ->
    query = new ArrayQuery(subspace, [@id], [@id])

    if (typeof(tr) is 'function')
      callback = tr
      tr = null

    query.execute tr, (err, arr) =>
      for pair in arr
        key = subspace.unpack(pair.key)
        dest = key[1]
        @attributes[dest] = utils.unpack(pair.value)

      if (!err)
        @isLoaded = true
        @isNew = false

      callback(err)
