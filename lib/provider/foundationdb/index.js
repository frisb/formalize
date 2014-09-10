(function() {
  var FoundationDB, Provider, fdb,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fdb = require('fdb').apiVersion(200);

  Provider = require('../');

  module.exports = FoundationDB = (function(_super) {
    __extends(FoundationDB, _super);

    function FoundationDB() {
      return FoundationDB.__super__.constructor.apply(this, arguments);
    }

    FoundationDB.prototype.init = function(clusterFile, callback) {
      var db;
      this.fdb = fdb;
      this.dir = null;
      db = fdb.open(clusterFile);
      return process.nextTick(function() {
        return callback(db);
      });
    };

    return FoundationDB;

  })(Provider);

}).call(this);
