fdb = require('fdb').apiVersion(200)

module.exports =
  pack: (val) ->
    switch typeof val
      when 'undefined' then return fdb.tuple.pack([0, ''])                    # undefined
      when 'string' then return fdb.tuple.pack([1, new Buffer(val)])          # string
      when 'number'
        if (val % 1 is 0)
          return fdb.tuple.pack([2, val])                                     # integer
        else
          return fdb.tuple.pack([3, new Buffer('' + val)])                    # decimal
      when 'boolean' then return fdb.tuple.pack([4, (if val then 1 else 0)])  # boolean
      else
        if (val is null)
          return fdb.tuple.pack([5, ''])                                      # null
        else if (val instanceof Date)
          return fdb.tuple.pack([6, val.getTime()])                           # dates
        else if (val instanceof Array || val instanceof Object)
          return fdb.tuple.pack([7, new Buffer(JSON.stringify(val))])         # array or objects
        else
          throw new Error("the packValue function only accepts string, number, boolean, date, array and object")

  unpack: (val) ->
    if(!val)
      return null

    unpacked = fdb.tuple.unpack(val)
    type = unpacked[0]
    val = unpacked[1]

    switch type
      when 0 then return                                                      # undefined
      when 1 then return '' + val.toString()                                  # string
      when 2 then return val                                                  # integer
      when 3 then return parseFloat('' + val)                                 # decimal
      when 4 then return val is 1                                             # boolean
      when 5 then return null                                                 # null
      when 6 then return new Date(val)                                        # date
      when 7 then return JSON.parse('' + val)                                 # array or object

      else
        throw new Error("the type (#{type}) of the passed val is unknown")
