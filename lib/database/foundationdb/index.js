(function() {
  var Database, FoundationDB, fdb,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fdb = require('fdb').apiVersion(200);

  Database = require('../');

  module.exports = FoundationDB = (function(_super) {
    __extends(FoundationDB, _super);

    function FoundationDB(name) {
      FoundationDB.__super__.constructor.call(this, name);
      this.utils = require('./utils');
      this.BatchQuery = require('./query/batch');
    }

    FoundationDB.prototype.init = function(options, callback) {
      var db;
      db = fdb.open();
      return process.nextTick(function() {
        return callback(db);
      });
    };

    FoundationDB.prototype.getIdGenerator = require("./functions/idgenerator");

    FoundationDB.prototype.getLoadFunction = require("./functions/load");

    FoundationDB.prototype.getSaveFunction = require("./functions/save");

    FoundationDB.prototype.getAllFunction = require("./functions/all");

    FoundationDB.prototype.getFetchFunction = require("./functions/fetch");

    FoundationDB.prototype.getSubspace = function(ActiveRecord) {
      return new fdb.Subspace([ActiveRecord.prototype.typeName]);
    };

    return FoundationDB;

  })(Database);

}).call(this);
