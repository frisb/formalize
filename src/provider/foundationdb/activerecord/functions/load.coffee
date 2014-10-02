Query = require('../query')

module.exports = (tr, callback) ->
  if (typeof(tr) is 'function')
    callback = tr
    tr = null
   
  options =
    key0: [@id]
   
  query = new Query(@.__proto__, options)
  query.toArray tr, (err, arr) ->
    if (err)
      callback(err)
    else if (arr.length >= 1)
      callback(null, arr[0])
      
    