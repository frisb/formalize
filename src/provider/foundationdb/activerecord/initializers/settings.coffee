async = require('async')
fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

module.exports = (ActiveRecord, callback) ->
  provider = ActiveRecord::provider

  class Setting
    constructor: (@name, @cb) ->
      @value = ActiveRecord::[@name]
      @key = provider.dir.settings.pack([@name])

    activated: ->
      @value.active = true
      @cb(null)

    loadCallback: (initializer) ->
      if (initializer isnt null)
        @value.init(initializer)
        @activated()
      else if (@value)
        @save(ActiveRecord, @value.initializer)
      else
        throw new Error("No #{@name} provided for ActiveRecord type '#{ActiveRecord::typeName}'")

    load: (ActiveRecord) ->
      provider.db.get @key, (err, val) =>
        if (err)
          console.error(err)
        else
          @loadCallback(deepak.unpack(val))

    save: (ActiveRecord, initializer) ->
      provider.db.set(@key, deepak.pack(initializer))
      @activated()

    init: ->
      if (@value && @value.active)
        @cb(null)
      else
        @load(ActiveRecord)

  initSetting = (name, cb) ->
    setting = new Setting(name, cb)
    setting.init()

  eachCallback = (err) ->
    if (err)
      console.error(err)
    else
      callback()

  async.each(['schema', 'indexes', 'counters'], initSetting, eachCallback)
