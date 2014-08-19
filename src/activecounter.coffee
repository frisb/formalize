module.exports = (db) ->
  (name, key) ->
    class ActiveCounter
      @name = name
      @key = key

      increment: db.getIncrementCountFunction(ActiveCounter)
      get: db.getGetCountFunction(ActiveCounter)
