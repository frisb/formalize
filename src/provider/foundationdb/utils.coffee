# modelled on https://github.com/leaflevellabs/node-foundationdblayers/blob/master/lib/utils.js
fdb = require('fdb').apiVersion(200)
tuple = fdb.tuple

packValue = (val) ->
  switch typeof val
    when 'undefined' then tuple.pack([0, ''])                   # undefined
    when 'string' then tuple.pack([1, new Buffer(val)])         # string
    when 'number' then packNumber(val)                          # number
    when 'boolean' then tuple.pack([4, (if val then 1 else 0)]) # boolean
    else packObject(val)

packNumber = (val) ->
  if (val % 1 is 0) then tuple.pack([2, val]) # integer
  else tuple.pack([3, new Buffer('' + val)])  # decimal

packObject = (val) ->
  if (val is null) then tuple.pack([5, ''])                                             # null
  else if (val instanceof Date) then tuple.pack([6, val.getTime()])                     # dates
  else if (val instanceof Array) then tuple.pack([7, packArray(val)])                   # array
  else if (val instanceof Object) then tuple.pack([8, new Buffer(JSON.stringify(val))]) # object

  else
    throw new Error("the packValue function only accepts string, number, boolean, date, array and object")

packArray = (val) ->
  arr = []
  arr.push(packValue(child)) for child in val
  tuple.pack(arr)

unpackValue = (val) ->
  if(!val)
     return null

  unpacked = tuple.unpack(val)
  type = unpacked[0]
  val = unpacked[1]

  switch type
    when 0 then return                # undefined
    when 1 then '' + val.toString()   # string
    when 2 then val                   # integer
    when 3 then parseFloat('' + val)  # decimal
    when 4 then val is 1              # boolean
    when 5 then null                  # null
    when 6 then new Date(val)         # date
    when 7 then unpackArray(val)      # array
    when 8 then JSON.parse('' + val)  # object

    else
      throw new Error("the type (#{type}) of the passed val is unknown")

unpackArray = (val) ->
  arr = []
  arr.push(unpackValue(child)) for child in tuple.unpack(val)
  arr

module.exports =
  pack: packValue
  unpack: unpackValue