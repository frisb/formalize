(function() {
  var Record, getSchema,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Record = require('./record');

  module.exports = function(db) {
    return function(typeName, options) {
      var ActiveRecord;
      ActiveRecord = (function(_super) {
        __extends(ActiveRecord, _super);

        function ActiveRecord() {
          return ActiveRecord.__super__.constructor.apply(this, arguments);
        }

        return ActiveRecord;

      })(Record(getSchema(options)));
      ActiveRecord.prototype.typeName = typeName;
      ActiveRecord.all = db.getAllFunction(ActiveRecord);
      ActiveRecord.fetch = db.getFetchFunction(ActiveRecord);
      ActiveRecord.prototype.load = db.getLoadFunction(ActiveRecord);
      ActiveRecord.prototype.save = db.getSaveFunction(ActiveRecord);
      return ActiveRecord;
    };
  };

  getSchema = function(options) {
    var k, schema, v, _ref;
    if (options.schema instanceof Array) {
      schema = ['id'].concat(options.schema);
    } else {
      schema = {
        id: 'id'
      };
      _ref = options.schema;
      for (k in _ref) {
        v = _ref[k];
        schema[k] = v;
      }
    }
    return schema;
  };

}).call(this);
