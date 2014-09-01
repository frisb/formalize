(function() {
  var ActiveRecordFactory,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ActiveRecordFactory = function(provider) {
    return function(typeName, options, callback) {
      var ActiveRecord, TypedActiveRecord;
      ActiveRecord = require("../provider/foundationdb/activerecord")(options);
      TypedActiveRecord = (function(_super) {
        __extends(TypedActiveRecord, _super);

        function TypedActiveRecord() {
          return TypedActiveRecord.__super__.constructor.apply(this, arguments);
        }

        return TypedActiveRecord;

      })(ActiveRecord);
      TypedActiveRecord.prototype.provider = provider;
      TypedActiveRecord.prototype.typeName = typeName;
      return TypedActiveRecord.init(callback);
    };
  };

  module.exports = ActiveRecordFactory;

}).call(this);
