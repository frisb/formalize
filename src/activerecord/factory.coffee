# ActiveCounter = require('./activecounter')
# ActiveIndex = require('./activeindex')

ActiveRecordFactory = (provider) ->
  (typeName, options, callback) ->
    ActiveRecord = require("../provider/foundationdb/activerecord")(options)

    class TypedActiveRecord extends ActiveRecord

    TypedActiveRecord::provider = provider
    TypedActiveRecord::typeName = typeName

    TypedActiveRecord.init(callback)

module.exports = ActiveRecordFactory
