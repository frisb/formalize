fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

ArrayIterator = require('../iterator/array')

module.exports =  (tr, callback) ->
  if (typeof(tr) is 'function')
    callback = tr
    tr = null

  provider = @ActiveRecord::provider

  iterator = new ArrayIterator(provider, provider.dir.records, @key0, @key1)

  complete = (err, arr) ->
    result = []
    map = Object.create(null)

    # iterate every key-value pair returned
    for pair in arr
      key = provider.dir.records.unpack(pair.key)
      id = key[0]
      dest = key[1]

      i = map[id]

      if (typeof(i) isnt 'undefined')
        # get ActiveRecord instance from dictionary
        rec = result[i]
      else
        # create new ActiveRecord instance in dictionary
        i = result.length
        map[id] = i
        rec = new ActiveRecord(id)
        result.push(rec)

      if (dest)
        # set value on ActiveRecord instance attribute
        rec.data(dest, deepak.unpack(pair.value))
        result[i] = rec

    map = null
    rec.reset(true) for rec in result

    callback(err, result)

  iterator.execute(tr, complete)
