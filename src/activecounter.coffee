module.exports = (provider, ActiveRecord, options) ->
  class Counter
    constructor: (counter) ->
      @name = counter.name
      @key = counter.key
      @filter= counter.filter

      @transform()

    transform: provider.getTransformCounterFunction(ActiveRecord)
    increment: provider.getIncrementFunction(ActiveRecord)

  class ActiveCounter
    constructor: (initializer) ->
      @init(initializer)

    init: (@initializer) ->
      if (@initializer)
        @items = []
        for counter in @initializer
          counter = new Counter(counter)
          @items.push(counter)
          @[counter.name] = counter

  objectToArray = (obj) ->
    arr = []
    for counterName, counter of obj
      counter.name = counterName
      arr.push(counter)

    arr

  if (options.counters)
    counters = if (!(options.counters instanceof Array)) then objectToArray(options.counters) else options.counters

    activeCounter = new ActiveCounter(counters)

    ActiveRecord::counters = activeCounter
    ActiveRecord.count = provider.getCountFunction(ActiveRecord, activeCounter)
