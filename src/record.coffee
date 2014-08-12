module.exports = class Record
  constructor: ->
    @attributes = Object.create(null)
    @previous = Object.create(null)
    @changed = []
    @isLoaded = false
    @isNew = true

  get: (src) ->
    dest = @schema.getDest(src)
    @attributes[dest]

  set: (src, val) ->
    if (typeof val isnt 'undefined')
      dest = @schema.getDest(src)
      currentVal = @attributes[dest]
      @previous[dest] = currentVal if currentVal
      @attributes[dest] = val
      @changed.push(dest)

  # if options.indexes
  #   @indexes.push(new fdb.Subspace(["idx_#{typeName}"])) for index in indexes
