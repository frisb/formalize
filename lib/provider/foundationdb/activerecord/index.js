(function() {
  var ActiveRecord, Iterator, ObjectID, initDirectories, initSettings,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ActiveRecord = require('../../../activerecord');

  ObjectID = require('bson').ObjectID;

  initDirectories = require('./initializers/directories');

  initSettings = require('./initializers/settings');

  Iterator = require('./iterator');

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

      FoundationDB_ActiveRecord.prototype.add = require('./functions/add');

      FoundationDB_ActiveRecord.prototype.count = require('./functions/count');

      FoundationDB_ActiveRecord.fetch = function(key0, key1) {
        return new Iterator(this, key0, key1);
      };

      FoundationDB_ActiveRecord.all = function() {
        return new Iterator(this);
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
