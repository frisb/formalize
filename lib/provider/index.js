(function() {
  var EventEmitter, Provider,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = require('events').EventEmitter;

  module.exports = Provider = (function(_super) {
    __extends(Provider, _super);

    function Provider(dbType, dbName) {
      var Factory;
      this.dbType = dbType;
      this.dbName = dbName;
      Factory = require('../activerecord/factory');
      this.status = 'disconnected';
      this.db = null;
      this.ActiveRecord = Factory.ActiveRecords;
      this.ActiveCounter = Factory.ActiveCounters;
    }

    Provider.prototype.connect = function(options) {
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

    Provider.prototype.init = function(options, callback) {
      throw new Error('not implemented');
    };

    return Provider;

  })(EventEmitter);

}).call(this);
