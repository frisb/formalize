(function() {
  var Record, db, fdb,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fdb = require('fdb').apiVersion(200);

  db = fdb.open();

  Record = require('./record');

  module.exports = function(typeName, options) {
    var ActiveRecord, dest, index, indexes, prop, schema, src, subspace, _i, _j, _len, _len1;
    ActiveRecord = (function(_super) {
      __extends(ActiveRecord, _super);

      function ActiveRecord() {
        return ActiveRecord.__super__.constructor.apply(this, arguments);
      }

      return ActiveRecord;

    })(Record);
    subspace = new fdb.Subspace(["rec_" + typeName]);
    schema = options.schema;
    indexes = [];
    if (options.indexes) {
      for (_i = 0, _len = indexes.length; _i < _len; _i++) {
        index = indexes[_i];
        indexes.push(new fdb.Subspace(["idx_" + typeName]));
      }
    }
    Object.defineProperties(ActiveRecord.prototype, {
      indexes: {
        get: function() {
          return indexes;
        }
      },
      schema: {
        get: function() {
          return schema;
        }
      },
      subspace: {
        get: function() {
          return subspace;
        }
      },
      typeName: {
        get: function() {
          return typeName;
        }
      }
    });
    for (_j = 0, _len1 = schema.length; _j < _len1; _j++) {
      prop = schema[_j];
      if (typeof prop === 'object') {
        dest = Object.keys(prop)[0];
        src = prop[dest];
      } else {
        src = dest = prop;
      }
      Object.defineProperty(ActiveRecord.prototype, src, {
        get: function() {
          return this.attributes[dest];
        },
        set: function(val) {
          if (typeof val !== 'undefined') {
            return this.attributes[dest] = val;
          }
        }
      });
    }
    return ActiveRecord;
  };

}).call(this);
