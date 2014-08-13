(function() {
  var Record, Schema,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Record = require('./record');

  Schema = require('./schema');

  module.exports = function(db) {
    var generateID;
    generateID = db.getIdGenerator();
    return function(typeName, options) {
      var ActiveRecord, applyProperty, s, schema, _i, _len, _ref;
      schema = new Schema(options.schema);
      ActiveRecord = (function(_super) {
        __extends(ActiveRecord, _super);

        function ActiveRecord(id) {
          this.id = id;
          ActiveRecord.__super__.constructor.call(this);
          if (!this.id) {
            this.id = generateID();
          }
        }

        return ActiveRecord;

      })(Record);
      ActiveRecord.prototype.typeName = typeName;
      ActiveRecord.prototype.schema = schema;
      ActiveRecord.all = db.getAllFunction(ActiveRecord);
      ActiveRecord.fetch = db.getFetchFunction(ActiveRecord);
      ActiveRecord.prototype.load = db.getLoadFunction(ActiveRecord);
      ActiveRecord.prototype.save = db.getSaveFunction(ActiveRecord);
      applyProperty = function(src) {
        return Object.defineProperty(ActiveRecord.prototype, src, {
          get: function() {
            return this.get(src);
          },
          set: function(val) {
            return this.set(src, val);
          }
        });
      };
      _ref = schema.src;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        applyProperty(s);
      }
      return ActiveRecord;
    };
  };

}).call(this);
