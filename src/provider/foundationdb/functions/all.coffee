fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

getFunc = (ActiveRecord, provider, result, map) ->
  (arr, next) ->
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
        rec.data[dest] = deepak.unpack(pair.value)
        result[i] = rec

    next()

reset = (rec) ->
  rec.isNew = false
  rec.isLoaded = true
  rec.changed = []

module.exports = (ActiveRecord) ->
  BatchQuery = require('../query/batch')(@db)
  provide = @getProviderFunction(ActiveRecord)

  (tr, callback) ->
    if (typeof(tr) is 'function')
      callback = tr
      tr = null

    provideCallback = (provider) =>
      result = []
      map = Object.create(null)
      func = getFunc(ActiveRecord, provider, result, map)

      query = new BatchQuery(provider.dir.records, [''], ['\\xff'], func)

      fdb.future.create (futureCb) ->
        complete = (err, res) ->
          map = null

          reset(rec) for rec in result

          futureCb(err, result)

        query.execute(tr, complete)
      , callback

    provide(provideCallback)
