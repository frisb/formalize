Formality = require('formality')

module.exports = (options) ->
  if (options.schema instanceof Array)
    schema = ['id'].concat(options.schema)
  else
    schema = { id: 'id' }
    schema[k] = v for k, v of options.schema

  class ActiveSchema extends Formality(schema)
