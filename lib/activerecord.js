(function() {
  var Record, Schema,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Record = require('./record');

  Schema = require('./schema');

  module.exports = function(fdb, db) {
    var factory;
    factory = function(typeName, options) {
      var ActiveRecord, applyProperty, s, schema, subspace, _i, _len, _ref;
      subspace = new fdb.Subspace([typeName]);
      schema = new Schema(options.schema);
      ActiveRecord = (function(_super) {
        __extends(ActiveRecord, _super);

        function ActiveRecord(id) {
          this.subspace = subspace;
          this.schema = schema;
          this.attributes = Object.create(null);
          this.previous = Object.create(null);
          this.changed = [];
          this.isLoaded = false;
          this.isNew = true;
          ActiveRecord.__super__.constructor.call(this, id);
        }

        ActiveRecord.prototype.get = function(key) {
          return this.attributes[key];
        };

        ActiveRecord.prototype.set = function(key, val) {
          var currentVal;
          if (typeof val !== 'undefined') {
            currentVal = this.attributes[key];
            if (currentVal) {
              this.previous[key] = currentVal;
            }
            this.attributes[key] = val;
            return this.changed.push(key);
          }
        };

        return ActiveRecord;

      })(Record(fdb, db));
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
    return factory;
  };

}).call(this);
