surreal = require('surreal')
Writeln = require('writeln')

writelns = {}

jsonShrink = (s) ->
  s = surreal.serialize(s, 2) if typeof s isnt 'string'
  
  if (s[0] is '{' && s[s.length - 1] is '}')
    # json
    
    s = s
    .substr(1, s.length - 2)
    #.replace(/"/g, '')
    #.replace(/:/g, ': ')
    #.replace(/,/g, '\n')                
    #.replace(/\{/g, '{ ')
    #.replace(/\}/g, ' }')
  
  s

module.exports = class Debug
  constructor: (@isActive) ->
    @buf = null
    
  buffer: (description, data, transformer, scope) ->
    if (@isActive)
      @buf = Object.create(null) if (@buf is null)
      
      data = transformer.call(scope || @, data) if transformer
      
      @buf[description] = data
      
  log: (category, text) ->
    writeln = writelns[category]
    
    if (!writeln)
      writeln = new Writeln(category)
      writelns[category] = writeln
    
    if (@buf isnt null)
      metadata = jsonShrink(@buf)
      @buf = null
    
    writeln.debug(text, metadata)
    