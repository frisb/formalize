(function() {
  var Adapter, Schema;

  Adapter = require('./adapter');

  Schema = require('./schema');

  module.exports = function(dbType) {
    var adapter, generateID;
    adapter = new Adapter(dbType);
    generateID = adapter.getIdGenerator();
    return function(typeName, options) {
      var ActiveRecord, applyProperty, s, schema, _i, _len, _ref;
      schema = new Schema(options.schema);
      ActiveRecord = (function() {
        function ActiveRecord(id) {
          this.id = id;
          if (!this.id) {
            this.id = generateID();
          }
          this.attributes = Object.create(null);
          this.previous = Object.create(null);
          this.changed = [];
          this.isLoaded = false;
          this.isNew = true;
        }

        ActiveRecord.prototype.get = function(src) {
          var dest;
          dest = schema.getDest(src);
          return this.attributes[dest];
        };

        ActiveRecord.prototype.set = function(src, val) {
          var currentVal, dest;
          if (typeof val !== 'undefined') {
            dest = schema.getDest(src);
            currentVal = this.attributes[dest];
            if (currentVal) {
              this.previous[dest] = currentVal;
            }
            this.attributes[dest] = val;
            return this.changed.push(dest);
          }
        };

        return ActiveRecord;

      })();
      ActiveRecord.prototype.typeName = typeName;
      ActiveRecord.prototype.schema = schema;
      ActiveRecord.all = adapter.getAllFunction(ActiveRecord);
      ActiveRecord.fetch = adapter.getFetchFunction(ActiveRecord);
      ActiveRecord.prototype.load = adapter.getLoadFunction(ActiveRecord);
      ActiveRecord.prototype.save = adapter.getSaveFunction(ActiveRecord);
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
