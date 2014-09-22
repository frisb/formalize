fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

EachIterator = require('../iterator/each')

getFunc = (ActiveRecord, provider, fluxRecord, callback) ->
  (pair, next) ->
    key = provider.dir.records.unpack(pair.key)
    id = key[0]
    dest = key[1]

    if (fluxRecord isnt null)
      rec = fluxRecord

      if (fluxRecord.id isnt id)
        # fluxRecord.reset(true)
        callback(fluxRecord)

        # create new ActiveRecord instance in dictionary
        rec = new ActiveRecord(id)
    else
      # create new ActiveRecord instance in dictionary
      rec = new ActiveRecord(id)

    # if (dest)
    #   val = deepak.unpack(pair.value)
    #
    #   if (typeof(val) isnt 'undefined')
    #     # set value on ActiveRecord instance attribute
    #     rec.data[dest] = val

    fluxRecord = rec

    next()

module.exports =  (tr, callback) ->
  if (typeof(tr) is 'function')
    callback = tr
    tr = null

  provider = @ActiveRecord::provider

  fluxRecord = null

  func = getFunc(@ActiveRecord, provider, fluxRecord, callback)
  iterator = new EachIterator(provider, provider.dir.records, @key0, @key1)

  iterator.execute(tr, func)
