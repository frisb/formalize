fdb = require('fdb').apiVersion(200)

module.exports = (ActiveRecord) ->
  (query, tr, callback) ->
    if (typeof(tr) is 'function')
      callback = tr
      tr = null

    fdb.future.create (futureCb) ->
      query.execute(tr, futureCb)
    , callback