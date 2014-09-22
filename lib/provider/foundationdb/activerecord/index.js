(function() {
  var ActiveRecord, Adder, CounterAdd, IndexAdd, ObjectID, Query, add, deepak, fdb, index, initDirectories, initSettings,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fdb = require('fdb').apiVersion(200);

  deepak = require('deepak')(fdb);

  ActiveRecord = require('../../../active/record');

  ObjectID = require('bson').ObjectID;

  initDirectories = require('./initializers/directories');

  initSettings = require('./initializers/settings');

  Query = require('./query');

  Adder = require('./functions/add');

  IndexAdd = Adder('indexes');

  CounterAdd = Adder('counters');

  index = function(tr, value) {
    var v;
    if (typeof index.value === 'function') {
      v = deepak.pack(index.value(this));
    } else {
      value = '';
    }
    return IndexAdd.call(this, tr, value);
  };

  add = function(tr, value) {
    var inc;
    if (typeof tr === 'number') {
      value = tr;
      tr = null;
    }
    inc = new Buffer(4);
    inc.writeUInt32LE(value || 1, 0);
    return CounterAdd.call(this, tr, inc);
  };

  module.exports = function(options) {
    var FoundationDB_ActiveRecord;
    return FoundationDB_ActiveRecord = (function(_super) {
      __extends(FoundationDB_ActiveRecord, _super);

      function FoundationDB_ActiveRecord(id) {
        if (typeof id === 'undefined') {
          id = new ObjectID().toHexString();
        }
        FoundationDB_ActiveRecord.__super__.constructor.call(this, id);
      }

      FoundationDB_ActiveRecord.prototype.load = require('./functions/load');

      FoundationDB_ActiveRecord.prototype.save = require('./functions/save');

      FoundationDB_ActiveRecord.prototype.index = index;

      FoundationDB_ActiveRecord.prototype.add = add;

      FoundationDB_ActiveRecord.prototype.count = require('./functions/count');

      FoundationDB_ActiveRecord.fetch = function(index, key0, key1) {
        return new Query(this, index, key0, key1);
      };

      FoundationDB_ActiveRecord.all = function() {
        return new Query(this, 'pk', [], ['\xff']);
      };

      FoundationDB_ActiveRecord.reindex = function(name) {
        return this.all().forEachBatch(function(err, arr) {
          var rec, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = arr.length; _i < _len; _i++) {
            rec = arr[_i];
            if (rec.C === 64502) {
              _results.push(console.log(rec.data));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        });
      };

      FoundationDB_ActiveRecord.init = function(callback) {
        return initDirectories(this, (function(_this) {
          return function() {
            return initSettings(_this, function() {
              return callback(_this);
            });
          };
        })(this));
      };

      return FoundationDB_ActiveRecord;

    })(ActiveRecord(options));
  };

}).call(this);
