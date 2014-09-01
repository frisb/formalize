fdb = require('fdb').apiVersion(200)

module.exports = (ActiveRecord) ->
  (query, tr, callback) ->
    if (typeof(tr) is 'function')
      callback = tr
      tr = null

    query.execute(tr, callback)
