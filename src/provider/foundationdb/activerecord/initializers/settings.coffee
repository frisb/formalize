_ = require('underscore')
async = require('async')
fdb = require('fdb').apiVersion(200)
deepak = require('deepak')(fdb)

Debug = require('../../../debug')

matchArray = (array1, array2) ->
  return false if array1.length isnt array2.length
  
  for x, i in array1
    y = array2[i]
    
    return false if (typeof(x) isnt typeof(y))
    
    # do not try match functions
    if (typeof(x) isnt 'function')
      return false if !_.isEqual(x, y)
      
  true

module.exports = (ActiveRecord, callback) ->
  provider = ActiveRecord::provider

  class Setting
    constructor: (@name, @cb) ->
      @value = ActiveRecord::[@name]
      @key = provider.dir.settings.pack([@name])
      @debug = new Debug(provider.config.debug)
      
    activated: ->
      @value.active = true
      @cb(null)
      
      @debug.log('Settings', @name)
      
    verify: (initializer) ->
      return false if @value.initializer.length isnt initializer.length
      
      deepEquals = _.isEqual(@value.initializer, initializer)
      
      if (!deepEquals)
        for x in @value.initializer
          for y in initializer
            if (x.name is y.name)
              # x and y must same numberof properties
              return false if Object.keys(x).length isnt Object.keys(y).length
              
              # try match key array but not filter functions
              return false if !matchArray(x.key, y.key)
              
      true
      
    loadCallback: (initializer) ->
      if (initializer isnt null)
        @debug.buffer('loaded from db', 1)
        
        verified = @verify(initializer)
        @debug.buffer('verified', verified)
        
        if (verified)
          # saved initializer matches provider config
          @value.init(initializer)
          @activated()
        else if (provider.force)
          # config allows the provider to override the saved configuration
          @save(ActiveRecord, @value.initializer)
        else
          message = "Formalize FoundationDB provider configuration for #{@name} does not match the saved initializer.
                    Either modify the config file accordingly, or use the 'force: true' provider flag to save the new configuration." 
          throw new Error(message)
          
      else if (@value)
        debug.buffer(@name, 'initializer not loaded from db')
        
        @save(ActiveRecord, @value.initializer)
      else
        throw new Error("No #{@name} provided for ActiveRecord type '#{ActiveRecord::typeName}'")

    load: (ActiveRecord) ->
      @debug.buffer('loading', 1)
      
      provider.db.get @key, (err, val) =>
        if (err)
          console.error(err)
        else
          @loadCallback(deepak.unpackValue(val))

    save: (ActiveRecord, initializer) ->
      provider.db.set(@key, deepak.packValue(initializer))
      @debug.buffer('saved', 1)
      @activated()

    init: ->
      active = (@value && @value.active)
      @debug.buffer('active', active)
        
      if (active)
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
