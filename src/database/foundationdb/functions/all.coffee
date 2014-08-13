fdb = require('fdb').apiVersion(200)
utils = require('../utils')

module.exports = (ActiveRecord) ->
  BatchQuery = require('../query/batch')(@db)

  subspace = @getSubspace(ActiveRecord)

  (tr, callback) ->
    if (typeof(tr) is 'function')
      callback = tr
      tr = null

    result = []
    map = Object.create(null)

    func = (arr, next) ->
      for pair in arr
        key = subspace.unpack(pair.key)
        id = key[0]
        dest = key[1]

        i = map[id]

        if (i)
          rec = result[i]
        else
          i = result.length
          map[id] = i
          rec = new ActiveRecord(id)
          result.push(rec)

        console.log(rec)

        if (dest)
          rec.attributes[dest] = utils.unpack(pair.value)
          rec.isNew = false
          rec.isLoaded = true
          result[i] = rec

      next()

    query = new BatchQuery(subspace, [''], ['\\xff'], func)

    fdb.future.create (futureCb) ->
      complete = (err, res) ->
        dict = null
        futureCb(err, result)

      query.execute(tr, complete)
    , callback
