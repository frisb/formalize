module.exports = class Schema
  constructor: (initializer) ->
    @src = []
    @dest = []
    @map = {}

    if (initializer instanceof Array)
      for sd, i in val
        @src.push(sd)
        @dest.push(sd)
        @map[sd] = i
    else
      i = 0
      for s, d of initializer
        @src.push(s)
        @dest.push(d)
        @map[d] = i
        i++
