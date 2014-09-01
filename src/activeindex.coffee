module.exports = (provider, ActiveRecord, options) ->
  class Index
    constructor: (index) ->
      @name = index.name
      @key = index.key
      @filter= index.filter

      @transform()

    transform: provider.getTransformIndexFunction(ActiveRecord)
    add: provider.getIndexAddFunction(ActiveRecord)

  class ActiveIndex
    constructor: (initializer) ->
      @init(initializer)

    init: (@initializer) ->
      if (@initializer)
        @items = []
        for index in @initializer
          index = new Index(index)
          @items.push(index)
          @[index.name] = index

  objectToArray = (obj) ->
    arr = []
    for indexName, index of obj
      index.name = indexName
      arr.push(index)

    arr

  if (options.indexes)
    indexes = if (!(options.indexes instanceof Array)) then objectToArray(options.indexes) else options.indexes

    activeIndex = new ActiveIndex(indexes)

    ActiveRecord::indexes = activeIndex
