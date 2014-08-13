(function() {
  var Database, EventEmitter, extend,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = require('events').EventEmitter;

  extend = function(a, b) {
    var key, val, _results;
    _results = [];
    for (key in b) {
      val = b[key];
      _results.push(a[key] = val);
    }
    return _results;
  };

  module.exports = Database = (function(_super) {
    __extends(Database, _super);

    function Database(name) {
      this.name = name;
      this.ActiveRecord = require('../activerecord')(this);
      this.status = 'disconnected';
      this.db = null;
    }

    Database.prototype.connect = function(options) {
      var callback;
      switch (this.status) {
        case 'connected':
          this.emit('connected', this);
          break;
        case 'disconnected':
          this.status = 'connecting';
          callback = (function(_this) {
            return function(db) {
              _this.status = 'connected';
              _this.db = db;
              return _this.emit('connected', _this);
            };
          })(this);
          this.init(options, callback);
      }
      return this;
    };

    Database.prototype.init = function(options, callback) {
      throw new Error('not implemented');
    };

    Database.prototype.getIdGenerator = function(ActiveRecord) {
      throw new Error('not implemented');
    };

    Database.prototype.getLoadFunction = function(ActiveRecord) {
      throw new Error('not implemented');
    };

    Database.prototype.getSaveFunction = function(ActiveRecord) {
      throw new Error('not implemented');
    };

    Database.prototype.getAllFunction = function(ActiveRecord) {
      throw new Error('not implemented');
    };

    Database.prototype.getFetchFunction = function(ActiveRecord) {
      throw new Error('not implemented');
    };

    return Database;

  })(EventEmitter);

}).call(this);
