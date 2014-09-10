mechanisms = {}

class Mechanism
  constructor: (mechanism) ->
    @name = mechanism.name
    @key = mechanism.key
    @filter= mechanism.filter
    @value= mechanism.value

class ActiveMechanism
  constructor: (initializer) ->
    @init(initializer)

  init: (@initializer) ->
    if (@initializer)
      @items = []
      for mechanism in @initializer
        index = new Mechanism(mechanism)
        @items.push(mechanism)
        @[mechanism.name] = mechanism

objectToArray = (obj) ->
  arr = []
  for k, v of obj
    v.name = k
    arr.push(v)

  arr

module.exports = (typeName, mechanismName, options) ->
  key = "#{@dbType}:#{@dbName}:#{typeName}:#{mechanismName}"
  mech = mechanisms[key]

  if (!mech && options[mechanismName])
    initializer = options[mechanismName]
    initializer = objectToArray(initializer) if (!(initializer instanceof Array))

    mech = new ActiveMechanism(initializer)

    mechanisms[key] = mech
  else
    mech
