module.exports = class Adapter
  constructor: (@dbType) ->
    @db = require("./#{@dbType}/db")
    @getIdGenerator = require("./#{@dbType}/functions/idgenerator")
    @getLoadFunction = require("./#{@dbType}/functions/load")
    @getSaveFunction = require("./#{@dbType}/functions/save")
    @getAllFunction = require("./#{@dbType}/functions/all")
    @getFetchFunction = require("./#{@dbType}/functions/fetch")
