(function() {
  var ActiveRecord, ObjectID, initDirectories, initSettings,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ActiveRecord = require('../../../activerecord');

  ObjectID = require('bson').ObjectID;

  initDirectories = require('./initializers/directories');

  initSettings = require('./initializers/settings');

  module.exports = function(options) {
    var FoundationDB_AR;
    FoundationDB_AR = (function(_super) {
      __extends(FoundationDB_AR, _super);

      function FoundationDB_AR(id) {
        FoundationDB_AR.__super__.constructor.call(this, id || new ObjectID().toHexString());
      }

      FoundationDB_AR.prototype.load = require('./functions/load');

      FoundationDB_AR.prototype.save = require('./functions/save');

      FoundationDB_AR.prototype.increment = require('./functions/increment');

      FoundationDB_AR.prototype.count = require('./functions/count');

      return FoundationDB_AR;

    })(ActiveRecord(options));
    FoundationDB_AR.all = require('./functions/all');
    FoundationDB_AR.fetch = require('./functions/fetch');
    FoundationDB_AR.init = function(callback) {
      return initDirectories(this, (function(_this) {
        return function() {
          return initSettings(_this, function() {
            return callback(_this);
          });
        };
      })(this));
    };
    return FoundationDB_AR;
  };

}).call(this);
