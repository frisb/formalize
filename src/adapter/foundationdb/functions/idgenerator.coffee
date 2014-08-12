{ObjectID} = require('bson')

module.exports = (ActiveRecord) ->
  ->
    new ObjectID().toHexString()
