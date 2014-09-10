fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

save = (tr, rec, callback) ->
  tr.set(rec.provider.dir.records.pack([rec.id]), deepak.pack(''))

  for d in rec.schema.dest
    if (d isnt 'id')
      val = rec.data[d]

      if (typeof(val) isnt 'undefined')
        tr.set(rec.provider.dir.records.pack([rec.id, d]), deepak.pack(val))

    rec.isNew = false
    rec.isLoaded = true
    rec.changed = []

  rec.index(tr)
  rec.add(tr)

  callback(null, rec)

transactionalSave = fdb.transactional(save)

module.exports = (tr, callback) ->
  if (typeof(tr) is 'function')
    callback = tr
    tr = null

  fdb.future.create (futureCb) =>
    transactionalSave(tr || @provider.db, @, futureCb)
  , callback
