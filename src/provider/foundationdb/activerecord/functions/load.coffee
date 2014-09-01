fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

module.exports = (tr, callback) ->
  if (typeof(tr) is 'function')
    callback = tr
    tr = null

  ArrayQuery = require('../query/array')(@provider.db)

  query = new ArrayQuery(@provider.dir.records, [@id], [@id])

  queryCallback = (err, arr) =>
    for pair in arr
      key = @provider.dir.records.unpack(pair.key)
      dest = key[1]
      @data[dest] = deepak.unpack(pair.value)

    if (!err)
      @isLoaded = true
      @isNew = false

    callback(err)

  query.execute(tr, queryCallback)
